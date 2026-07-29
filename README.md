# Harrison Berger Engineering Portfolio

A static GitHub Pages portfolio for machining, mechanical design, manufacturing, and engineering projects.

## Repository map

```text
.
├── index.html                         # Home page and featured-project area
├── about.html                         # Biography, skills, education, and experience
├── projects/
│   ├── engineering.html              # Engineering-project index
│   ├── machining.html                # Machining-project index
│   ├── dolly.html                    # Detailed Tri-Wheel Dolly case study
│   ├── smart-water-bottle.html       # Detailed Smart Water Bottle case study
│   └── buckeye/index.html            # Buckeye Space Launch Initiative page
├── assets/
│   ├── css/style.css                 # Shared site design and components
│   ├── css/dolly.css                 # Tri-Wheel Dolly page only
│   ├── css/smart-water-bottle.css    # Smart Water Bottle page only
│   ├── js/main.js                    # Shared navigation, cards, modal, slideshows
│   ├── js/dolly.js                   # Dolly image-dialog behavior
│   └── images/                       # Project media grouped by project
├── data/projects.json                # Records used for generated project cards
├── docs/CLEANUP_REPORT.md            # Refactor decisions and removed files
└── scripts/validate-site.py           # Local internal-link and asset checker
```

## Local preview

Opening HTML files directly from the file system can block `fetch()` and absolute paths. Run a local web server from the repository root instead:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Adding a new project

1. Create a media folder under `assets/images/`, such as `assets/images/New_Project_Content/`.
2. Create a detailed page under `projects/`, such as `projects/new-project.html`.
3. Start from the header, navigation, main-content, and footer structure used by an existing detailed project page.
4. Add project-only styles in a separate file only when shared components in `style.css` are insufficient.
5. Add a project record to `data/projects.json` when the project should appear in a JavaScript-generated area.
6. Run `python scripts/validate-site.py` before publishing.

## Styling rules

- Put site-wide colors, spacing, radii, widths, and typography in the `:root` design tokens at the top of `assets/css/style.css`.
- Reuse `.container`, `.card`, `.btn`, and `.cards-grid` before creating a new component.
- Keep page-specific selectors in that project's stylesheet.
- Prefer classes over element IDs for reusable presentation.
- Use IDs for unique landmarks, JavaScript hooks, and in-page links.
- Keep responsive rules next to the component or in the clearly labeled responsive section.

## JavaScript rules

- `assets/js/main.js` is for behavior shared by multiple pages.
- A project-specific script should be used only when a detailed page needs unique behavior.
- Keep project copy and media paths in HTML or `data/projects.json`, not scattered through event handlers.
- Check that an element exists before attaching behavior so the shared script remains safe on every page.

## Media guidance

The current repository includes several large GLB and video files. GitHub Pages can host them, but large files slow cloning and page loading. Future optimization should prioritize video compression, poster images, lazy loading, and lighter GLB exports without changing visual quality unnecessarily.

## Validation

Run:

```bash
python scripts/validate-site.py
node --check assets/js/main.js
node --check assets/js/dolly.js
```

The Python validator checks internal page links, images, stylesheets, scripts, videos, PDFs, and model paths.
