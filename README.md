# Connor Fuglestad Portfolio

A modern Astro-based portfolio for Connor Fuglestad, focused on applied data science, analytics engineering, healthcare AI, and natural language technology.

## Why this rebuild

The previous site was a large static Bootstrap template with duplicated content and many legacy assets. This version is intentionally small, responsive, and easier to maintain. Content lives in reusable Astro components, and deployments are automated through GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Build

```bash
npm run build
```

The static site is generated in `dist/`.

## Deploy to GitHub Pages

1. Replace the contents of the `cfuglestad.github.io` repository with this project.
2. Commit and push to the `main` branch.
3. In GitHub, open **Settings > Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. The included workflow will build and publish the site after each push.

## Add the resume

1. Copy the final resume PDF to:

   `public/resume/Fuglestad_resume_2026_ds.pdf`

2. In `src/pages/index.astro`, change the Resume button from:

   `href="/resume/"`

   to:

   `href="/resume/Fuglestad_resume_2026_ds.pdf"`

## Add or edit projects

The project cards are stored in the `projects` array near the top of `src/pages/index.astro`. Edit the title, description, tags, status, or add an `href` when a full project page or GitHub repository is ready.

## Recommended next steps

- Add the final data science resume PDF.
- Replace placeholder project statuses as work is completed.
- Add individual project pages under `src/pages/projects/`.
- Add a writing section when the first technical article is ready.
- Update GitHub pinned repositories to match the projects featured here.
