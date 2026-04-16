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
  - Use semantic HTML, ARIA attributes when necessary
  - Ensure WCAG guidelines (level AAA) and RGAA standards are met
  - Ensure proper keyboard navigation support
  - Ensure a natural language structure in HTML for screen readers
- Use i18n for all user-facing text, do not hardcode strings in JSX

Design principles:
- Design for ease of use and clarity, following the principles from Don Norman's "The Design of Everyday Things":
  - Make important information and controls visible and easily discoverable
  - Provide clear feedback for user actions (e.g. loading states, error messages)
  - Use consistent design patterns and UI elements throughout the app
  - Avoid overwhelming users with too much information at once - break down complex tasks into simpler steps
- Follow the recommandations from Steve Krug's "Don't Make Me Think" for intuitive navigation and user experience:
  - Ensure that the purpose of each page and element is immediately clear to users
  - Use clear and descriptive labels for buttons and links
  - Minimize the number of clicks required to complete common tasks
  - Avoid unnecessary complexity in the user interface

Technical conventions:

- Do not use inline styles in JSX - all styles should be defined in CSS files and imported
- Use simple functional components and hooks, avoid too large components - break down into smaller reusable pieces when necessary
- Use URL and query parameters for state management (i.e. route parameters) instead of complex global state management. The current application state must always be reflected via the URL for shareability and bookmarking.

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
