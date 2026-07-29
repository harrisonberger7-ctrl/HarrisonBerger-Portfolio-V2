# Portfolio Cleanup Report

## Scope

The supplied repository was treated as the source of truth. The refactor preserved the current pages and project content while improving validity, organization, reuse, accessibility, and maintainability.

## Corrected defects

- Repaired the malformed LinkedIn anchor on the home page.
- Repaired the malformed “Engineering drawings” list item on the About page.
- Corrected the Tri-Wheel Dolly weighted-testing video path and filename capitalization.
- Corrected Smart Water Bottle navigation links that pointed to nonexistent `/buckeye.html` and `/contact.html` pages.
- Removed an unmatched closing brace in the global stylesheet that could invalidate later CSS.
- Replaced a nonexistent generated-card placeholder path with an existing placeholder asset.
- Standardized viewport metadata formatting.
- Replaced placeholder portrait alternative text with descriptive text.

## Architecture changes

- Rebuilt `assets/css/style.css` into labeled sections with one declaration per line.
- Added centralized design tokens for colors, spacing, widths, radii, and shadows.
- Preserved backward-compatible variable aliases used by existing project styles.
- Consolidated duplicate `.cards-grid`, Air Motor media, featured-card, and machining slideshow rules.
- Moved Dolly weighted-testing styles from the global stylesheet into `dolly.css`.
- Standardized the mobile navigation structure and added skip links to all major pages.
- Replaced inline JavaScript display changes with the reusable `.is-open` class.
- Limited the project-data fetch to pages that actually contain generated project areas.
- Made modal and slideshow behavior safer when optional elements are absent.
- Expanded HTML escaping for generated project data.

## Removed unused assets

The following files were not referenced by HTML, CSS, JavaScript, or project data and were removed from the clean repository:

- `assets/Main_Page_Profile_Picture.png`
- `assets/images/Ball-In_Box-Content/Ball_In_Box_Finished.jpeg`
- `assets/images/Ball-In_Box-Content/Ball_In_Box_Fixture.MOV`
- `assets/images/Dolly_Content/Leveling.jpg`
- `assets/images/MIsc_Machining_Work/Battery_Compressors.jpeg`
- `assets/images/MIsc_Machining_Work/Coffee_Maker_Cage.jpeg`
- `assets/images/MIsc_Machining_Work/Scale.jpeg`
- `assets/images/MIsc_Machining_Work/Vice_Stops.jpeg`
- `assets/images/MIsc_Machining_Work/high_Pressure_Gas_Hub.jpg`
- `assets/images/headshot-placeholder.svg`
- `assets/images/hero-illustration.svg`
- `assets/images/project2.svg`
- `assets/images/project3.svg`

The Ball-In-Box and miscellaneous-machining folders were removed after becoming empty. Their content can be restored from the original ZIP if those projects are added later.

## Annotation approach

HTML, CSS, and JavaScript are annotated by purpose and logical operation. CSS uses one property per line and explanatory comments before selectors. JavaScript uses comments before each operation and function. HTML detailed-project pages already contained extensive section comments, which were retained.

JSON does not legally support comments. `data/projects.json` therefore remains valid JSON, and its purpose and extension process are documented in the main README rather than adding invalid pseudo-comments.

## Intentionally retained

- Absolute root paths such as `/assets/...` because the repository is a user GitHub Pages site and those paths remain stable from any nested project page.
- Separate detailed-project stylesheets because their visual systems are substantially different and combining them would create tightly coupled global CSS.
- Existing large media files that are actively displayed.
- Existing project copy, media order, and overall visual intent.

## Recommended future work

- Compress the largest MP4, GIF, GLB, and source images.
- Convert the remaining `.MOV` content before adding it to a page.
- Add poster images to local videos.
- Consider generating repeated header/footer markup during a future build-system migration. For a dependency-free static site, the small amount of repeated HTML is easier to understand and deploy than introducing a framework solely for includes.
