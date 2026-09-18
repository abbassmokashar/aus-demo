/**
 * Checks the Webflow polling trigger in webflow/apps-script/CostEstimatePdfWorker.gs
 * against fake API data.
 *
 * The poll has to survive two things that cannot be checked by hand without waiting
 * for real submissions: the endpoint's undocumented sort order, and the cursor that
 * decides which submissions have already been emailed. It also covers the guards on
 * the public POST endpoint, which is what keeps a readable-in-the-page secret from
 * turning into a way to mail anyone at will. Run with:
 *
 *   node .visual-check/webflow-poll-check.js
 *
 * Nothing here touches the network. UrlFetchApp, MailApp, PropertiesService,
 * CacheService and Logger are all stubbed.
 */

const fs = require('fs');
const path = require('path');

const WORKER = path.join(__dirname, '..', 'webflow', 'apps-script', 'CostEstimatePdfWorker.gs');
const SITE = 'site123';

let passed = 0;
let failed = 0;

function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    passed++;
    console.log(`  ok   ${label}`);
  } else {
    failed++;
    console.log(`  FAIL ${label}\n         expected: ${JSON.stringify(expected)}\n         actual:   ${JSON.stringify(actual)}`);
  }
}

// ---------------------------------------------------------------------------
// Fake Google Apps Script environment
// ---------------------------------------------------------------------------

function makeEnv(options) {
  const props = new Map();
  const cache = new Map();
  const sent = [];
  const logs = [];

  const triggers = [];

  const response = (code, body) => ({
    getResponseCode: () => code,
    getContentText: () => (typeof body === 'string' ? body : JSON.stringify(body)),
    getBlob: () => ({
      getBytes: () => [1, 2, 3],
      getContentType: () => 'image/png',
    }),
  });

  const env = {
    props,
    cache,
    sent,
    logs,
    requests: [],
    UrlFetchApp: {
      fetch(url, opts) {
        env.requests.push(url);
        if (url.indexOf('https://api.webflow.com/v2') === 0) {
          const full = url.slice('https://api.webflow.com/v2'.length);
          const byId = full.match(/\/form_submissions\/([^?]+)/);
          if (byId) {
            const found = options.submissions.find((s) => s.id === byId[1]);
            return found ? response(200, found) : response(404, { message: 'not found' });
          }
          if (/\/forms(\?|$)/.test(full)) {
            return response(200, { forms: options.forms });
          }
          const offsetMatch = full.match(/offset=(\d+)/);
          const offset = offsetMatch ? Number(offsetMatch[1]) : 0;
          return response(200, pageOf(options, offset));
        }
        return response(200, { logo: true });
      },
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (name) => (props.has(name) ? props.get(name) : null),
        setProperty: (name, value) => props.set(name, String(value)),
      }),
    },
    CacheService: {
      getScriptCache: () => ({
        get: (key) => (cache.has(key) ? cache.get(key) : null),
        put: (key, value) => cache.set(key, String(value)),
      }),
    },
    MailApp: {
      sendEmail(to, subject) {
        sent.push({ to, subject });
      },
    },
    Logger: { log: (...args) => logs.push(args.map(String).join(' ')) },
    triggers,
    Utilities: {
      newBlob: () => ({
        getAs: () => ({ setName: () => ({ name: 'pdf', getBytes: () => [1] }) }),
      }),
      base64Encode: () => 'AAAA',
    },
    ContentService: {
      createTextOutput: (text) => ({ setMimeType: () => ({ text }) }),
      MimeType: { TEXT: 'text/plain', JSON: 'application/json' },
    },
    ScriptApp: {
      getProjectTriggers: () => triggers.slice(),
      deleteTrigger: (trigger) => {
        const index = triggers.indexOf(trigger);
        if (index !== -1) triggers.splice(index, 1);
      },
      newTrigger: (handler) => ({
        timeBased: () => ({
          everyMinutes: () => ({
            create: () => triggers.push({ getHandlerFunction: () => handler }),
          }),
        }),
      }),
    },
  };

  // Mirrors the API: records are sliced by offset in whatever order the data is in.
  function pageOf(opts, offset) {
    return {
      formSubmissions: opts.submissions.slice(offset, offset + 100),
      pagination: { limit: 100, offset, total: opts.submissions.length },
    };
  }

  return env;
}

function loadWorker(env) {
  const src = fs.readFileSync(WORKER, 'utf8');
  const names = [
    'UrlFetchApp', 'PropertiesService', 'CacheService', 'MailApp', 'Logger',
    'Utilities', 'ContentService', 'ScriptApp',
  ];
  const factory = new Function(...names, `${src}
    return { pollWebflowSubmissions, installWebflowPolling, uninstallWebflowPolling,
             webflowSubmissionsSince_, webflowFormElementId_, doPost,
             verifyWebflowPolling, resendEstimateById };`);
  return factory(...names.map((name) => env[name]));
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const FORMS = [
  { displayName: 'Cost Calculator Access', formElementId: 'element-gate' },
  { displayName: 'Cost Estimate Request', formElementId: 'element-estimate' },
];

const NAMES = [
  'Airport Operations',
  'Cabin Crew',
  'Aircraft Maintenance',
  'Flight Dispatch',
  'Aviation Security',
];

function submission(index, name) {
  const date = new Date(Date.UTC(2026, 0, 1 + index, 9, index % 60, 0));
  return {
    id: `sub-${index}`,
    displayName: name || 'Cost Estimate Request',
    siteId: SITE,
    dateSubmitted: date.toISOString(),
    formResponse: {
      Email: `student${index}@example.com`,
      'First-Name': 'Test',
      Program: 'Aviation Management',
      'Estimate-Total': "CHF 57'100",
      'Estimate-HTML': '<style>.print-total-banner{background:#111827}</style><p>Estimate</p>',
    },
  };
}

/** Every minute the poll emails whatever is newer than the cursor. */
function submissions(count, order, nameFor) {
  const list = [];
  for (let i = 0; i < count; i++) list.push(submission(i, nameFor ? nameFor(i) : undefined));
  return order === 'descending' ? list.reverse() : list;
}

function run(label, dataset, cursor, expectedIds) {
  console.log(`\n${label}`);
  const env = makeEnv({ forms: FORMS, submissions: dataset });
  env.props.set('WF_TOKEN', 'token-abc');
  env.props.set('WF_SITE_ID', SITE);
  env.props.set('WF_LAST_POLL', cursor);
  const { pollWebflowSubmissions, webflowSubmissionsSince_ } = loadWorker(env);

  const elementId = dataset.length ? 'element-estimate' : '';
  const fresh = webflowSubmissionsSince_('token-abc', SITE, elementId, cursor);
  check('new submissions found (oldest first)', fresh.map((s) => s.id), expectedIds);

  pollWebflowSubmissions();
  check('emails sent', env.sent.map((s) => s.to),
    expectedIds.map((id) => `${id.replace('sub-', 'student')}@example.com`));
  const newest = dataset.filter((s) => expectedIds.indexOf(s.id) !== -1)
    .map((s) => s.dateSubmitted).sort().pop();
  if (newest) check('cursor advanced past the batch', env.props.get('WF_LAST_POLL'), newest);
  check('no failures recorded', JSON.parse(env.props.get('WF_FAILED') || '[]').length, 0);
  return env;
}

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

console.log('Webflow polling checks');

// A small site, newest first: the documented-example shape.
const three = submissions(3, 'descending');
run('newest-first, 3 unseen submissions', three, new Date(Date.UTC(2025, 11, 31)).toISOString(),
  ['sub-0', 'sub-1', 'sub-2']);

// The same data oldest first must produce the same result.
const threeAsc = submissions(3, 'ascending');
run('oldest-first, 3 unseen submissions', threeAsc, new Date(Date.UTC(2025, 11, 31)).toISOString(),
  ['sub-0', 'sub-1', 'sub-2']);

// 250 records, so more than one page. Newest-first: the new records sit on page 0.
// Note the cursor is compared with >, so a record at exactly the cursor's timestamp
// counts as already sent - deliberately, so a successful send is never repeated.
const manyDesc = submissions(250, 'descending');
run('newest-first, 250 records, newest 3 unseen', manyDesc, manyDesc[3].dateSubmitted,
  ['sub-247', 'sub-248', 'sub-249']);

// 250 records, oldest first: the new records sit on the LAST offset, which is why the
// poll has to detect the direction instead of always reading offset 0. Offsets count
// records, not pages, so this also catches a paging step of 1 instead of 100.
const manyAsc = submissions(250, 'ascending');
run('oldest-first, 250 records, newest 3 unseen', manyAsc, manyAsc[246].dateSubmitted,
  ['sub-247', 'sub-248', 'sub-249']);

// The boundary itself: a record at exactly the cursor's timestamp is not re-sent.
console.log('\nthe cursor boundary is not re-sent');
{
  const four = submissions(4, 'ascending');
  const env = makeEnv({ forms: FORMS, submissions: four });
  env.props.set('WF_TOKEN', 'token-abc');
  env.props.set('WF_SITE_ID', SITE);
  env.props.set('WF_LAST_POLL', four[1].dateSubmitted);
  loadWorker(env).pollWebflowSubmissions();
  check('only the strictly newer ones are sent', env.sent.map((s) => s.to),
    ['student2@example.com', 'student3@example.com']);
}

// The gate form is stored in the same list and must be ignored.
const mixed = submissions(4, 'descending', (i) => (i === 2 ? 'Cost Calculator Access' : undefined));
run('other forms on the site are ignored', mixed, new Date(Date.UTC(2025, 11, 31)).toISOString(),
  ['sub-0', 'sub-1', 'sub-3']);

// Nothing new: no email, cursor untouched.
console.log('\nnothing new since the cursor');
{
  const env = makeEnv({ forms: FORMS, submissions: three });
  env.props.set('WF_TOKEN', 'token-abc');
  env.props.set('WF_SITE_ID', SITE);
  env.props.set('WF_LAST_POLL', new Date(Date.UTC(2027, 0, 1)).toISOString());
  loadWorker(env).pollWebflowSubmissions();
  check('no emails sent', env.sent.length, 0);
  check('cursor unchanged', env.props.get('WF_LAST_POLL'), new Date(Date.UTC(2027, 0, 1)).toISOString());
}

// First run after install: set the cursor and send nothing. Without this the trigger
// would email every estimate the site has ever stored.
console.log('\nfirst run does not backfill');
{
  const env = makeEnv({ forms: FORMS, submissions: three });
  env.props.set('WF_TOKEN', 'token-abc');
  env.props.set('WF_SITE_ID', SITE);
  const before = Date.now();
  loadWorker(env).pollWebflowSubmissions();
  check('no emails sent', env.sent.length, 0);
  const cursor = env.props.get('WF_LAST_POLL');
  check('cursor was set to now', cursor !== undefined && Date.parse(cursor) >= before, true);
  check('cursor is the newest possible, not an old submission', Date.parse(cursor) > Date.parse(three[0].dateSubmitted), true);
}

// An unconfigured worker must stay quiet rather than throw.
console.log('\nunconfigured worker');
{
  const env = makeEnv({ forms: FORMS, submissions: three });
  loadWorker(env).pollWebflowSubmissions();
  check('no emails sent', env.sent.length, 0);
  check('nothing written to properties', env.props.size, 0);
}

// A rename in the Webflow Designer is the most likely way this breaks, so the error
// has to name the forms that do exist.
console.log('\nform renamed in Webflow');
{
  const env = makeEnv({ forms: [{ displayName: 'Estimate form' }], submissions: three });
  env.props.set('WF_TOKEN', 'token-abc');
  env.props.set('WF_SITE_ID', SITE);
  env.props.set('WF_LAST_POLL', new Date(Date.UTC(2025, 11, 31)).toISOString());
  let message = '';
  try {
    loadWorker(env).pollWebflowSubmissions();
  } catch (err) {
    message = err.message;
  }
  check('throws a message naming the real forms', /Estimate form/.test(message), true);
  check('no emails sent', env.sent.length, 0);
}

// Installing must record its own starting point. Waiting for the first tick instead
// would strand any submission made in between: the cursor would land after it and the
// visitor would never be emailed, with nothing in the log to explain it.
console.log('\ninstall records the starting point');
{
  const env = makeEnv({ forms: FORMS, submissions: three });
  env.props.set('WF_TOKEN', 'token-abc');
  env.props.set('WF_SITE_ID', SITE);
  const { installWebflowPolling, pollWebflowSubmissions } = loadWorker(env);
  const before = Date.now();
  installWebflowPolling();
  check('one trigger installed', env.triggers.length, 1);
  check('handler is the poll', env.triggers[0].getHandlerFunction(), 'pollWebflowSubmissions');
  check('cursor set at install time', Date.parse(env.props.get('WF_LAST_POLL')) >= before, true);

  installWebflowPolling();
  check('re-installing does not stack a second trigger', env.triggers.length, 1);
  const kept = env.props.get('WF_LAST_POLL');
  installWebflowPolling();
  check('re-installing does not move the cursor', env.props.get('WF_LAST_POLL'), kept);

  pollWebflowSubmissions();
  check('the first poll after install sends nothing historical', env.sent.length, 0);
}

// A submission made before install must not be emailed, but one made after it must be.
console.log('\nsubmissions after install are picked up');
{
  const env = makeEnv({ forms: FORMS, submissions: three });
  env.props.set('WF_TOKEN', 'token-abc');
  env.props.set('WF_SITE_ID', SITE);
  const worker = loadWorker(env);
  worker.installWebflowPolling();
  env.props.set('WF_LAST_POLL', '2026-01-01T08:00:00.000Z');
  worker.pollWebflowSubmissions();
  check('only the post-install submissions are sent', env.sent.map((s) => s.to),
    ['student0@example.com', 'student1@example.com', 'student2@example.com']);
  const newestOfThree = three.map((s) => s.dateSubmitted).sort().pop();
  check('cursor catches up to the newest', env.props.get('WF_LAST_POLL'), newestOfThree);
}

// ---------------------------------------------------------------------------
// Guards on the public POST endpoint
// ---------------------------------------------------------------------------

// Mirrors the page: the secret rides in the body, and the URL carries no query string.
function post(worker, data, secret) {
  const body = { secret: secret === undefined ? 'test-secret' : secret, submittedAt: new Date().toISOString(), data };
  const out = worker.doPost({ parameter: {}, postData: { contents: JSON.stringify(body) } });
  return JSON.parse(out.text);
}

// The ?secret= form still works, for hand-run curl tests.
function postWithQuerySecret(worker, secret) {
  const out = worker.doPost({
    parameter: { secret },
    postData: { contents: JSON.stringify({ submittedAt: new Date().toISOString(), data: estimateBody('q-1', 'q@example.com') }) },
  });
  return JSON.parse(out.text);
}

function estimateBody(id, email) {
  return {
    'Submission-Id': id,
    Email: email,
    'First-Name': 'Test',
    Program: 'Aviation Management',
    'Estimate-Total': "CHF 57'100",
    'Estimate-HTML': '<p class="print-total-banner">Estimate</p>',
  };
}

function configuredEnv() {
  const env = makeEnv({ forms: FORMS, submissions: [] });
  env.props.set('WF_TOKEN', 'token-abc');
  env.props.set('WF_SITE_ID', SITE);
  env.props.set('WEBHOOK_SECRET', 'test-secret');
  return env;
}

// The page and the poll can both deliver the same submission, so the same estimate must
// never be emailed twice - and a readable secret must not become a spam relay.
console.log('\nendpoint guards');
{
  const env = configuredEnv();
  const worker = loadWorker(env);

  check('a valid submission sends', post(worker, estimateBody('id-1', 'a@example.com')).sent, true);
  check('re-sending the same submission is dropped',
    post(worker, estimateBody('id-1', 'a@example.com')).duplicate, true);
  check('only one email was sent for it', env.sent.length, 1);

  post(worker, estimateBody('id-2', 'a@example.com'));
  post(worker, estimateBody('id-3', 'a@example.com'));
  check('the same address is capped per day', env.sent.length, 3);
  const blocked = post(worker, estimateBody('id-4', 'a@example.com'));
  check('the fourth send is refused', blocked.ok, false);
  check('and says why', /daily limit reached for/.test(blocked.error), true);
  check('a different address still works', post(worker, estimateBody('id-5', 'b@example.com')).sent, true);

  check('a wrong secret is unauthorized',
    post(worker, estimateBody('id-6', 'c@example.com'), 'nope').error, 'unauthorized');
  check('a missing Estimate-HTML is refused',
    post(worker, { 'Submission-Id': 'id-7', Email: 'd@example.com' }).error, 'missing Estimate-HTML');
  check('an invalid address is refused',
    post(worker, { 'Submission-Id': 'id-8', Email: 'not-an-email', 'Estimate-HTML': '<p>x</p>' }).error,
    'missing or invalid Email');
  check('none of the refused ones sent mail', env.sent.length, 4);

  check('the secret is also accepted from ?secret=', postWithQuerySecret(worker, 'test-secret').sent, true);
  check('a wrong ?secret= is still refused', postWithQuerySecret(worker, 'nope').error, 'unauthorized');

  const notJson = JSON.parse(worker.doPost({
    parameter: { secret: 'test-secret' },
    postData: { contents: 'ping' },
  }).text);
  check('a non-JSON body is reported as such', notJson.error, 'payload was not valid JSON');
}

console.log('\nthe global daily cap holds');
{
  const env = configuredEnv();
  const worker = loadWorker(env);
  for (let i = 0; i < 100; i++) post(worker, estimateBody(`g-${i}`, `user${i}@example.com`));
  check('100 distinct recipients are allowed', env.sent.length, 100);
  const refused = post(worker, estimateBody('g-100', 'user100@example.com'));
  check('the 101st is refused', refused.ok, false);
  check('and names the cap', /daily send limit reached/.test(refused.error), true);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
