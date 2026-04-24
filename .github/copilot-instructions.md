# Copilot Instructions for Suno Repository

## Repository Overview

**Suno** is a web application that visualizes the direction of the sun during car trips, helping users plan routes based on solar position and lighting conditions. The project consists of multiple components:

- **Frontend** (`/app`): Interactive Preact/Vite web application with internationalization (English & French)
- **Backend** (`/api`): Serverless .NET Azure Functions application providing geocoding and route direction data via Azure Maps integration
- **Satellite Sites** (`/site.fr`, `/site.redirect`): Additional Vite-based projects for localized and redirect functionality

**Technology Stack**: Preact, ViteJS, Chart.js, .NET (Azure Functions), Azure Maps API. **Languages**: JavaScript (frontend), C# (backend).

---

## Code Style & Conventions

### Frontend (`/app`)

- Accessibility is a key priority:
  - Use semantic HTML
    - Use ARIA attributes, but only when necessary (do not overuse ARIA if native HTML can achieve the same result)
  - Minimum compliance: WCAG 2.2 AA and RGAA 4.1 AA — aim for WCAG 2.2 AAA wherever the design system palette and layout allow
  - Ensure proper keyboard navigation support
  - Ensure a natural language structure in HTML for screen readers

- Use i18n for all user-facing text, do not hardcode strings in JSX

Design principles (see `design-system.md` for the full specification):

- **Semantic color roles**: Yellow (`#FFCF57`) is exclusively for solar data and branding; Blue (`#007EA7`) is exclusively for interactive elements. Never swap these roles — yellow is never used on a button, blue is never used on solar visualizations.
- **Always use CSS tokens**: Never hardcode hex values. Use the defined CSS custom properties (`--color-sun`, `--color-nav`, `--color-text`, etc.) for all colors, and `--space-*` / `--radius-*` tokens for spacing and border radii.
- **Flat UI only**: No drop shadows, gradients, blur, or decorative effects. Visual hierarchy is achieved through color, weight, spacing, and border width alone. The only permitted `box-shadow` is the focus ring (`0 0 0 2px`).
- **Typography cap at weight 500**: Never use `font-weight: 600` or `700`. Field labels are the only uppercase text (with `letter-spacing: 0.06em`); use sentence case everywhere else.
- **8px spacing grid**: All spacing values must be multiples of 8px (or 4px for micro-spacing inside compact components).
- **Max content width 480px**: The main content area, route card, and overlays are capped at 480px. The mobile/desktop breakpoint is 768px.
- **Icons are inline SVG only**: No icon fonts or external icon libraries. All icons use strokes (`stroke-width: 1.2–1.5px`, `fill: none`) except filled dot icons.
- **One primary button per screen**: Never place two primary buttons on the same screen. The sun-themed secondary button is only used for actions that directly relate to solar data output.
- **Input fields are `<button>` elements**: Location fields are styled `<button>` elements that open a search overlay (mobile) or dropdown (desktop) — not native `<input>` elements.
- **Chart.js on `<canvas>` for the polar chart**: The sun-exposure polar chart is implemented with Chart.js. Wrap the canvas in a container with `role="img"` and a descriptive `aria-label`.

Styling conventions:

- Do not use inline styles in JSX - all styles should be defined in CSS files and imported
- Use CSS classes for styling and ensure they follow the BEM naming convention for maintainability (refactor existing styles to follow BEM if necessary)
- use CSS identifiers corresponding to the current page for scoping (e.g. `#journey`) and avoid global styles that can cause conflicts
- Use CSS variables for colors, spacing, and other design tokens to ensure consistency and easy theming

Technical conventions:

- Use simple functional components and hooks, avoid too large components
  - break down into smaller reusable pieces when necessary
  - each component should ideally be in its own file for clarity and maintainability: main pages in `pages/`, shared components in `components/`
- Use URL and query parameters for state management (i.e. route parameters) instead of complex global state management. The current application state must always be reflected via the URL for shareability and bookmarking.
- Always increment the patch version in `package.json` and `sw.js` on any change to the frontend codebase, even for minor fixes or non-code changes, to ensure proper cache invalidation of the service worker and assets.

---

## Build & Development Instructions

### Frontend (`/app`) - Always execute from repo root

**Prerequisites**: Node.js 18+ (tested: npm 11.9.0). Run commands from `/app` directory.

**Bootstrap/Install Dependencies** (Required - run first):
```bash
cd app
npm install
```
**Development Server**:
- English version: `npm run dev:en` (or `npm run dev` for default English)
- French version: `npm run dev:fr`
- Opens on `http://localhost:5173`
- Automatically copies `index.en.html` or `index.fr.html` to `index.html` before starting

**Build for Production**:
```bash
npm run build
```
- Creates optimized output in `dist/` directory
- Generates separate bundles for `index.html`, `index.en.html`, `index.fr.html`, and `offline.html`
- Always copies `index.en.html` to `index.html` automatically

**Testing**:
```bash
npm test -- --run
```
- Framework: Vitest v4.0.7
- Tests location: `test/services/` 
- Run without `--run` flag for watch mode during development

**Linting CSS**:
```bash
npm run lint
```
- Framework: stylelint v17.4.0 with alphabetical property ordering plugin
- **Known Issue**: Lint fails with 4 errors in `src/index.css` related to deprecated CSS `clip` property
- These errors are **expected and do not block CI/CD**
- Errors can be identified but should be resolved separately (CSS modernization task)
- Config location: `app/.stylelintrc.json`

**Architecture Notes**:
- Entry points: `main.en.jsx`, `main.fr.jsx` (language-specific)
- Main app: `app.jsx` (Router, Preact, i18n setup)
- Routes: Home, Journey, Sun, Directions (see `pages/` directory)
- Internationalization: i18n files in `i18n/` (en.json, fr.json)
- Services: API client (`api.js`), routing, directions, sun calculations
- Vite config: `vite.config.js` - builds multiple HTML entry points
- Environment: Uses `.env.production` during CI build (injected via Azure Pipelines)

---

### Backend (`/api`) - Always execute from repo root

**Prerequisites**: .NET SDK (tested: 10.0.101), Azure Functions Core Tools (tested: 4.9.0)

**Critical Step Before Any Build**: Always restore NuGet packages first
```bash
cd api
dotnet restore
```
- **Do not skip this step** - `dotnet clean` will fail without restore first
- Restores Microsoft.Azure.Functions.Worker and related packages

**Clean Build** (full rebuild):
```bash
dotnet clean && dotnet build
```
- Creates binaries in `bin/Debug/net8.0/`
- Always restore first: `dotnet restore` must be run before this sequence

**Build for Release** (Azure deployment):
```bash
dotnet build --configuration Release --arch x64 --os win --no-self-contained
```
- Used by CI/CD pipeline (see azure-pipelines.yml)

**Run Locally**:
1. Copy settings file: `cp local.settings.json.sample local.settings.json`
2. Edit `local.settings.json` and set `AZURE_MAPS_API_KEY` to a valid Azure Maps API key
3. Start functions host:
```bash
func host start
```
- Listens on `http://localhost:7071`
- Requires valid AZURE_MAPS_API_KEY in local.settings.json

**Project Structure**:
- `Program.cs`: Dependency injection setup (Application Insights, CORS, Functions configuration)
- `Health.cs`: GET / endpoint (healthCheck)
- `Directions.cs`: POST /api/directions function (Azure Maps routing)
- `Geocoding.cs`: POST /api/geocoding function (address to coordinates)
- `Model.cs`: Shared data models (Location, Route, Waypoint)
- `AzureMapsDirections.cs`: Azure Maps Directions API client
- `AzureMapsGeocode.cs`: Azure Maps Geocoding API client
- `host.json`: Functions runtime configuration

**Configuration**:
- `local.settings.json.sample`: Template with required settings
- Required env vars: `AZURE_MAPS_API_KEY`, `FUNCTIONS_WORKER_RUNTIME=dotnet-isolated`, `AzureWebJobsStorage`
- Uses Azure Functions v4 isolated worker model

---

## CI/CD & Validation Pipelines

**Azure Pipelines** runs on every push to `main` branch (separate pipelines for `app/` and `api/` due to path-based triggers).

### Frontend CI (`app/azure-pipelines.yml`)
1. `npm ci` - clean install dependencies (same as npm install)
2. Download encrypted `.env.production` file from secure storage
3. Copy to `app/.env.production`
4. `npm run build` - production build
5. Publish `dist/` as pipeline artifact

**Validation to replicate locally**: Run `npm run build` and verify `dist/` directory is created without errors.

### Backend CI (`api/azure-pipelines.yml`)
1. `dotnet build` - builds with Release configuration
2. `dotnet publish` - creates Windows x64 publish output (no self-contained)
3. Publish artifact to Azure Function App

**Validation to replicate locally**:
```bash
dotnet restore
dotnet build --configuration Release --arch x64 --os win --no-self-contained
dotnet publish --configuration Release --arch x64 --os win --no-self-contained --no-build
```

---

## Secondary Projects

**`site.fr/`**: French-specific website with Tailwind CSS v4
- Build: `npm install && npm run build`
- Uses Tailwind CSS plugin for Vite
- Entry points: `index.en.html`, `index.fr.html`

**`site.redirect/`**: Redirect/routing site
- Build: Similar to site.fr with Tailwind CSS
- TypeScript Vite config (`vite.config.ts`)

Both follow similar npm build patterns to `/app` but are independently deployable.

---

## Key Facts & Warnings

1. **Always use `dotnet restore` before any dotnet command** in `/api` - NuGet package resolution is required
2. **CSS Linting errors are expected** - `npm run lint` fails due to deprecated CSS properties but does NOT block CI/CD
3. **Test before committing**: Run `npm test -- --run` in app and `dotnet build` in api
4. **Environment variables required**: API needs Azure Maps key in `local.settings.json`
5. **Multiple entry points**: Frontend builds 4 HTML bundles (index.html, index.en.html, index.fr.html, offline.html)
6. **Build times**: Frontend ~1.4s, Backend ~15s, npm install ~14s. Plan accordingly for large changes
7. **Language support**: Preact-i18n handles EN/FR routing via language picker component
8. **Third-party integrations**: Azure Maps (geocoding/directions), Application Insights (telemetry)
9. **No breaking changes expected** in dependencies - all major versions are pinned in package.json and .csproj

---

## Trust These Instructions

This document contains validated build steps, timings, expected errors, and workarounds discovered through thorough testing. **Trust the steps and commands documented here.** Only perform additional searches if you encounter errors not mentioned in this guide or if the codebase structure has changed significantly from what is described above.

Update this document if you discover new issues, errors, or necessary steps during development or code review, to ensure it remains an accurate source of truth for future contributors.
