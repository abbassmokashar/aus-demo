# AUS Website Code Audit and SEO/GEO Report

Audit date: 15 September 2026

## Scope

The audit covered 58 canonical source pages, their clean-route copies, the generated `dist` site and the Webflow Code Embed packages. It reviewed HTML size, repeated CSS and JavaScript, headings, IDs, image markup, search data, metadata, canonical URLs, crawler files and structured data.

## Executive summary

The site is functionally complete, but its current code is much heavier and more repetitive than it needs to be. The 58 canonical HTML files contain 23.78 MB of code, averaging about 400 KB per page. The largest page is approximately 613 KB.

The most important issue is the site-search index. A large copy is embedded in every canonical page. It totals 11.43 MB across the 58 pages and represents 50.4% of their combined HTML. Moving that data to one cached shared file would provide the largest immediate reduction in page weight and maintenance risk.

The new technical SEO and generative-search layer is complete: every physical HTML page now has unique metadata and a production canonical; structured data is valid; the sitemap contains only the 57 indexable production URLs; and the 404 page remains excluded from indexing.

## Code findings

### 1. Search index duplicated on every page — high priority

- The same large `var idx` search dataset appears on all 58 canonical pages.
- Combined duplicated size: 11.43 MB.
- Approximate cost per page: 200 KB before compression.
- The largest repeated JavaScript block is approximately 218 KB and appears across 19 program pages.

Recommendation: generate one `search-index.json` or `search-index.js` file and load it once with browser caching. In Webflow, host it as a shared external asset or loader rather than repeating it inside every page's Code Embeds.

### 2. Shared CSS and JavaScript repeated between page families — high priority

- A 17.8 KB shared style block is repeated across 52 pages.
- A 38 KB program style block is repeated across 19 program pages.
- Other page families repeat blocks between approximately 12 KB and 30 KB.
- Header, navigation, footer, preloader, search and popup logic are copied into each page.

Recommendation: move common CSS into Webflow's global Head custom code and common behavior into one global Footer script. Keep only page-specific CSS and JavaScript in the numbered page widgets. The shared code should remain under Webflow's 50,000-character custom-code limit or be loaded as a cached external asset.

### 3. Preloader styles duplicated within individual pages — high priority

Forty-seven of 58 canonical pages contain repeated preloader CSS declarations inside the same document. This is genuinely redundant, unlike the deliberate source/dist copies.

Recommendation: retain one canonical preloader block and one safety-release script. Remove the repeated declarations only after a cross-page visual regression test.

### 4. Responsive hero markup creates multiple H1 elements — medium priority

- Thirty-three pages contain more than one H1 because desktop and mobile heroes are duplicated in the HTML.
- The Speaker Series page contains three H1 elements.

Recommendation: keep one semantic H1 and change layout with CSS. If separate desktop/mobile wrappers must remain, only one should be an H1; the duplicate visual title should be a styled non-heading element. This gives search engines and assistive technology a clearer primary page title.

### 5. Duplicate static ID on homepage news content — medium priority

The homepage repeats `id="newsModalTitle"` across multiple news items. IDs must be unique within a document and duplicate IDs can cause incorrect accessibility references or selector behavior.

Recommendation: assign a unique ID to every news title and point each modal's `aria-labelledby` to the matching title.

The repeated `finderNext` and `finderRetake` strings are generated in mutually exclusive interface states, so they are not simultaneous static-ID duplicates.

### 6. Heavy use of inline styling and overrides — medium priority

- 5,971 inline `style` attributes.
- 2,140 `!important` declarations.

These make responsive behavior harder to reason about and increase the chance that a local fix breaks another breakpoint.

Recommendation: migrate repeated inline declarations to named component classes, then reduce `!important` rules after confirming selector ownership. Do this page family by page family rather than with a global automated deletion.

### 7. Promotional popup repeated across many pages — medium priority

Popup markup and behavior are copied into 32 canonical pages. The feature may be intentional, but the repeated implementation is not necessary.

Recommendation: install the popup once as a Webflow component or site-wide script. Keep its frequency state shared across the domain and continue excluding it from utility pages such as the 404.

### 8. Multiple physical copies of pages — expected build duplication

The repository contains canonical source pages, clean-route GitHub copies and a complete `dist` copy. This is expected for the current static-hosting workflow, but these files should be treated as generated artifacts rather than edited manually.

Recommendation: edit only canonical source pages and rebuild route mirrors and `dist` from scripts. Canonical metadata now tells search engines that the production Webflow URL is authoritative, preventing the GitHub copies from competing in search.

### 9. Image accessibility review — low priority

- No image is missing an `alt` attribute.
- 269 images have empty alt text. Many are decorative logos, backgrounds or repeated visuals and should remain empty, but the content-bearing subset needs a manual visual review.
- No genuine locally hosted image reference remains in canonical page markup.
- Priority loading was added to hero images that are likely to become Largest Contentful Paint candidates.

Recommendation: review empty alt text visually and describe only images that communicate information. Do not add keyword-filled alt text to decorative images.

### 10. Encoding debris — resolved

The generated search data contained 4,276 broken middle-dot and dash characters. These were corrected across all physical HTML outputs. No audited canonical page now contains the detected mojibake sequences.

## SEO and generative-search work completed

- Added a unique SEO title and meta description for all 58 configured routes, with the 404 marked `noindex,follow`.
- Added canonical URLs using the production host `https://www.aus.swiss`.
- Added index, snippet and large-image preview directives to indexable pages.
- Added Open Graph and large-image social metadata.
- Added Twitter/X card metadata.
- Set document language to `en-CH`.
- Added the Webflow CDN preconnect and a consistent theme color.
- Added JSON-LD graphs containing `CollegeOrUniversity`, `EducationalOrganization`, `WebSite`, `WebPage` and `BreadcrumbList` data.
- Added `Course` data to all 21 degree and diploma pages.
- Added an `ItemList` of all programs to the programs overview.
- Added 49 visible questions and answers to the FAQ page's `FAQPage` data.
- Added the institution's official name, address, telephone, logo and social profiles to organization data.
- Added `sitemap.xml` containing the 57 indexable canonical production URLs and excluding the 404.
- Added `robots.txt`, explicitly allowing OAI SearchBot, ChatGPT-User, Claude search/user agents and ordinary crawlers.
- Added `llms.txt`, providing AI answer engines with a concise institutional description and authoritative links.
- Added a generated Webflow SEO settings sheet and Webflow implementation guide.
- Updated both Webflow builders to preserve `application/ld+json` correctly.
- Corrected the previously inaccurate History page title and standardized other search titles.

Validation results:

- 158 physical HTML files checked.
- 158 valid JSON-LD blocks.
- 57 canonical URLs in the sitemap.
- 28,354 internal references checked with zero broken links.
- 369 Webflow Code Embed widgets validated below the 50,000-character limit.
- 58 structured-data blocks validated in the Webflow output.

## Required Webflow and search-console steps

Code alone cannot guarantee rankings. After installing the page embeds:

1. Set Webflow's global canonical URL to `https://www.aus.swiss`, without a trailing slash.
2. Populate each page's Webflow SEO and Open Graph settings using `webflow/seo-settings.csv`.
3. Enable Webflow's automatic sitemap and keep the 404 utility page excluded from indexing.
4. Apply the crawler policy from `robots.txt` in Webflow Site settings.
5. Publish `llms.txt` at the production root through the hosting layer if Webflow cannot serve the file directly.
6. Submit the production sitemap to Google Search Console and Bing Webmaster Tools.
7. Test the homepage, programs overview, one degree page and the FAQ page using Google's Rich Results Test and URL Inspection.
8. Maintain accurate, clearly sourced program, admissions, ranking and outcomes content. Structured data must always match visible page content.
9. Build authoritative external signals through the school's verified profiles, academic partners, accreditation bodies, Google Business Profile and relevant education directories.

## Evidence and implementation references

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link)
- [Google canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [OpenAI publisher and OAI-SearchBot guidance](https://help.openai.com/en/articles/12627856)
- [Webflow SEO title and description settings](https://help.webflow.com/hc/en-us/articles/33961237278611-Add-SEO-title-and-meta-description)
- [Webflow canonical settings](https://help.webflow.com/hc/en-us/articles/33961263684115-Set-canonical-tags-to-improve-SEO)
