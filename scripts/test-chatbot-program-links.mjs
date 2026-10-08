import fs from "node:fs";
import vm from "node:vm";

const workerPath =
  new URL("../worker.html", import.meta.url);

const workerSource =
  fs.readFileSync(workerPath, "utf8");

const workerPrefix =
  workerSource.slice(
    0,
    workerSource.indexOf("export default")
  );

const checks = [
  {
    label: "specific master's program",
    question: "Tell me about the Master's in Finance",
    answer: "AUS offers a Master's in Finance.",
    expected: [
      "https://www.aus.swiss/masters-degree/finance"
    ]
  },
  {
    label: "parent degree wording does not add another program",
    question: "Tell me about the Master's in Finance",
    answer: "The Master's in Finance is a specialization within the Master of Science in International Business Administration. Learn more at https://www.aus.swiss/masters-degree/finance",
    expected: [
      "https://www.aus.swiss/masters-degree/finance"
    ],
    forbidden: [
      "https://www.aus.swiss/masters-degree/international-business"
    ],
    programUrlCount: 1
  },
  {
    label: "program offered at two levels",
    question: "Tell me about Aviation Management",
    answer: "Aviation Management is available at Bachelor's and Master's levels.",
    expected: [
      "https://www.aus.swiss/bachelors-degree/aviation-management",
      "https://www.aus.swiss/masters-degree/aviation-management"
    ]
  },
  {
    label: "broad exploration question",
    question: "What programs do you offer?",
    answer: "You can explore the available study options.",
    expected: [],
    programUrlCount: 0
  },
  {
    label: "federal diploma",
    question: "Tell me about the Federal Diploma",
    answer: "The Swiss Federal Diploma focuses on business administration.",
    expected: [
      "https://www.aus.swiss/swiss-federal-diploma-business-administration"
    ]
  }
];

const testSource = `
const __checks = ${JSON.stringify(checks)};

for (const check of __checks) {
  const output = appendMissingProgramLinks(
    check.answer,
    check.question
  );

  for (const expectedUrl of check.expected) {
    if (!output.includes(expectedUrl)) {
      throw new Error(
        check.label + ": missing " + expectedUrl
      );
    }
  }

  for (const forbiddenUrl of check.forbidden || []) {
    if (output.includes(forbiddenUrl)) {
      throw new Error(
        check.label + ": unexpectedly added " + forbiddenUrl
      );
    }
  }

  if (Number.isInteger(check.programUrlCount)) {
    const matches =
      output.match(/https:\\/\\/www\\.aus\\.swiss\\/(?:bachelors-degree|masters-degree|doctorate-in-business-administration|swiss-federal-diploma-business-administration)[^\\s]*/g) || [];

    if (matches.length !== check.programUrlCount) {
      throw new Error(
        check.label + ": expected " + check.programUrlCount +
        " program URLs, received " + matches.length
      );
    }
  }
}

console.log("Validated " + __checks.length + " chatbot program-link scenarios.");
`;

vm.runInNewContext(
  workerPrefix + testSource,
  {
    console,
    URL,
    Set
  }
);
