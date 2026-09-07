# AUS Navigation Comparison

## Scope

Comparison of the navigation requested in **Section 4 — Replace the Main Navigation** of `AUS Website Restructuring & Development Directive.docx` against the current shared navigation implementation.

The current header/menu pattern appears across all 37 HTML pages in this website folder.

## Executive Summary

The navigation requires a structural rebuild. The desktop header currently exposes only three content areas—Programs, About, and Campus Life—while Admissions is only available inside the off-canvas menu. The directive requires six top-level sections, four global utility actions, and substantially more complete submenu structures.

## Top-Level Navigation Comparison

| Required section | Current implementation | Required action |
| --- | --- | --- |
| Programs | Present in desktop header and off-canvas menu. It contains a Programs Overview link and Bachelor’s, Master’s, Doctorate, and Swiss Federal Diploma groups with individual program links. | **Keep and expand.** Add Find Your Program and Compare Programs. Keep the four degree-level groups. Standardize “Bachelors Degree” and “Masters Degree” to “Bachelor’s Programs” and “Master’s Programs.” |
| Admissions | Present only in the off-canvas menu. Its current links are Admissions & Financing, Cost Calculator, and Academic Calendar. | **Promote to desktop header and rebuild.** Create the requested Admissions submenu. Separate financing from Admissions. |
| Tuition & Scholarships | Not present. Cost Calculator is currently under Admissions. | **Add as a new top-level section.** Move Cost Calculator here and add all required tuition/finance links. |
| Careers & Outcomes | Not present. | **Add as a new top-level section** with the complete required submenu. |
| Student Life | Present as “Campus Life” in the desktop header and menu. It contains only Campus Life and Student Life. | **Rename to Student Life and expand.** Consolidate the overlapping Campus Life / Student Life content into the requested structure. |
| About AUS | Present as “About” in the desktop header and off-canvas menu. | **Rename to About AUS and reorganize.** Retain applicable existing content while adding missing directive items. |

## Required Submenu Comparison

### Programs

| Directive item | Current status | Action |
| --- | --- | --- |
| Find Your Program | Missing | Add; link to the guided Program Finder. |
| Bachelor’s Programs | Present as “Bachelors Degree” with program links | Rename and retain. |
| Master’s Programs | Present as “Masters Degree” with program links | Rename and retain. |
| Doctorate | Present | Retain. |
| Swiss Federal Diploma | Present | Retain. |
| Compare Programs | Missing | Add; link to program comparison. |

### Admissions

| Directive item | Current status | Action |
| --- | --- | --- |
| How to Apply | Missing | Add. |
| Entry Requirements | Missing | Add. |
| Required Documents | Missing | Add. |
| Application Deadlines | Missing | Add; place the Academic Calendar resource here if retained. |
| International Students | Missing | Add. |
| English Requirements | Missing | Add. |
| Visa & Immigration | Missing | Add. |
| Transfer Students | Missing | Add. |
| FAQ | Missing from Admissions; currently placed under About | Add here; relocate/generalize the current FAQ accordingly. |

**Current links to relocate:**

- **Admissions & Financing:** split into an Admissions hub and the new Tuition & Scholarships section.
- **Cost Calculator:** move to Tuition & Scholarships.
- **Academic Calendar:** move under Application Deadlines or another Admissions resource location; it is not a prescribed top-level menu item.

### Tuition & Scholarships

All required items are currently missing as an organized navigation section.

| Directive item | Action |
| --- | --- |
| Tuition Fees | Add. |
| Scholarships | Add. |
| Financial Aid | Add. |
| Payment Options | Add. |
| Living Costs | Add. |
| Cost Calculator | Move from the Admissions menu. |
| FAQ | Add a finance-focused FAQ entry. |

### Careers & Outcomes

All required items are currently missing from navigation.

- Career Services
- Graduate Outcomes
- Internships
- Employers
- Industry Connections
- Alumni
- Student Success Stories

### Student Life

| Directive item | Current status | Action |
| --- | --- | --- |
| Campus | Present as Campus Life | Rename/reposition as Campus. |
| Housing | Missing | Add. |
| Living in Switzerland | Missing | Add. |
| Student Activities | Missing | Add. |
| Clubs | Missing | Add. |
| International Community | Missing | Add. |
| Student Support | Missing | Add. |
| Transportation | Missing | Add. |
| Cost of Living | Missing | Add. |
| Campus Visits | Missing | Add. |

### About AUS

| Directive item | Current status | Action |
| --- | --- | --- |
| About AUS | Present | Retain. |
| Accreditation & Recognition | Present as “Accreditations & Memberships” | Rename and restructure to distinguish accreditation, recognition, rankings, and partnerships. |
| Rankings | Missing | Add. |
| History | Present | Retain. |
| Faculty | Present | Retain. |
| Leadership | Missing | Add or split from Governance after content decision. |
| Governance | Present | Retain. |
| Academic Partners | Only the individual Tiffin collaboration link exists | Add the parent item; nest/link Tiffin appropriately. |
| Industry Partners | Only the individual IBM collaboration link exists | Add the parent item; nest/link IBM appropriately. |
| News | Missing | Add. |
| Contact | Present globally, not within About | Retain as a utility action; include here only if the final information architecture requires it. |

## Global Utility Actions

| Directive requirement | Current status | Action |
| --- | --- | --- |
| Search / Ask AUS | Present as a search input with “Ask AUS Anything” placeholder | Keep; label the action consistently as Search / Ask AUS and ensure results follow the directive’s grouped-search requirement. |
| My Programs | Missing | Add; connect to saved programs. |
| Talk to Admissions | Present as “Contact” and links to a HubSpot form | Rename, confirm the destination is the admissions-specific contact flow, and retain as the secondary action. |
| Apply | Present | Keep as the strongest conversion action. Standardize visible wording to Apply or Apply Now across the site. |

## Remove, Rename, Move, or Edit

### Rename

- **About** → **About AUS**
- **Campus Life** → **Student Life**
- **Bachelors Degree** → **Bachelor’s Programs**
- **Masters Degree** → **Master’s Programs**
- **Accreditations & Memberships** → **Accreditation & Recognition**
- **Contact** → **Talk to Admissions**

### Move

- Move **Cost Calculator** from Admissions to Tuition & Scholarships.
- Move the generic **FAQ** from About to Admissions and Tuition & Scholarships as required; determine whether it remains one shared FAQ page with topic anchors or becomes dedicated section FAQs.
- Move **Academic Calendar** under Application Deadlines or an Admissions resources area.
- Place IBM and Tiffin collaboration pages beneath their respective Industry Partners and Academic Partners parent items.

### Remove from Main Navigation

- **Policies and Procedures** should remain footer-only.
- Remove the hidden placeholder link: `Accreditations_TEMP & Memberships`.

## Implementation Notes

- The desktop header and mobile/off-canvas navigation must expose the same six primary sections and the same essential paths.
- Use a desktop mega menu and a mobile accordion/menu structure, but keep the information architecture identical.
- Do not use the current behavior where a primary desktop navigation item merely opens a partial side panel. Each top-level section should be directly understandable and readily navigable on desktop and mobile.
- No new navigation destination should use a placeholder link.
- Apply must remain visually stronger than Talk to Admissions.

## Current Source Location

The current shared navigation markup and menu behavior are in `index.html` around lines 855–975. The same navigation pattern is present across the 37 site HTML pages.
