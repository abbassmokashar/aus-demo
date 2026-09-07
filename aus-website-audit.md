# AUS Website — Page Inventory, CTA & Link Audit (Draft v1)

**Purpose:** Working deliverable for Stage 1 of the *AUS Website Restructuring & Development Directive* (§1–3). It lists every existing page and every clickable element that was checkable offline, with a defined outcome for each page and proposed new URL structure (§32 style).
**Status:** DRAFT — for review and approval. Audit basis documented here. Since v1, the **working-copy renames in §1.2 were implemented** (files now mirror the proposed URLs; homepage = `index.html`), the mobile header overflow was fixed (§1.3), the **section navigator was rolled out to all 40 pages** (§1.4), and **partner/IATA logos + a News & Events homepage chapter were added** (§1.5).
**Method:** Automated structural scan of all 40 HTML pages in the site folder (titles, H1/H2, buttons, CTA-class anchors, forms, internal links), plus manual spot-checks of header/footer chrome. External destinations (application portal, HubSpot, socials, partner sites) could not be verified for reachability from here and are marked **verify**.
**Basis in repo:** Static HTML site (no `index.html`); pages are generated from shared templates/scripts (`generate-pages.js`); real-world systems already wired in: application portal (`study.aus.swiss/application`), HubSpot (meeting scheduler + forms), Instagram/YouTube.
**Architecture decision (resolved, see §1.1):** no CMS and no component framework will be used — each page is built in Webflow from code-embed widgets, and facts stay hard-coded per page as they are today.

---

## Legend

| Token | Meaning |
|---|---|
| Audience | **BS** bachelor prospect · **MS** master prospect · **DR** doctorate prospect · **FD** federal diploma prospect · **All** any prospective student · **Pub** general public |
| Action | **KEEP** keep page/content (restructure under new IA) · **REWRITE** content or layout must be redone · **MERGE** combine with another page · **SPLIT** break into multiple pages · **ARCHIVE** remove from public site, keep copy · **NEW** page must be created · **REDIRECT** old URL → new URL (301) |
| CTA dest | ✓ correct destination · **✗** placeholder/dead (`#`) · ⚠ external, verify reachability · ~ will change under new IA |

---

## 1. Executive summary of findings

1. **40 pages exist; homepage = `index.html`** (renamed from `aus-home-demo.html`; every page's header/brand "Home" link points to it). Under Webflow the canonical homepage becomes `/` — which design to keep is decision D2.
2. **Homepage has 4 overlapping variants** (`aus-home-demo.html`, `-light`, `-red`, `aus-home-v2.html`). Only `aus-home-demo.html` is referenced by other pages; `-red` and `v2` have **zero internal inbound links** (orphans). `demo`, `demo-light` and `v2` carry the same "Editorial Archive v2" title and 2 unresolved template links each. → Pick one canonical homepage, archive the rest (decision D2).
3. **Current global navigation is thin** (header groups: Programs · About · Campus Life + mobile menu + search + Apply). The directive's target has **6 top-level groups** with deep mega-menus (§4) — i.e. a navigation rebuild, not a tweak.
4. **All 21 program pages** (10 bachelor, 9 master, DBA, Federal Diploma) already follow one consistent modern template with the same section structure and CTA set — an excellent foundation for the §9 standard template. Duration/ECTS per level: Bachelor 135 CH | 225 ECTS; Master 83 CH | 135 ECTS; DBA 90 CH / 150 ECTS.
5. **Placeholder/dead CTAs found (must fix before launch, §3):**
   - **"Download Brochure" → `#`** on all 21 program pages.
   - **"Request a Program Overview" → `#`** on all 21 program pages.
   - **"Start your application →" → `#`** on `aus-programs.html`.
   - **Unrendered template links** `'+top.program.url+'` / `'+a.program.url+'` in the 3 editorial homepage variants.
6. **Incorrect CTA destination:** footer link **"Federal Diploma" → `aus-programs.html#doctorate`** (Federal Diploma is its own page, not a doctorate).
7. **CTA wording is inconsistent across pages** (§7): "Apply now →", "Start your Application", "Start Your Application", "Apply for Admission →", "Contact Admissions" vs "Talk to an Admissions Advisor" vs "Contact Us". Needs a single CTA vocabulary.
8. **Sections the directive requires that have no page today** (§4, §19–25): Tuition & Scholarships hub, Careers & Outcomes hub, Compare Programs, Program Finder, saved programs, News, standalone Rankings, Housing / Living in Switzerland / Transportation subpages. Full list with URLs in §6.
9. **Duplicate/structural issues:** two identical H1s on most pages (SEO §35); `aus-campus-life.html` and `aus-student-life.html` overlap heavily; `aus-about.html` leads with Mission/Vision while the directive wants credibility first (§26); single `aus-admissions.html` bundles requirements + tuition + visa + deadlines that §20–21 wants task-separated.
10. **Good foundations already in place:** cost calculator with per-program prefill for all 21 programs (query ids `bsc_accounting` … `fed_diploma`); grouped FAQ; accreditation page with QS ranking + public disclosures + partner institutions; dual-degree (Tiffin) messaging on every program page; dedicated IBM and Tiffin collaboration pages; faculty / history / governance pages.

---

### 1.1 Architecture decision (RESOLVED — no CMS, no component framework)

Agreed with the Sales Team Lead: **no CMS and no reusable-component framework**. The site is rebuilt in **Webflow**, where each page is assembled from **code-embed widgets** — the HTML for headers, footers, sections, CTAs, tables, accordions and JS tools is pasted into the page as embed code. Facts (tuition, deadlines, ECTS, intakes) stay hard-coded on each page, exactly as in the current files.

Consequences for the directive's assumptions — how each CMS/component clause is reinterpreted under this decision:

| Directive clause | Original ask | Interpretation under Webflow + code-embed widgets | Risk / mitigation |
|---|---|---|---|
| §11 At a Glance "must come from the CMS" | Facts pulled from one store | Values typed on each program page, as today | Drift risk → keep the value checklist in this audit (§48 pre-launch verify) and re-check every page on each update |
| §22 / §29 one source of truth (tuition, deadlines, intakes, ECTS…) | Single authoritative data source | No central store; manual update discipline per page | Highest-risk item of the whole project → schedule a full-value sweep (tuition, deadlines, ECTS) before every launch/publish (see §48) |
| §41 reusable components | Shared component library | Consistency by copy-paste: maintain one canonical snippet per shared block (header, footer, program card, CTA bar, accordion, FAQ, breadcrumb, comparison table) in this repo and paste the identical code into every page | Duplication → changes must be re-pasted everywhere; snippets folder acts as the manual "library" |
| §28 structured CMS collections | Programs/faculty/tuition… as collections | No collections; content lives in the HTML of each Webflow page | Content QA (§46) becomes the control point |
| §33 redirect plan | Server-side 301s | Old `aus-*.html` names never need to exist publicly after migration; if old URLs were public on `aus.swiss`, map them in Webflow's 301 redirect manager | Confirm with IT whether old URLs are indexed (D10) |
| §35 SEO | Canonical, OG, structured data | Set per page in Webflow page settings (title, meta description, canonical, OG image, slug); structured data via embed | — |
| §38 forms | CRM destination | Keep current HubSpot embeds (meeting scheduler + forms) or rebuild as native Webflow forms wired to HubSpot/CRM | Verify each form's destination |
| §30 grouped search / §39 analytics | Site search + event tracking | Search needs a custom embed or third-party tool (no native Webflow site search); analytics via Google tag embed | Decide search approach before Stage 6 (D11) |

Webflow provides natively: hosting, SSL, clean page slugs/folders (`/programs/bachelors/accounting`), 404 page, XML sitemap, robots, cookie-consent tooling. This repo stays the canonical working copy: **one HTML file here = one Webflow page**, and every page in §2 maps 1:1 to a Webflow slug.

### 1.2 File renames — IMPLEMENTED in the working copy (Sept 2026)

Applied per the §2 proposed-URL column (and §32 clean-URL rule). The old `aus-*.html` names are gone from the tree — verified: 0 leftover old-style links, all local hrefs resolve.

| Old file | New file (mirrors URL) |
|---|---|
| `aus-home-demo.html` | **`index.html`** (homepage — name changed, still the homepage) |
| `aus-programs.html` | `programs.html` |
| `aus-admissions.html` | `admissions.html` |
| `aus-faq.html` | `faq.html` |
| `aus-cost-calculator.html` | `cost-calculator.html` (unchanged) |
| `aus-about.html` | `about.html` |
| `aus-about-history.html` | `about/history.html` |
| `aus-about-faculty.html` | `about/faculty.html` |
| `aus-governance.html` | `about/governance.html` |
| `aus-accreditations.html` | `about/accreditation.html` |
| `aus-rights-policy.html` | `about/policies-and-procedures.html` |
| `aus-tiffin-collaboration.html` | `about/academic-partners/tiffin-university.html` |
| `aus-ibm-collaboration.html` | `about/industry-partners/ibm.html` |
| `aus-speaker-series.html` | `about/news-and-events/speaker-series.html` |
| `aus-student-life.html` | `student-life.html` |
| `aus-campus-life.html` | `student-life/campus.html` |
| `aus-dba.html` | `programs/doctorate/dba.html` |
| `aus-federal-diploma.html` | `programs/federal-diploma.html` |
| `aus-bachelor-*.html` (10) | `programs/bachelors/<slug>.html` (per §2.3) |
| `aus-master-*.html` (9) | `programs/masters/<slug>.html` (per §2.4) |
| `aus-home-demo-light.html`, `aus-home-demo-red.html`, `aus-home-v2.html` | **archived** → `history/home-demo-light.html`, `history/home-demo-red.html`, `history/home-v2.html` (not linked from any page) |

**Caveats:** (1) `generate-pages.js` was updated to output the new URL-mapped paths (template read from `programs/bachelors/accounting.html`, outputs written to the §1.2 paths, internal links rewritten to relative paths) — but its **content patterns lag the hand-updated pages**: a sandbox run showed all 21 outputs still contain template leftovers (e.g. "Accounting" in hero H1/alt text) and older titles, so **do not regenerate existing pages** until the generator's content rules are synced to the current template. `generate-pages.ps1` is the old flat-name generator and remains stale. (2) Homepage design decision D2 still open: `index.html` is built from the "Editorial Archive v2" demo; the 3 variants are archived in `history/`.

### 1.3 Mobile header overflow — FIXED (Sept 2026)

On small screens the fixed nav overlapped: logo (min-width 180px) + Contact/Apply pills + hamburger exceeded the viewport. Applied to all 40 pages, following the responsive-design skill (fluid values, content-based breakpoints, 44px touch targets):
- `≤760px`: nav padding shrinks, logo fluid (`width:min(42vw,170px)`, height 34px), button pills get `min-height:44px` and tighter padding, right-group gap reduced, hamburger gets a proper touch target.
- `≤420px`: padding tightens further, logo `min(38vw,150px)`, the pill **Contact** hides (still reachable via the side menu) so the logo never collides with Apply + hamburger.
- Desktop unchanged (all rules sit in new `@media (max-width:…)` blocks appended to the shared nav CSS on every page).

### 1.4 Section navigator ("archive index tab") — ROLLED OUT to all 40 pages (Sept 2026)

The floating chapter tab (right edge, desktop only — the numbered `01 …` widget that opens a "Jump to chapter" TOC and tracks your scroll position) previously existed on only 8 pages (homepage, programs, faq, student-life, 4 × about). It now exists on **all 40 pages**:
- **8 pages already had it** (left as authored; the homepage's chapters are numbered 02–12 with a static "01 Origins" tab label, its original design).
- **29 pages got it added**: widget markup + CSS + a self-contained JS block (defines its own `prefers-reduced-motion` check; no dependency on each page's other scripts) + `data-chapter` / `data-chapter-label` attributes on each page's main sections, per page type: program pages (11 chapters: Overview · At a Glance · Program Overview · Curriculum · Careers · Dual Degree · Why AUS · Tuition · Admissions · Student Life · Apply; DBA/Federal Diploma have no Dual Degree), admissions (8), about (7), campus (5), speaker series (4), IBM (9), Tiffin (12), cost calculator (3), policies & procedures (2 — chapters live on its `.pp-hero` / `.pp-body` divs since it has no `<section>`s).
- Behaviour matches the homepage's original widget exactly (same CSS rules, same IntersectionObserver tracking, same hover/focus TOC). Hidden ≤960px (desktop-only, per the existing design).
- Verified in headless Chrome at 1280px on 7 representative pages: tab visible at the right edge (z-index 90, no overlap with the 110 nav), TOC lists exactly the page's chapters, clicking a TOC entry smooth-scrolls to it, the number/label update as you scroll; at 390px the tab is hidden. Screenshots in `browser-check/*__tab.png`.
- Because it lives in the shared template (`programs/bachelors/accounting.html`), pages regenerated later via `generate-pages.js` will carry the widget + the accounting chapter structure (tune labels per page).
- Pristine pre-rollout copies of all 37 pages sit in `/tmp/aus-tab-backup/` (outside the repo; survives until the OS cleans /tmp).

### 1.5 Partner logos + News & Events homepage chapter (Sept 2026)

- **Tiffin University logo** (Webflow CDN `tiffin-university-logo.svg`) added to the homepage "Our Partners" carousel (`index.html`, in both loop halves, after IATA) and to the top of the Dual Degree intro on `about/academic-partners/tiffin-university.html`; the older `tiffin.jpg` in the accreditation page's "Educational Partnerships" card (`about/accreditation.html`) was swapped for the same new SVG.
- **IATA logo** (Webflow CDN `iata-logo-header.svg`) added as a 5th item in the footer "Accredited & Recognized Worldwide" row on **all 40 pages** (the footer CSS renders logos white, so source colors don't matter), and as an "IATA Authorized Training Center" tile inside the Program Overview section of both aviation pages (`programs/bachelors/aviation-management.html`, `programs/masters/aviation-management.html`). IATA was already in the homepage carousel.
- **News & Events homepage chapter (13)** added to `index.html` between the testimonials and the footer: 2 event cards + 9 blog cards, each opening a popup whose content (title, image, article body) was pulled from the live site via the Wayback Machine snapshot of `aus.swiss` (Nov 2025). Cards are `<button>`s with `data-news` keys; popup content lives in `<template id="news-…">` blocks; overlay JS is self-contained and keyboard-accessible (Esc / focus return). It appears automatically in the homepage chapter-navigator TOC (auto-collected from `[data-chapter]`). Popup images hotlink the Wayback-hosted copies of the original Tilda CDN images.
- Verified in headless Chrome: 12 chapters in the TOC with the new chapter last; 11/11 cards/templates; event + blog popups open/close with correct titles and content; aviation page shows the IATA tile and 5 footer items (last = IATA); footer has 5 items on all 40 files (static grep). Screenshots: `browser-check/news__*.png`.

### 1.6 Homepage = home-v2 "Paper" style + carousel News & Events (Sept 2026)

- **Homepage now IS the home-v2 "Paper" design** (decision: adopt wholesale): `history/home-v2.html` was promoted to `index.html` (its exact header/footer/nav/preloader, section text colors, light-paper `#f1f1ef` footer and backgrounds, reduced paddings, images); internal `../` link prefixes were stripped for root placement and the title cleaned. The previous editorial homepage is archived at `history/home-demo.html` (it contains the older grid News section as reference).
- The homepage's **Tiffin logo** (partners carousel, both halves) and **footer IATA** were already present in v2; Tiffin was re-added to the carousel after promotion (46 partner items = 23 × 2).
- **News & Events rebuilt as two horizontal carousels** (Events: 2 wide cards · Blog: 9 cards) with arrow buttons + scroll-snap — replacing the earlier static grid — plus the click-to-open popups (content unchanged, Wayback-sourced).
- **All 11 blog/event images downloaded locally** to `news-images/*.png` (from the Wayback Machine; the AI article image came from the live Tilda CDN, which still serves it) and the cards/popups now reference the local relative paths — ready for the user to upload to Webflow and swap in the new asset URLs.
- **Popup presentation improved**: image is now a large banner (`clamp(240px,44vh,430px)`, object-fit cover) with the article text below on a clean white panel.
- **IATA logo enlarged**: footer item on all 40 pages now `height:clamp(40px,4.4vw,56px)` (was 26–34px); the aviation-pages "IATA Authorized Training Center" tile now shows a 48px logo and sits `26px/30px` away from the surrounding text (was 0 below).
- Verified in headless Chrome: paper footer renders (`#f1f1ef` + navy), 12 chapters in the navigator (last = News & Events), arrows scroll the carousels, popups open with local images, no horizontal overflow, aviation pages show the larger tile/spacing. Screenshots: `browser-check/paper__*.png`.

### 1.7 Final homepage adjustments (Sept 2026, same day)

- **Homepage chapter order**: sections 11 & 12 were swapped — **Our Partners is now 11** (directly after AUS Moments) and **In Their Words 12**, with News & Events 13 last (chapter TOC reflects the new order; verified).
- **News & Events laid out side-by-side like the Wayback original**: Blog and Events now sit **beside each other as two single-image galleries** (Blog left with 9 slides, Events right with 2), each with its own label, prev/next arrows and a `1 / n` counter under the slide. Each gallery advances **exactly one slide per gesture** (arrows, arrow keys, and mouse-wheel over the gallery — 650ms lock so one wheel flick = one slide). Clicking a slide opens the popup.
- **Popup image presentation improved**: the modal now shows a large banner (`clamp(300px,52vh,560px)`, cover-fit, measured 444px at 1360px viewport) with the article text below on white.
- **News/event images point at the live Webflow CDN** URLs the user supplied (10 of 11 — the Info Sessions event image has no CDN link yet, so it still uses the local `news-images/info-sessions.png` until uploaded; the other local downloads in `news-images/` are kept as fallback).
- **IATA logo enlarged again**: footer item on all 40 pages is now `height:clamp(52px,5.8vw,78px)` (measured 78px on desktop); the aviation-pages "IATA Authorized Training Center" tile now shows a **72px** logo with more padding and `36px` clearance below.
- Verified in headless Chrome: chapter order `…10 AUS Moments · 11 Our Partners · 12 In Their Words · 13 News & Events`; columns side-by-side; arrow → `-100%` + counter `2 / 9`; wheel → `-200%` + `3 / 9`; popup opens with the CDN image loaded at 444px. Screenshots: `browser-check/paper2__*.png`.

#### 1.7.1 Gallery behavior refinement (same day)

- **Text removed from the slides** — the Blog/Events images are now clean (no title/arrow overlays, no chips on the image); Blog vs Events is conveyed by the column label above.
- **Infinite scrolling**: each gallery loops — from slide 9 the next shows slide 1 (seamless: cloned first/last slides animate the wrap, then the position resets without a visible transition). Prev from slide 1 goes to the last slide.
- **Automatic scroll**: each gallery advances one slide on its own every ~4.6s; it pauses while hovered and while a popup is open, and resumes after (disabled under `prefers-reduced-motion`). Manual arrows/arrow-keys restart the timer.
- **Mouse-wheel navigation removed**; navigation is the arrows (and arrow keys) below the gallery, counter intact.
- **Images fit the grid**: slide ratio set to `119/100` — the sources are all 1680×1410 (1.191:1), so `object-fit: cover` now crops nothing and the full artwork shows.
- Verified in headless Chrome: zero text overlays on slides, image box ratio 1.19 vs natural 1.191 (no crop); autoplay advances both galleries (2/9, 2/2 after ~5s); manual arrow works; after 9 nexts the counter wraps to `1 / 9`; popup loads the CDN image at 444px. Screenshots: `browser-check/paper3__*.png`.

---

## 2. Master inventory — every existing page with its outcome

### 2.1 Homepage (4 files → 1 page)

| File | Page name | Type / Audience | Purpose & content | Primary CTA(s) → dest | Issues | Disposition · Proposed URL · Action |
|---|---|---|---|---|---|---|
| `aus-home-demo.html` | AUS Business School — Homepage (Editorial Archive v2) | Homepage / All | Communicate offer, location, levels; program grid; why AUS; accreditation teaser; student stories; social proof | Apply now → portal ✓; Find My Program → `#programs` ✓; program cards → detail pages ✓; Contact Admissions → HubSpot meeting ⚠ | Title literally says "Archive v2"; contains 2 unrendered template links `'+top.program.url+'`; heavy inline JS | **KEEP as basis** · URL → `/` (build as `index.html`) · REWRITE into §8 homepage order (hero → program discovery → why AUS → careers → accreditation → student life → stories → final CTA). Archive current file, keep copy. |
| `aus-home-demo-light.html` | AUS Business School — Homepage (Editorial Archive v2) | Homepage (variant) / All | Same content as above (light theme iteration) | Same set as demo | Duplicate of `aus-home-demo.html`; 2 unrendered template links | **ARCHIVE** · no public URL · keep file in `history/` for reference (decision D2). |
| `aus-home-demo-red.html` | AUS Business School — Homepage (Crimson Edition) | Homepage (variant) / All | Older red-design homepage iteration; fewer sections (no student stories) | Apply now → portal ✓; Find My Program → `#programs` ✓ | Older design language; superseded | **ARCHIVE** · no public URL (decision D2). |
| `aus-home-v2.html` | AUS Business School — Homepage (Editorial Archive v2 — Paper) | Homepage (variant) / All | Editorial v2 "paper" iteration | Same set as demo | Duplicate; 2 unrendered template links; orphan (0 inbound links) | **ARCHIVE** · no public URL (decision D2). |

### 2.2 Program index (1 file)

| File | Page name | Type / Audience | Purpose & content | Primary CTA(s) → dest | Issues | Disposition · Proposed URL · Action |
|---|---|---|---|---|---|---|
| `aus-programs.html` | AUS Business School — Programs | Program index / All | Level-based program overview ("Every level. One method."); bachelor/master/doctorate blocks; dual-degree section; practice-led messaging | Apply now → portal ✓; Explore programs → `#bachelor` ✓; **Start your application → `#`** ✗ | Dead "Start your application" CTA; index mixes marketing copy + list | **KEEP + REWRITE** · URL → `/programs` · Rebuild as clean program listing by level with cards, Find Your Program + Compare Programs entry points (§4, §8 sec.2). All 21 programs must be reachable. |
| *(new sibling)* | — | — | — | — | — | **NEW** `/programs/bachelors`, `/programs/masters`, `/programs/doctorate`, `/programs/federal-diploma` level pages (or in-page anchors if approved). |

### 2.3 Bachelor's program pages (10 files → 10 URLs)

Shared template facts (verified): every page has the same section order — hero/value prop, duration line, "Your Future in [Program]" careers section, dual-degree (Tiffin) section, Why AUS, community, digital skills, Life at AUS, Take the Next Step; identical CTA set; two H1s per page; `Download Brochure` and `Request a Program Overview` both `#` **✗ on all pages**.

| File | Program (title) | Audience | Distinct content notes | Current CTAs → dest | Disposition · Proposed URL |
|---|---|---|---|---|---|
| `aus-bachelor-accounting.html` | Accounting | BS | Accounting pathway; tax/audit/finance careers | Apply/Start Application → portal ✓ · Calculate Your Expenses → calculator `?program=bsc_accounting` ✓ · Admissions & Financing → `aus-admissions.html` ✓ · Talk to an Admissions Advisor → HubSpot meeting ⚠ · Book a Campus Visit → HubSpot form ⚠ · Download Brochure → `#` ✗ · Request a Program Overview → `#` ✗ | KEEP content · REWRITE under §9–17 template · `/programs/bachelors/accounting` · 301 from old URL |
| `aus-bachelor-aviation-management.html` | Aviation Management | BS | Aviation industry leadership | same set (`bsc_aviation`) | `/programs/bachelors/aviation-management` |
| `aus-bachelor-business-management.html` | Business Management | BS | Leadership in global economy | same set (`bsc_business`) | `/programs/bachelors/business-management` |
| `aus-bachelor-healthcare-administration.html` | Healthcare Administration | BS | Fastest-growing industries | same set (`bsc_healthcare`) | `/programs/bachelors/healthcare-administration` |
| `aus-bachelor-hospitality-management.html` | Hospitality Management | BS | Service sectors; extra "Real experience. Real hospitality." section | same set (`bsc_hospitality`) | `/programs/bachelors/hospitality-management` |
| `aus-bachelor-human-resource-management.html` | Human Resource Management | BS | People-centred strategy | same set (`bsc_hr`) | `/programs/bachelors/human-resource-management` |
| `aus-bachelor-integrated-digital-marketing.html` | Integrated and Digital Marketing | BS | Modern marketing / brand management | same set (`bsc_marketing`) | `/programs/bachelors/integrated-digital-marketing` |
| `aus-bachelor-international-business.html` | International Business | BS | Global economy leadership | same set (`bsc_intl`) | `/programs/bachelors/international-business` |
| `aus-bachelor-sports-management-athletic.html` | Sports Management — Athletic Administration | BS | Sports orgs / athletic departments | same set (`bsc_sports_athletic`) | `/programs/bachelors/sports-management-athletic-administration` |
| `aus-bachelor-sports-management-marketing.html` | Sports Management — Sports Marketing | BS | Sports marketing / sponsorship | same set (`bsc_sports_marketing`) | `/programs/bachelors/sports-management-sports-marketing` |

**Bachelor-level additions required by directive (NEW):** program comparison entry, save-program, fit section ("Is this right for me?"), At a Glance block, sticky section nav, curriculum by year/semester, program-specific admission requirements + tuition blocks. Facts remain hard-coded per page with manual sync discipline (§1.1).

### 2.4 Master's program pages (9 files → 9 URLs)

Same shared template + same CTA issues as 2.3. Note: one master specialization (Aviation Management) exists as a page but was not visible in the homepage demo's program grid — check it is surfaced everywhere (decision D5).

| File | Program (title) | Audience | Current CTAs → dest | Disposition · Proposed URL |
|---|---|---|---|---|
| `aus-master-aviation-management.html` | Aviation Management | MS | same set (`msc_aviation`) | `/programs/masters/aviation-management` |
| `aus-master-data-analytics.html` | Data Analytics | MS | same set (`msc_data`) | `/programs/masters/data-analytics` |
| `aus-master-finance.html` | Finance | MS | same set (`msc_finance`) | `/programs/masters/finance` |
| `aus-master-healthcare-administration.html` | Healthcare Administration | MS | same set (`msc_healthcare`) | `/programs/masters/healthcare-administration` |
| `aus-master-human-resource-management.html` | Human Resource Management | MS | same set (`msc_hr`) | `/programs/masters/human-resource-management` |
| `aus-master-international-business.html` | International Business | MS | same set (`msc_intl`) | `/programs/masters/international-business` |
| `aus-master-leadership-change.html` | Leadership & Change | MS | same set (`msc_leadership`) | `/programs/masters/leadership-and-change` |
| `aus-master-sports-management.html` | Sports Management | MS | same set (`msc_sports`) | `/programs/masters/sports-management` |
| `aus-master-strategic-brand-digital-marketing.html` | Strategic Brand & Digital Marketing | MS | same set (`msc_brand`) | `/programs/masters/strategic-brand-digital-marketing` |

### 2.5 Doctorate & Federal Diploma (2 files → 2 URLs)

| File | Page name | Audience | Purpose & content | Issues | Disposition · Proposed URL |
|---|---|---|---|---|---|
| `aus-dba.html` | Doctorate in Business Administration | DR | Executive DBA; 90 CH / 150 ECTS; careers, why AUS | same CTA set as programs (2 dead `#` CTAs); 2 H1s | KEEP · REWRITE under template · `/programs/doctorate/dba` |
| `aus-federal-diploma.html` | Swiss Federal Diploma in Business Administration | FD | Swiss-recognized professional qualification; 3 years | same CTA set (2 dead `#`); **footer elsewhere mis-links it to `#doctorate`** | KEEP · REWRITE under template · `/programs/federal-diploma` (fix footer link) |

### 2.6 Admissions, cost & FAQ (3 files)

| File | Page name | Type / Audience | Purpose & content | Primary CTA(s) → dest | Issues | Disposition · Proposed URL · Action |
|---|---|---|---|---|---|---|
| `aus-admissions.html` | Admissions | Admissions hub / All | One page holding: How to Apply, Entry Requirements, English Requirements, Tuition & Fees, Important Dates, Visa Info, "Ready to Apply?" | Apply/Start Application → portal ✓ · Contact Admissions → HubSpot meeting ⚠ · View Programs → `aus-programs.html` ✓ | Overloaded: mixes 3 directive sections (§20 Admissions, §22 Tuition, deadlines/visa) on one page; task-based IA missing | **SPLIT + EXPAND** · URL → `/admissions` hub; create subpages per §6 of this doc (how to apply, requirements by level, documents, deadlines, international, English, visa, transfers, FAQ) reusing existing content. Keep tuition/fees content only as summary; move authoritative figures to `/tuition` (§22). |
| `aus-cost-calculator.html` | Cost Calculator | Decision tool / All | Interactive cost estimate: program, tuition & scholarship, accommodation, monthly living, visa & residence permit | Apply → portal ✓ · Contact Admissions → HubSpot meeting ⚠ | URL already clean; calculator ids (`bsc_accounting`…) must survive slug migration (redirect/rename) | **KEEP + ENHANCE** · URL stays `/cost-calculator` · Extend per §23 (insurance, first-year vs total cost, "clearly label estimates", Explore Scholarships / Talk to Admissions CTAs). Feed from central tuition source (§22). |
| `aus-faq.html` | FAQ | Support / All | Grouped FAQ: About AUS, Admissions & Applications, Fees & Finance, Visa & Health Insurance, Accommodation, Registration & Enrollment, Arrival in Switzerland, GI Bill | Apply for Admission → portal ✓ | Content duplicated by topic across one page; no per-area FAQ sections elsewhere | **KEEP content** · restructure as reusable FAQ component (§41); decide one `/faq` with anchors vs per-section FAQs · URL `/faq` (or `/admissions/faq` + tuition FAQ + visa FAQ — decision D6). |

### 2.7 Student life (2 files → merge into 1 hub)

| File | Page name | Audience | Purpose & content | Primary CTA(s) → dest | Issues | Disposition · Proposed URL |
|---|---|---|---|---|---|---|
| `aus-student-life.html` | Student Life at AUS | All | Support services, office hours, accommodation ("Reserve Your Accommodation" form), Lake Geneva living, nationalities | Apply → portal ✓ · Contact Admissions → HubSpot form ⚠ · **Reserve Your Accommodation → HubSpot form** ⚠ | Overlaps `aus-campus-life.html` | **MERGE into Student Life hub** · `/student-life` with subpages: campus, housing, living-in-switzerland, activities, international-community, student-support, campus-visits (§25). |
| `aus-campus-life.html` | Campus Life | All | Swiss Riviera campus, AUS events, experience | Contact Us → HubSpot form ⚠ · Book a Campus Visit → HubSpot form ⚠ · Explore Programs ✓ | Duplicates student-life topics; both pages sit in the footer nav | **MERGE** campus/events content → `/student-life/campus` (+ events). Redirect `aus-campus-life.html`. |

### 2.8 About AUS (5 files)

| File | Page name | Audience | Purpose & content | Issues | Disposition · Proposed URL |
|---|---|---|---|---|---|
| `aus-about.html` | About AUS | All / Pub | Hub page; opens with Mission / Vision / Our Values; "Learn More About AUS"; Take the Next Step | Mission-first order contradicts §26 (credibility info first: at a glance, accreditation, rankings); 2 H1s | **REWRITE order** · URL → `/about` · lead with AUS at a Glance + accreditation/recognition; move Mission & Values down (§26). |
| `aus-about-history.html` | Our History | Pub | Founding story, logo evolution, timeline | fine | KEEP · `/about/history` |
| `aus-about-faculty.html` | Our Faculty | All | Faculty intro ("Get to know our faculty") | thin; keep as per-page profile markup (no CMS per §1.1) | KEEP + EXPAND · `/about/faculty` |
| `aus-governance.html` | Governance | Pub | Leadership & oversight | — | KEEP · `/about/leadership-and-governance` (or keep separate per §26 — decision D7) |
| `aus-accreditations.html` | Accreditations & Memberships | All / Pub | QS ranking; public disclosures of student achievement; partner institutions; logos | Logos shown without per-logo explanation/verification links (§27 requirement); mixes accreditation + rankings + memberships | **RESTRUCTURE into structured records** (§27) · `/about/accreditation` · per logo: organization, category, relationship, meaning, verification link, year/status. Consider separate `/about/rankings`. |

### 2.9 Collaboration / partner pages (2 files)

| File | Page name | Audience | Purpose & content | Issues | Disposition · Proposed URL |
|---|---|---|---|---|---|
| `aus-tiffin-collaboration.html` | AUS Collaboration with Tiffin University | BS / MS | Dual-degree program explainer (BSBA + TU BBA; MIBA + TU MBA) — supports the "Two degrees. Two continents." messaging on all program pages | Currently reachable mainly via footer; should be linked from every dual-degree program block | **KEEP as key academic-partner page** · `/about/academic-partners/tiffin-university` (under About → Academic Partners per §26) · link program pages to it. |
| `aus-ibm-collaboration.html` | IBM Collaboration (IBM Academic Initiative) | All | Industry partnership: badges, SkillsBuild certificates, benefits | Not surfaced in header/footer chrome — verify how students reach it (homepage partner grid only?) | **KEEP as industry-partner page** · `/about/industry-partners/ibm` · surface under Careers/Industry Connections + About → Industry Partners. |

### 2.10 Other utility pages (2 files)

| File | Page name | Audience | Purpose & content | Issues | Disposition · Proposed URL |
|---|---|---|---|---|---|
| `aus-speaker-series.html` | AUS Speaker Series | All | Commencement speakers + industrial visits | No News/Events section exists; page is a category of one | KEEP content · decide placement: `/about/news-and-events/speaker-series` vs Student Life events (decision D8) — directive §26 lists News under About. |
| `aus-rights-policy.html` | Policies and Procedures | Pub | Legal/policy statements | Not in main nav (footer-appropriate) | KEEP as legal page · `/about/policies-and-procedures` (footer only, per §38 consent/privacy needs) |

---

## 3. CTA & link audit — concrete issues found (directive §3)

Verification method: offline scan of all `<a>`/`<button>` elements; external URLs flagged ⚠ (cannot verify reachability from repo). "Correct destination" follows §6–7 wording and the §4 IA.

| # | CTA label (as on page) | Where found | Current destination | Correct destination | Status | Required fix |
|---|---|---|---|---|---|---|
| 1 | Download Brochure | All 21 program pages (§2.3–2.5) | `#` | Program brochure / guide (or "Download Program Guide" with form per §38) | ✗ | Provide real brochure asset or gate behind form; never ship `#` (§3 "Do not use placeholder destinations for live CTAs") |
| 2 | Request a Program Overview | All 21 program pages | `#` | Same as #1 or remove in favor of guide CTA | ✗ | Fix or remove |
| 3 | Start your application → | `aus-programs.html` | `#` | `https://study.aus.swiss/application` | ✗ | Point to portal (or remove if duplicate of Apply now) |
| 4 | Explore Program → (dynamic cards) | `aus-home-demo.html`, `aus-home-demo-light.html`, `aus-home-v2.html` | literal `'+top.program.url+'` / `'+a.program.url+'` | resolved program URLs | ✗ | Homepage variant will be archived (D2); if demo.html is canonical, fix the template that renders program cards |
| 5 | Federal Diploma | Footer (all pages) | `aus-programs.html#doctorate` | `aus-federal-diploma.html` (own page) | ✗ | Wrong section AND wrong page type — relink |
| 6 | Doctorate | Footer (all pages) | `aus-programs.html#doctorate` | `/programs/doctorate` (DBA page) | ✓(~) | Works today via anchor; becomes `/programs/doctorate` after rebuild |
| 7 | Apply now → | Header / hero (most pages) | portal ✓ | portal ✓ | ✓ | Standardize label to "Apply Now" (§7); keep strongest action |
| 8 | Start your Application / Start Your Application / Apply for Admission | Body CTAs (many pages, mixed casing) | portal ✓ | portal ✓ | ~ | Unify wording to the §7 vocabulary; inconsistent variants hurt CTA tracking (§40) |
| 9 | Talk to an Admissions Advisor / Contact Admissions / Contact Us | Various pages | HubSpot meeting (Michiel van de Water) OR one of 3 different HubSpot forms | Admissions contact flow | ⚠ | Confirm all three labels route to the correct, distinct intents (admissions inquiry vs generic contact); standardize labels |
| 10 | Calculate Your Expenses | All 21 program pages | calculator with program param (e.g. `?program=bsc_accounting`) | `/cost-calculator` prefilled | ✓ | Keep working; preserve/redirect query ids when slugs change (bsc_accounting → accounting) |
| 11 | Admissions & Financing | All 21 program pages | `aus-admissions.html` | `/admissions` + `/tuition` after split | ~ | Update after IA change; add redirect |
| 12 | View Programs / Explore Programs | Many pages | `aus-programs.html` | `/programs` | ✓ | Redirect after rename |
| 13 | Book a Campus Visit | About, program pages, life pages | HubSpot form (1 URL) | Campus-visit form | ⚠ | Verify same form used everywhere or differentiate per §38 |
| 14 | Reserve Your Accommodation | `aus-student-life.html` | HubSpot form (separate URL) | Housing inquiry flow | ⚠ | Verify; becomes `/student-life/housing` CTA after merge |
| 15 | E-Library / OpenStax / OECD Publications | Footer | external resources | — | ⚠ | Verify reachability; confirm these belong in footer nav |
| 16 | Visit TU Website / School of Business / Explore Tiffin University | `aus-tiffin-collaboration.html` | tiffin.edu pages | — | ✓ | Keep |
| 17 | Speaker Series | Homepage demo | `aus-speaker-series.html` | News/events destination | ✓(~) | Re-home after D8 |
| 18 | Instagram / YouTube ("Check all AUS Moments", "Watch all Student Testimonials") | Homepage demo | instagram.com/aus.swiss, youtube.com/@aus.switzerland | — | ⚠ | Verify channel links; use real student stories per §8 sec.7 |

**Other link-hygiene notes:** no broken *internal* HTML links found except items 1–5 above (all other `aus-*.html` targets resolve). Duplicate H1 heading present on the majority of pages (SEO/canonical §35) — one H1 per page on rebuild. "Ask AUS"/search control exists in the header on every page; grouped, type-aware search results (§30) do not exist yet — NEW.

---

## 4. Duplicate / overlap / remove candidates (summary)

| Finding | Pages | Recommended outcome |
|---|---|---|
| Homepage variants (4) | demo, demo-light, red, v2 | Keep 1 canonical → archive 3 (D2) |
| Student Life vs Campus Life | `aus-student-life.html`, `aus-campus-life.html` | Merge into `/student-life` hub + subpages; both currently in footer |
| Admissions bundles tuition/visa/deadlines | `aus-admissions.html` | Split by task into §6 subpages; tuition figures → central source |
| About hub leads with Mission/Vision | `aus-about.html` | Reorder per §26 |
| Accreditation logos without explanation | `aus-accreditations.html` | Structured records per §27 |
| Accreditations mix content types | QS rankings + disclosures + partners | Separate categories with labels/verification links |
| FAQ topics in one page | `aus-faq.html` | Reusable component; decide distribution (D6) |
| Program content duplication risk | All 21 program pages | Facts stay hard-coded per page (§1.1); mitigate drift with a master value checklist in this audit + a full sweep before every publish (§29 reinterpreted) |

**Nothing gets deleted without a defined outcome:** every file above maps to KEEP/REWRITE/MERGE/SPLIT/ARCHIVE; ARCHIVE only for homepage variants, whose content is preserved in `history/`.

---

## 5. Redirect implications (directive §33, preview)

In Webflow the proposed URLs become page slugs, so old `aus-*.html` filenames never need to exist publicly after migration. Redirects are only required if the current `aus-*.html` URLs are already public and indexed (D10) — if so, each rename below maps to a 301 in Webflow's redirect manager. Full redirect sheet to be produced at Stage 2 approval; pattern preview:

| Old URL (today) | New URL | Notes |
|---|---|---|
| `aus-home-demo.html` (+ variants) | `/` | only canonical survives |
| `aus-programs.html` | `/programs` | anchors `#bachelor/#master/#doctorate` re-mapped to level pages |
| `aus-bachelor-<slug>.html` (10) | `/programs/bachelors/<slug>` | |
| `aus-master-<slug>.html` (9) | `/programs/masters/<slug>` | |
| `aus-dba.html` | `/programs/doctorate/dba` | |
| `aus-federal-diploma.html` | `/programs/federal-diploma` | also fix footer link (issue #5) |
| `aus-admissions.html` | `/admissions` (hub) | sub-content splits to §6 URLs |
| `aus-cost-calculator.html?program=X` | `/cost-calculator?program=X` | keep query ids or migrate + redirect |
| `aus-student-life.html`, `aus-campus-life.html` | `/student-life`, `/student-life/campus` | |
| `aus-about*.html` (5) | `/about*` | per §2.8 |
| `aus-tiffin-collaboration.html`, `aus-ibm-collaboration.html` | `/about/academic-partners/tiffin-university`, `/about/industry-partners/ibm` | |
| `aus-faq.html`, `aus-speaker-series.html`, `aus-rights-policy.html` | per §2.6/2.10 | after D6/D8 |

---

## 6. Proposed new pages required by the directive (not in repo today)

Proposed URLs follow §4 nav + §32 pattern. Source column notes where existing content already exists to reuse.

| Section | Proposed URL | Page | Source of content | Action |
|---|---|---|---|---|
| Programs | `/programs/finder` | Program Finder (guided: level → interest → career → results) | NEW (from program data) | NEW (§18) |
| Programs | `/programs/compare` | Program Comparison (up to 3) | NEW | NEW (§19) |
| Admissions | `/admissions/how-to-apply` | How to apply + process steps | SPLIT from `aus-admissions.html` | NEW/SPLIT (§20) |
| Admissions | `/admissions/entry-requirements/bachelors` `/…/masters` `/…/doctorate` | Requirements per level | SPLIT from `aus-admissions.html`; per-program content | NEW/SPLIT (§21) |
| Admissions | `/admissions/required-documents` | Documents | SPLIT | NEW/SPLIT |
| Admissions | `/admissions/application-deadlines` | Deadlines/intakes | SPLIT + `AUS-Academic Calendar 2026-2027.docx` | NEW/SPLIT (§16, §29) |
| Admissions | `/admissions/international-students` | International requirements | SPLIT | NEW/SPLIT (§21) |
| Admissions | `/admissions/english-requirements` | English requirements | SPLIT | NEW/SPLIT |
| Admissions | `/admissions/visa-and-immigration` | Visa & immigration | SPLIT from `aus-admissions.html` + FAQ | NEW/SPLIT (§20) |
| Admissions | `/admissions/transfer-students` | Transfers | NEW | NEW (§4) |
| Tuition & Scholarships | `/tuition` | Authoritative tuition hub (per program) | central data source (§22) — figures must be confirmed by business | NEW (§22) |
| Tuition & Scholarships | `/scholarships` | Scholarships | NEW (mention exists in calculator/FAQ only) | NEW (§22–23) |
| Tuition & Scholarships | `/tuition/financial-aid` · `/tuition/payment-options` · `/tuition/living-costs` | Financial aid, payment, living costs | FAQ + calculator content | NEW (§4) |
| Careers & Outcomes | `/careers` | Careers hub: services, outcomes, internships, employers, industry connections, alumni | NEW + content from program "Your Future" sections, IBM page | NEW (§24) |
| Careers & Outcomes | `/careers/graduate-outcomes` · `/careers/internships` · `/careers/success-stories` | Outcomes (verified only), internships, stories | NEW (real alumni only per §8 sec.7) | NEW |
| Student Life | `/student-life/campus` · `/housing` · `/living-in-switzerland` · `/activities` · `/international-community` · `/student-support` · `/campus-visits` · `/transportation` · `/cost-of-living` | Subpages | MERGE from student-life/campus-life pages + FAQ | NEW/MERGE (§25) |
| About AUS | `/about/at-a-glance` (optional) · `/about/rankings` (optional) · `/about/mission-and-values` · `/about/news` · `/contact` | Remaining About order items | `aus-about.html` content reorganized | NEW/SPLIT (§26) |
| Global | `/search` · 404 page · saved-programs view | Grouped search results; 404; My Programs (localStorage) | NEW | NEW (§30–31, §44) |

*Estimated net-new page count: ~30 (excluding optional About splits), before counting program Finder/Compare/tools which are features on top of pages.*

---

## 7. Open decisions needed before Stage 2 approval (business/stakeholder input)

| ID | Question | Blocks |
|---|---|---|
| D1 | **RESOLVED** — no CMS, no component framework; Webflow pages assembled from code-embed widgets; this repo remains the canonical per-page HTML working copy (see §1.1) | — |
| D2 | Which homepage variant (if any) is the approved/canonical design to rebuild from? Archive the rest? | Homepage rebuild |
| D3 | Provide real destinations for "Download Brochure"/"Request a Program Overview" (assets or guide-gated forms) | CTA fixes, §3 |
| D4 | Confirm authoritative tuition, fee, scholarship, deadline, intake figures + currency to seed the central source (§22). Academic-calendar docx should feed deadlines | /tuition, calculator, At a Glance |
| D5 | Are all 21 programs current/complete (e.g., Master Aviation Management missing from homepage grid; any programs to add/retire)? | Program IA |
| D6 | One global FAQ vs per-section FAQs (Admissions/Tuition/Visa)? | FAQ architecture |
| D7 | Keep Governance separate from Leadership, or one page? | About IA |
| D8 | Where does Speaker Series live (About → News/Events vs Student Life)? Any real News/events feed? | About IA, content |
| D9 | Application portal (study.aus.swiss) — is "Apply" meant to deep-link there throughout, or is an in-site application journey planned (§39 application_start/complete events)? | CTA system, analytics |
| D10 | Were any current `aus-*.html` URLs ever public/indexed? If yes, they need 301s in Webflow; if no, redirect plan collapses to near-zero | §33 redirects |
| D11 | Site search (§30) — Webflow has none natively; choose custom embed or third-party tool before Stage 6 | Search, §30 |

---

*Next step when approved: produce the Stage 2 deliverables — proposed sitemap + full navigation structure + complete URL map + tested redirect sheet — all still without touching site pages.*
