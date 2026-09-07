
I'm the web developer for AUS Business School (aus.swiss), built on Webflow. I built a first homepage/hero redesign as standalone Webflow Embed code blocks with GSAP. The internal team liked it, but management rejected it and wants a different direction. I'm attaching the official brand guidelines PDF too. Redesign this from scratch based on the feedback below — don't just tweak the existing files.

## What management didn't like, and what to do instead

**1. Too much high-contrast color / too "loud."**
Stop treating navy (#22295f), crimson (#be1f3d), and yellow (#fff737) as three co-equal loud blocks fighting for attention on every section. Instead:
- Let white and the light blue tint (#bbddf8, and lighter tints derived from it) carry most of the page as calm negative space.
- Use navy mainly for typography ink and one or two anchor sections, not as a constant background block.
- Treat crimson and yellow as *rare* accent flashes (a single underline, a single tag, a single button) — not full-bleed color blocks.
- Introduce soft gradient fades / tinted transitions between sections instead of hard color-block edges, so scrolling feels smooth and continuous rather than jumping between saturated panels.

**2. No "Bachelor / Master / Doctorate" pills or tabs inside the hero banner.**
The hero should sell the *feeling/positioning* of the school (heritage + modern, Swiss precision, outcomes), not a program-level navigation widget. Program level selection belongs lower on the page or in its own dedicated, well-designed module — not competing with the hero headline.

**3. No "text-beside-image" generic sections.**
Management specifically dislikes the standard two-column "paragraph on the left, photo on the right" layout repeated section after section. Replace these with more editorial/asymmetric formats — e.g. full-bleed image bands with overlaid text, scroll-driven horizontal galleries (we already have a working pinned horizontal-scroll pattern from the old build, reuse that technique), stat/number-led sections, card grids, or image collages with typography breaking across/over the image rather than sitting neatly beside it.

**4. Reference site: euruni.edu — three things specifically:**
- **Mega menu**: a full-screen (or large panel) menu overlay that opens on click, showing categorized navigation (Programs / Campuses / About / etc. each with sub-links) rather than a simple horizontal nav bar or basic dropdown. Should feel like its own designed screen, not a shrunk-down list.
- **Footer social icons**: icon tiles/thumbnails for each social platform (not tiny inline glyphs) — treat the footer social row as a small visual grid, not a plain icon strip.
- **Section rhythm**: alternating full-width banner sections, stat bands, and card grids — not paragraph blocks.

**5. Gen Z / "think outside the box" direction.**
Management wants something that doesn't read as a template. Concretely, that means:
- Unexpected but purposeful scroll-triggered reveals (not just fade-up-on-scroll everywhere).
- Interactive or playful micro-details (cursor-aware hover states, numbers that count up, an unconventional cursor or scroll-progress indicator, etc.) used sparingly and with intent — not decoration for its own sake.
- Typography that takes risks: oversized display type, mixed-scale headlines, Playfair Display used more boldly for editorial moments (pull quotes, section openers) rather than only tiny "Est. 1991"-style labels.
- Avoid stock "university website" tropes: no smiling-students-in-a-circle photo grids, no generic icon+heading+paragraph trio repeated forever.

## Brand constraints (hard requirements, from the brand book — do not deviate)

- Colors: white `#ffffff`, navy `#22295f`, crimson `#be1f3d`, light blue `#bbddf8`, yellow `#fff737`, gray-blue `#768cb0`. These are the only approved colors — the redesign should *use fewer of them per screen*, not add new ones.
- Fonts: **Inter** for titles/CTAs, **Playfair Display** for subtitles/editorial moments.
- Brand tone: "modern heritage," elegant with a touch of audacity, curved delicate lines + bold strokes, timeless. Communicate with clarity and purpose, never salesy.
- No em dashes anywhere in copy (site-wide rule).
- Logo has approved colorways only: full color, solid navy/black, solid white — see brand book's Logo page.

## Technical constraints (keep our existing engineering patterns)

- Deliver as standalone Webflow Embed HTML/CSS/JS blocks (one embed per section), not a full site build.
- Use GSAP for animation, vanilla JS where GSAP isn't needed.
- Content must be visible by default in plain CSS (no-JS fallback); GSAP/JS is progressive enhancement layered on top via two gating classes: `js-gsap-ready` and `js-reveal-ready` (keep this pattern to avoid race conditions, as in the current build).
- Reuse the pinned horizontal-scroll gallery technique and the vanilla-JS scroll parallax we already built, where it fits the new section design.
- Mobile-first responsive; reduced-motion media query respected.

## What I want from you

1. First, propose 2–3 distinct visual/creative directions (mood, layout philosophy, color usage ratio, animation personality) as short written concepts before any code — so I can pick one to run with instead of building blind.
2. Once I pick a direction, build the homepage hero + at least 3 supporting sections (e.g. programs overview, campus/stats, a full-bleed editorial band) as Webflow Embed blocks following the technical constraints above.
3. Flag anywhere you're making an assumption about content (copy, images, stats) so I can swap in real AUS content before shipping.

---
 
So I developed a better version named 'aus-home-demo.html' so I want you to follow the idea from here so we can build rest of the pages ok?
