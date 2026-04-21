# Suno Design System

**Version:** 1.0
**Last updated:** April 2026
**Maintainers:** Design Lead, Frontend Lead
**Audience:** UX Designers & Frontend Developers (all levels)

> **How to use this document**
> This is the single source of truth for the Suno UI. Every color, spacing value, component behavior, and screen layout described here must be implemented exactly as specified. When you add new screens or components, follow the structure of existing sections and open a pull request for review before merging. If something is unclear, ask before deviating.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Iconography](#5-iconography)
6. [Components](#6-components)
   - 6.1 [App Bar](#61-app-bar)
   - 6.2 [Buttons](#62-buttons)
   - 6.3 [Input Fields](#63-input-fields)
   - 6.4 [Time Chips](#64-time-chips)
   - 6.5 [Tag Pills](#65-tag-pills)
   - 6.6 [Badges](#66-badges)
   - 6.7 [Route Card](#67-route-card)
   - 6.8 [Autocomplete Dropdown (Desktop)](#68-autocomplete-dropdown-desktop)
   - 6.9 [Search Overlay (Mobile)](#69-search-overlay-mobile)
   - 6.10 [Polar Chart](#610-polar-chart)
   - 6.11 [Summary Cards Grid](#611-summary-cards-grid)
   - 6.12 [Step List](#612-step-list)
7. [Screens](#7-screens)
   - 7.1 [Welcome](#71-welcome)
   - 7.2 [Route Entry](#72-route-entry)
   - 7.3 [Sun Position](#73-sun-position)
   - 7.4 [Directions](#74-directions)
8. [States & Interactions](#8-states--interactions)
9. [Responsive Behavior](#9-responsive-behavior)
10. [Accessibility](#10-accessibility)
11. [Adding New Screens or Components](#11-adding-new-screens-or-components)
12. [Changelog](#12-changelog)

---

## 1. Design Principles

These three principles govern every decision in the Suno design system. When in doubt, refer back to them.

### 1.1 Semantic Color Roles

Every color has one fixed job. Colors must never be repurposed outside their defined role.

| Color family | Role | What it represents |
|---|---|---|
| **Yellow** (`#FFCF57`) | Brand / Solar data | The sun itself |
| **Blue** (`#007EA7`) | Interaction / Navigation | All user actions and controls |
| **Gray** | Structure / Neutral | Layout, borders, secondary text |

**Rule:** Yellow is never used on a button. Blue is never used on solar-data visualizations. These two roles are always distinct.

### 1.2 Accessibility First

Every design decision must not create accessibility barriers. The minimum requirement is **WCAG 2.2 AA** compliance for all text and interactive elements, and **RGAA 4.1 AA** for French-language deployments. Aim for **WCAG 2.2 AAA** whenever the palette and layout allow it.

- All text on yellow backgrounds must use `#7A4F00` (Sun Text) — not black, not dark gray.
- All interactive elements must have a visible focus ring: `2px solid #007EA7`, `outline-offset: 2px`.
- All form fields must have a visible label above them — never placeholder-only.
- Minimum touch target size on mobile: **44 × 44px**.

### 1.3 Flat & Purposeful

The Suno UI is flat. It does not use drop shadows, gradients, blur, or decorative effects. Visual hierarchy is created through color, typography weight, spacing, and border weight only.

- No `box-shadow` except for focus rings (`box-shadow: 0 0 0 2px`).
- No `background-image` gradients on any surface.
- No `backdrop-filter`.

---

## 2. Color Tokens

Define these as CSS custom properties on `:root`. Never hardcode hex values in component code — always use the token name.

```css
:root {
  /* Solar palette */
  --color-sun:          #FFCF57;  /* Brand yellow, solar data fill */
  --color-sun-dark:     #E6A800;  /* Darker yellow: icon strokes, destination dot, chart core */
  --color-sun-text:     #7A4F00;  /* Text on any yellow surface — WCAG AA compliant */
  --color-sun-bg:       #FFF8E1;  /* Light yellow surface: confirmed field background */
  --color-sun-border:   #FFE08A;  /* Border on sun-bg surfaces */

  /* Navigation / interaction palette */
  --color-nav:          #007EA7;  /* Primary action: buttons, active borders, links */
  --color-nav-dark:     #005F80;  /* Hover state on nav elements */
  --color-nav-bg:       #E6F4F9;  /* Light blue surface: focused field background */
  --color-nav-border:   #A8D8EA;  /* Border on nav-bg surfaces */
  --color-nav-text:     #003D52;  /* Text on nav-bg surfaces */

  /* Neutral palette */
  --color-gray-1:       #F5F5F4;  /* Background surfaces, skeleton loaders */
  --color-gray-2:       #E0DDD8;  /* Structural borders, dividers */
  --color-gray-3:       #9A9590;  /* Placeholder text, muted labels, secondary info */
  --color-text:         #1A1A1A;  /* Primary body text */
  --color-white:        #FFFFFF;  /* Card surfaces, overlay backgrounds */

  /* Semantic (errors only) */
  --color-error:        #C0392B;  /* Validation error text */
  --color-error-bg:     #FFF0EE;  /* Validation error field background */
  --color-error-border: #E08070;  /* Validation error field border */
}
```

### 2.1 Color Usage Rules

**DO:**
- Use `--color-sun` for filled solar-data elements (chart sectors, brand mark, active tag background).
- Use `--color-nav` for all interactive elements (buttons, active field borders, step indicators, links).
- Use `--color-sun-text` for any text or icon placed on a `--color-sun-bg` or `--color-sun` surface.
- Use `--color-nav-text` for any text placed on a `--color-nav-bg` surface.
- Use `--color-gray-3` only for non-critical information (placeholder, distance label, metadata).

**DO NOT:**
- Use `--color-sun` as a button background color.
- Use `--color-nav` for solar data visualizations.
- Use `--color-gray-3` for primary content that the user needs to read to complete a task.
- Create tints by applying opacity to brand colors. Use the named surface token instead (e.g., `--color-sun-bg` not `rgba(255, 207, 87, 0.1)`).
- Introduce any hex value not in this palette without opening a design ticket.

### 2.2 Contrast Ratios (Pre-calculated)

| Foreground | Background | Ratio | WCAG Level |
|---|---|---|---|
| `#1A1A1A` | `#FFFFFF` | 17.7:1 | AAA ✅ |
| `#007EA7` | `#FFFFFF` | 4.6:1 | AA ✅ |
| `#FFFFFF` | `#007EA7` | 4.6:1 | AA ✅ |
| `#7A4F00` | `#FFF8E1` | 6.2:1 | AA ✅ |
| `#7A4F00` | `#FFCF57` | 4.8:1 | AA ✅ |
| `#003D52` | `#E6F4F9` | 8.1:1 | AAA ✅ |
| `#9A9590` | `#FFFFFF` | 2.8:1 | FAIL ❌ — secondary text only |

> ⚠️ `--color-gray-3` on white fails WCAG AA. It may only be used for non-essential labels (placeholder text, distance metadata). Never use it for content the user must read to complete a task.

---

## 3. Typography

Suno uses the system sans-serif font stack. No external fonts are loaded. This minimizes load time and ensures consistent rendering across all devices and operating systems.

```css
font-family: system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
```

### 3.1 Type Scale

| Role | Size | Weight | Line height | Letter spacing | Color token | Usage |
|---|---|---|---|---|---|---|
| Screen title | 20–22px | 500 | 1.2 | -0.03em | `--color-text` | H1 per screen |
| Section title | 16–17px | 500 | 1.3 | -0.02em | `--color-text` | H2 within a screen |
| Body | 13–14px | 400 | 1.6 | 0 | `--color-text` | Descriptions, step text |
| Field value | 12–13px | 400 | 1.4 | 0 | `--color-text` | Text inside input fields |
| Field label | 10px | 500 | 1 | 0.06em | `--color-gray-3` | Label above a field (uppercase) |
| Badge / chip | 10–11px | 500 | 1 | 0 | Depends on surface | Tags, pills, step indicator |
| Muted / meta | 10–11px | 400 | 1.4 | 0 | `--color-gray-3` | Distance, country, secondary info |

### 3.2 Typography Rules

- **Maximum weight is 500.** Never use `font-weight: 600` or `700` anywhere in the UI.
- **Weight 400** is used for all body copy, field values, and step text.
- **Weight 500** is used for titles, labels, button labels, and badge text only.
- **Field labels are always uppercase** with `letter-spacing: 0.06em`. This is the only place uppercase is used in the UI.
- **Sentence case everywhere else.** No title case, no all-caps in body text or button labels.

---

## 4. Spacing & Layout

All spacing is based on an **8px base unit**. Every spacing value is a multiple of 8 (or 4 for micro-spacing inside compact components).

### 4.1 Spacing Scale

| Token | Value | Typical use |
|---|---|---|
| `--space-1` | 4px | Icon-to-text gaps, internal chip padding |
| `--space-2` | 8px | Gap between stacked elements in a card |
| `--space-3` | 12px | Card internal padding (compact) |
| `--space-4` | 16px | Card internal padding (default), app bar padding |
| `--space-5` | 24px | Gap between major sections |
| `--space-6` | 32px | Gap between screens or large blocks |

### 4.2 Border Radius Scale

| Token | Value | Used on |
|---|---|---|
| `--radius-sm` | 6–7px | Dropdown items, badge pills (compact) |
| `--radius-md` | 8px | Input fields, time chips, summary cards |
| `--radius-btn` | 9–10px | Buttons, search pill in overlay |
| `--radius-lg` | 14px | Main route card, search overlay header |
| `--radius-full` | 50% | Swap button, direction icon circles, track dots |

### 4.3 Border Widths

| Use | Width |
|---|---|
| Default structural border | 0.5px |
| Active / focused input border | 1.5px |
| Focus ring (keyboard navigation) | 2px |
| App bar bottom border | 0.5px |
| Track line (step list) | 1px |

### 4.4 Page Layout

```
Max content width:  480px (route card, overlays)
App bar height:     52px
Screen padding:     16px horizontal, 16px vertical
Breakpoint:         768px (mobile to desktop behavior switch)
```

---

## 5. Iconography

All icons in the Suno UI are inline SVG. No icon font or external icon library is used.

### 5.1 Icon Sizes

| Context | Size |
|---|---|
| In-field leading icon (dot) | 10 × 10px |
| In-chip leading icon | 10–12px |
| Search icon in pill | 13 × 13px |
| Logo mark SVG | 16 × 16px |
| Chevron, arrow icons | 11–14px |
| Swap button icon | 14 × 14px |
| Direction icon (circle container) | 24 × 24px |
| List item icon container | 28 × 28px |

### 5.2 Stroke Style

All icons use strokes, not fills (except for the filled-circle dot icons and the logo mark core).

```css
stroke-linecap: round;
stroke-linejoin: round;
stroke-width: 1.2px;   /* small icons */
stroke-width: 1.5px;   /* medium and large icons */
fill: none;             /* unless explicitly a filled icon */
```

### 5.3 Icon Color Rules

| Surface | Icon stroke color |
|---|---|
| On `--color-nav-bg` | `--color-nav` |
| On `--color-sun-bg` | `--color-sun-dark` |
| On white / gray-1 (decorative) | `--color-gray-3` |
| On white / gray-1 (interactive) | `--color-nav` |
| Departure dot (filled) | `--color-nav` |
| Destination dot (filled, confirmed) | `--color-sun-dark` |
| Destination dot (filled, empty) | `--color-gray-3` |
| Sun-exposure tracker dot (filled) | `--color-sun`, border `--color-sun-dark` |
| Neutral tracker dot (hollow) | White fill, border `--color-gray-2` |

---

## 6. Components

Each component section follows the same structure:

1. **What it is** — one sentence.
2. **Anatomy** — the parts that make up the component.
3. **Specs** — exact values for every visual property.
4. **States** — all possible states with their visual changes.
5. **Behavior** — interactions and transitions.
6. **Accessibility** — required ARIA and keyboard support.
7. **Do / Don't** — common mistakes to avoid.

---

### 6.1 App Bar

The app bar is the persistent header that appears at the top of every screen.

#### Anatomy

```
┌──────────────────────────────────────────────────┐
│  [■] Suno                          [Right item]  │
└──────────────────────────────────────────────────┘
```

- **Logo mark:** 28 × 28px rounded square, `--color-sun` background, sun SVG inside.
- **Logo name:** "Suno", 15px, weight 500, `--color-text`, 7px gap from mark.
- **Right element:** varies by screen (see table below).

#### Specs

| Property | Value |
|---|---|
| Height | 52px |
| Padding | 16px horizontal |
| Background | `--color-white` |
| Bottom border | `0.5px solid --color-gray-2` |
| Logo mark size | 28 × 28px |
| Logo mark background | `--color-sun` (#FFCF57) |
| Logo mark border-radius | 8px |
| Logo SVG size | 16 × 16px |
| Logo SVG stroke color | `--color-sun-text` (#7A4F00) |
| Gap (mark to name) | 7px |

#### Right Element Per Screen

| Screen | Right element | Style |
|---|---|---|
| Welcome | Language toggle (EN / FR) | See Section 6.5 |
| Route Entry | "Step 1 / 3" | 10–11px, weight 500, `--color-nav` |
| Sun Position | "Edit" link | 11px, weight 500, `--color-nav` |
| Directions | "Edit" link | 11px, weight 500, `--color-nav` |

#### Accessibility

- Logo mark + name: `<a href="/">` with `aria-label="Suno — go to home"`.
- "Edit" link: `aria-label="Edit journey"`.
- Step indicator: `<span aria-label="Step 1 of 3">` — not a link.

---

### 6.2 Buttons

#### Primary Button

The main action button on each screen (e.g., "Start", "Continue →").

| Property | State | Value |
|---|---|---|
| Background | Default | `--color-nav` (#007EA7) |
| Background | Hover | `--color-nav-dark` (#005F80) |
| Background | Active / pressed | `--color-nav-dark` + `transform: scale(0.98)` |
| Background | Disabled | `--color-gray-2` |
| Text color | Default | `--color-white` |
| Text color | Disabled | `--color-gray-3` |
| Font | All | 13–14px, weight 500 |
| Padding | All | 10px vertical, 14px horizontal |
| Border radius | All | 9–10px |
| Border | Default | none |
| Focus ring | Focused | `box-shadow: 0 0 0 2px --color-nav`, `outline-offset: 2px` |
| Cursor | Disabled | `not-allowed` |
| Width | Default | 100% of container |

#### Secondary Button (Sun-themed)

Used only for non-primary actions that relate to solar data output. Currently: "View directions →" on the Sun Position screen.

| Property | Value |
|---|---|
| Background | `--color-sun-bg` (#FFF8E1) |
| Border | `0.5px solid --color-sun-border` (#FFE08A) |
| Text color | `--color-sun-text` (#7A4F00) |
| Hover background | `--color-sun-border` (#FFE08A) |
| Font | 13px, weight 500 |
| All other properties | Same as primary button |

#### Do / Don't

✅ One primary button per screen maximum.
✅ Use the secondary button only when the action directly relates to solar data.
❌ Never use `--color-sun` (#FFCF57) as a button background.
❌ Never place two primary buttons on the same screen.

---

### 6.3 Input Fields

Input fields in Suno are **`<button>` elements styled to look like inputs**, not native `<input>` elements. Tapping the field opens the autocomplete search interaction (overlay on mobile, dropdown on desktop). See Section 6.7 for rationale.

#### Anatomy

```
DEPARTURE                    ← field label (10px, uppercase, gray-3)
┌──────────────────────────────────────────┐
│  ●  London, England                   ⌄  │
└──────────────────────────────────────────┘
```

- **Field label:** 10px, uppercase, weight 500, `--color-gray-3`, `margin-bottom: 4px`.
- **Leading dot:** 10 × 10px filled circle. Color depends on field and state.
- **Value text:** city name or placeholder.
- **Trailing chevron:** 12 × 12px, color matches current field state.

#### States

| State | Background | Border | Border width | Text color |
|---|---|---|---|---|
| Empty / default | `--color-gray-1` | `--color-gray-2` | 0.5px | `--color-gray-3` (placeholder) |
| Focused (search open) | `--color-nav-bg` | `--color-nav` | 1.5px | `--color-nav-text` |
| Confirmed (city selected) | `--color-sun-bg` | `--color-sun-border` | 0.5px | `--color-sun-text` |
| Error | `--color-error-bg` | `--color-error-border` | 1.5px | `--color-text` |
| Disabled | `--color-gray-1` | none | — | `--color-gray-3` |

#### Specs

| Property | Value |
|---|---|
| Height | 36px desktop / 38px mobile |
| Padding | 9px vertical, 11px horizontal |
| Border radius | 8px |
| Font size | 12–13px, weight 400 |
| Leading dot size | 10 × 10px |
| Leading dot — departure | Fill `--color-nav` |
| Leading dot — destination (empty) | Fill `--color-gray-3` |
| Leading dot — destination (confirmed) | Fill `--color-sun-dark` |
| Trailing chevron size | 12 × 12px |
| Trailing chevron color | Matches field text color for current state |
| Cursor | `pointer` |

#### Accessibility

```html
<button
  role="button"
  aria-haspopup="listbox"
  aria-expanded="false"
  aria-label="Select departure city"
  tabindex="0"
>
  <!-- field content -->
</button>
```

When a city is confirmed, update `aria-label` to: `"Departure: London, England. Tap to change."`.
When the overlay/dropdown opens: set `aria-expanded="true"`.

---

### 6.4 Time Chips

Three compact selector elements on the Route Entry screen for choosing departure mode, date, and time.

#### Anatomy

```
[ ▶ Depart at… ]   [ ▤ 20/04/2026 ]   [ ◷ 10:00 ]
```

#### Specs

| Property | Value |
|---|---|
| Height | 36px |
| Padding | 7px vertical, 8–9px horizontal |
| Background | `--color-gray-1` |
| Border | `0.5px solid --color-gray-2` |
| Border radius | 7–8px |
| Font size | 11px, weight 400 |
| Text color | `--color-text` |
| Icon color | `--color-nav` |
| Icon size | 10–12px |
| Gap (icon to text) | 5px |
| Layout | `flex: 1` each — three chips share equal width in a row |
| Hover border | `--color-nav-border` |
| Focus ring | `box-shadow: 0 0 0 2px --color-nav` |

---

### 6.5 Tag Pills

Horizontal pill chips. Used on the Welcome screen for feature tags and in the language toggle.

#### States

| State | Background | Border | Text color | Font |
|---|---|---|---|---|
| Active | `--color-sun-bg` | `--color-sun-border` | `--color-sun-text` | 10px, weight 500 |
| Inactive | `--color-white` | `--color-gray-2` | `--color-gray-3` | 10px, weight 400 |

#### Specs

| Property | Value |
|---|---|
| Padding | 3px vertical, 9px horizontal |
| Border radius | 20px (full pill) |
| Gap between pills | 5–6px |

#### Language Toggle Variant

The EN / FR toggle in the app bar is a grouped pill:

```
┌─────────────────────┐
│ [ EN ]  [ FR ]      │
└─────────────────────┘
```

- Container: `border: 0.5px solid --color-gray-2`, `border-radius: 20px`, `overflow: hidden`, `display: flex`.
- Inactive option: `padding: 3px 9px`, `color: --color-gray-3`.
- Active option: `background: --color-nav`, `color: --color-white`, `font-weight: 500`.
- Implementation: `<fieldset>` + `<legend>Language</legend>` + two `<input type="radio">` — not `<div>` or `<button>`.

---

### 6.6 Badges

Small inline labels used to convey status or category at a glance.

#### Variants

| Variant | Background | Border | Text color | Typical use |
|---|---|---|---|---|
| Sun badge | `--color-sun-bg` | `--color-sun-border` | `--color-sun-text` | "Sun behind 85%", "Popular" |
| Nav badge | `--color-nav-bg` | none | `--color-nav-text` | Distance "163 km" |

#### Specs

| Property | Value |
|---|---|
| Font size | 10px, weight 500 |
| Padding | 2–3px vertical, 7–8px horizontal |
| Border radius | 6px (status badge) / 20px (distance pill) |

---

### 6.7 Route Card

The primary input component on the Route Entry screen. Groups departure field, destination field, swap action, and departure time into a single unified card.

#### Anatomy

```
┌──────────────────────────────────────────────────┐
│ YOUR ITINERARY                                    │
│                                                   │
│  ●  ┌───────────────────────────────┐        ⇅   │
│  │  │ DEPARTURE                     │            │
│  │  │ London, England             ⌄ │            │
│  │  └───────────────────────────────┘            │
│  │  ┌───────────────────────────────┐            │
│  ◉  │ DESTINATION                   │            │
│     │ Enter a city…               ⌄ │            │
│     └───────────────────────────────┘            │
│ ─────────────────────────────────────────────── │
│ [▶ Depart at…]  [▤ Date]  [◷ Time]  [Continue→] │
└──────────────────────────────────────────────────┘
```

#### Card Container Specs

| Property | Value |
|---|---|
| Background | `--color-white` |
| Border | `0.5px solid --color-gray-2` |
| Border radius | 14px |
| Padding | 14px all sides, 12px bottom |
| Card title | 11px, uppercase, weight 500, `--color-gray-3`, `margin-bottom: 12px` |

#### Track Column

The vertical track visualizes the journey from departure (top) to destination (bottom).

| Element | Value |
|---|---|
| Departure dot | 9 × 9px circle, fill `--color-nav` |
| Connecting line | 1.5px wide, `--color-gray-2`, height stretches to fill available space |
| Destination dot | 9 × 9px circle, fill `--color-sun-dark` |
| Track padding-top | 10px (aligns dot with field content) |
| Gap (track to fields) | 10px |

#### Swap Button

| Property | Value |
|---|---|
| Shape | 30 × 30px circle |
| Background | `--color-white` |
| Border | `0.5px solid --color-gray-2` |
| Hover background | `--color-nav-bg` |
| Hover border | `--color-nav-border` |
| Icon | Two opposing vertical arrows, 14 × 14px, stroke `--color-gray-3` |
| `aria-label` | `"Swap departure and destination"` |
| Optional animation | Icon rotates 180° over 200ms on click |

#### Card Footer

Separated from the fields by a `0.5px solid --color-gray-2` horizontal divider.

- Three time chips in `display: flex`, `gap: 6px`, each with `flex: 1`.
- Primary button at the right: `flex-shrink: 0`, `padding: 8px 14px`.

#### Behavior

1. User taps departure or destination field button.
2. Mobile (< 768px): Search Overlay opens full-screen.
3. Desktop (≥ 768px): Autocomplete Dropdown opens below the tapped field.
4. City confirmed → field transitions to confirmed state (sun-bg + sun-text).
5. Swap tapped → values swap instantly, no animation on field content.

---

### 6.8 Autocomplete Dropdown (Desktop)

The inline dropdown that opens below the field button on screens ≥ 768px.

#### Anatomy

```
┌──────────────────────────────────────────────┐
│ Results for "Birm"                            │
│ ─────────────────────────────────────────── │
│ [●] Birmingham, England             163 km  │  ← highlighted
│ [·] Birmingham, Jefferson County            │
│ [·] Birmingham, Saskatchewan               │
│ ─────────────────────────────────────────── │
│  ↑ ↓ to navigate · Enter to confirm         │
└──────────────────────────────────────────────┘
```

#### Container Specs

| Property | Value |
|---|---|
| Background | `--color-white` |
| Border | `0.5px solid --color-nav-border` |
| Border radius | 9px |
| Margin top | 4px |
| Max height | 280px (internal scroll) |
| Z-index | Above all other page content |

#### Result Item Specs

| Property | State | Value |
|---|---|---|
| Background | Default | `--color-white` |
| Background | Highlighted / keyboard focus | `--color-nav-bg` |
| Background | Hover | `--color-nav-bg` |
| Padding | All | 9px 12px |
| Min height | All | 44px |
| Border bottom | All except last | `0.5px solid --color-gray-2` |
| Icon container | Default | 28 × 28px, `--color-gray-1` bg, border-radius 7px |
| Icon container | Highlighted | `--color-nav-bg` bg |
| Icon stroke | Default | `--color-gray-3` |
| Icon stroke | Highlighted | `--color-nav` |
| City name | All | 12px, weight 500, `--color-text` |
| Country | All | 10px, `--color-gray-3` |
| Distance badge | First result only | Nav badge variant |

#### Keyword Highlighting

Matched characters are wrapped in `<mark>`:

```html
<!-- Query: "Birm" — Result: "Birmingham, England" -->
<mark>Birm</mark>ingham, England
```

```css
mark {
  background-color: var(--color-sun);    /* #FFCF57 */
  color: var(--color-sun-text);          /* #7A4F00 */
  border-radius: 3px;
  padding: 0 2px;
  font-weight: 500;
}
```

> ⚠️ Never inject unsanitized user input into the DOM via `innerHTML`. Sanitize the query string before using it in a regex or DOM operation.

#### Footer Row

| Property | Value |
|---|---|
| Text | "↑ ↓ to navigate · Enter to confirm · Escape to close" |
| Background | `--color-gray-1` |
| Font | 10px, `--color-gray-3` |
| Padding | 7px 12px |

#### Accessibility

```html
<ul role="listbox" aria-label="City suggestions">
  <li role="option" aria-selected="true">Birmingham, England</li>
  <li role="option" aria-selected="false">Birmingham, Jefferson County</li>
</ul>
```

Keyboard behavior:

| Key | Action |
|---|---|
| `Arrow Down` | Move highlight to next result |
| `Arrow Up` | Move highlight to previous result |
| `Enter` | Confirm highlighted result |
| `Escape` | Close dropdown, return focus to field button |
| `Tab` | Close dropdown, move focus to next element |

---

### 6.9 Search Overlay (Mobile)

The full-screen search view that opens when the user taps a field button on screens < 768px.

#### Anatomy

```
┌──────────────────────────────────┐
│ [←]  [ 🔍 Birm              ✕ ] │
│       Entering destination       │
├──────────────────────────────────┤
│ Recent                           │
│ [◷] Manchester, England      ›  │
│ [◷] Edinburgh, Scotland      ›  │
├──────────────────────────────────┤
│ Results for "Birm"               │
│ [●] Birmingham, England  163km ›│  ← first result highlighted
│ [·] Birmingham, Jefferson Co.  ›│
│ [·] Birmingham, Saskatchewan   ›│
└──────────────────────────────────┘
```

#### Header Bar

| Property | Value |
|---|---|
| Background | `--color-white` |
| Bottom border | `0.5px solid --color-gray-2` |
| Padding | 12px 12px 8px |

**Back button:**

| Property | Value |
|---|---|
| Size | 28 × 28px |
| Background | `--color-gray-1` |
| Border | `0.5px solid --color-gray-2` |
| Border radius | 8px |
| Icon | Chevron-left, 13px, stroke `--color-gray-3` |
| Action | Close overlay, return focus to tapped field button |

**Search pill:**

| Property | Value |
|---|---|
| Height | 36px |
| Background | `--color-nav-bg` |
| Border | `1.5px solid --color-nav` |
| Border radius | 9px |
| Layout | `flex: 1`, left of clear button |
| Search icon | 13 × 13px, stroke `--color-nav`, left padding 10px |
| Typed text | 13px, `--color-nav-text` |
| Text cursor | 1.5px × 14px block element, `--color-nav`, `animation: blink 1s step-end infinite` |
| Clear button | Circle with × inside, 14 × 14px, `--color-nav`, right padding 10px |

**Which-field label:**

| Property | Value |
|---|---|
| Content | "Entering departure" or "Entering destination" |
| Font | 10px, uppercase, weight 500, `--color-nav` |
| Position | Below search pill, `padding: 7px 12px 0` |
| Updates on selection | Changes to "Departure selected" or "Destination selected" |

#### Recents Section

Shown only when the search query is empty. Hidden as soon as the user types.

| Property | Value |
|---|---|
| Section header | "Recent", 10px, uppercase, `--color-gray-3`, `padding: 8px 12px 4px` |
| Row min-height | 44px |
| Row padding | 8px 12px |
| Icon container | 28 × 28px, `--color-gray-1`, border-radius 7px |
| Icon | Clock SVG, stroke `--color-gray-3` |
| City name | 12px, weight 400, `--color-text` |
| Country | 10px, `--color-gray-3` |
| Trailing arrow | 11px chevron-right, `--color-gray-3` |
| Hover | Background `--color-gray-1` |
| Empty recents | Single row: "No recent searches yet", 12px, `--color-gray-3` |

#### Results Section

Shown as soon as query length ≥ 1. Hidden when query is empty.

| Property | State | Value |
|---|---|---|
| Section header | Always | "Results for '[query]'" |
| First result background | Default | `--color-nav-bg` |
| Other results background | Default | `--color-white` |
| Row min-height | All | 44px |
| Row padding | All | 9px 12px |
| Row border | All except last | `0.5px solid --color-gray-2` |
| First result icon container | Default | `--color-nav-bg`, stroke `--color-nav` |
| Other result icon containers | Default | `--color-gray-1`, stroke `--color-gray-3` |
| Trailing arrow | First | `--color-nav` |
| Trailing arrow | Others | `--color-gray-3` |
| Distance badge | First only | Nav badge variant, right-aligned |
| No results state | — | See Section 8.4 |

#### Post-Selection State

After the user taps a result, these changes happen simultaneously:

1. Results section collapses to a single confirmation row:
   - Checkmark icon in `--color-nav-bg` container.
   - City name: `--color-nav-text`, weight 500.
   - Sub-label: "Selected — type to change", `--color-gray-3`.
2. Which-field label changes to "Departure selected" or "Destination selected".
3. Route card field (visible behind overlay) transitions to confirmed state.
4. Overlay auto-closes after **400ms** on mobile. If the user taps Back during this window, cancel the timer and keep the overlay open with the selection shown.
5. Desktop dropdown closes immediately.

---

### 6.10 Polar Chart

An SVG-based circular chart showing the proportion of journey time spent with the sun in each relative direction.

#### What the chart shows

The chart is centered on a car icon. Sectors extend outward from the center in four relative directions (front, rear, left, right). The larger the sector, the more time the sun spends in that relative position during the journey.

#### Specs

| Property | Value |
|---|---|
| Rendered size | 110 × 110px |
| Center point | 50% of canvas width and height |
| Concentric circles | 3 circles, radii 20px / 35px / 50px |
| Concentric circle style | color `--color-gray-2`, line width 0.5px, no fill |
| Axis lines | 2 dashed lines (horizontal + vertical through center) |
| Axis line style | color `--color-gray-2`, line width 0.5px, dash pattern 3px on / 3px off |

#### Data Sectors

| Property | Value |
|---|---|
| Fill color | `--color-sun` (#FFCF57) for all sectors |
| Dominant sector opacity | 0.9 |
| Secondary sector opacity | 0.5 |
| Tertiary sector opacity | 0.3 |
| Render order | Draw tertiary first, dominant last (so dominant appears on top) |
| Shape | Pie/polar sector from center point to arc, closed back to center |

#### Car Silhouette

| Property | Value |
|---|---|
| Body | Rectangle ~24 × 34px, centered on canvas, fill `--color-gray-3`, fill-opacity 0.12 |
| Roof | Rectangle ~16 × 8px, centered above body, fill `--color-gray-3`, fill-opacity 0.10 |
| Border radius | 2px on both rectangles |

#### Implementation Rules

- Implemented using **Chart.js** rendered to `<canvas>`.
- Render concentric circles and axis lines before data sectors.
- Compute sector angles from actual sun-exposure data (not hardcoded).
- Apply sector opacity values as specified (dominant: 0.9, secondary: 0.5, tertiary: 0.3).
- Wrap the `<canvas>` in a container with `role="img"` and `aria-label` describing the data in plain text.

---

### 6.11 Summary Cards Grid

A 2 × 2 grid of cards below the polar chart summarizing cumulative sun exposure per direction.

#### Grid Specs

| Property | Value |
|---|---|
| Layout | CSS Grid, `grid-template-columns: 1fr 1fr`, `gap: 6px` |
| Position order | Top-left: Rear / Top-right: Right / Bottom-left: Left / Bottom-right: Front |

#### Card Specs

| Property | Default card | Highlighted card (dominant direction) |
|---|---|---|
| Background | `--color-gray-1` | `--color-sun-bg` |
| Border | `0.5px solid --color-gray-2` | `0.5px solid --color-sun-border` |
| Border radius | 8px | 8px |
| Padding | 8px 10px | 8px 10px |

The card with the longest duration is highlighted regardless of its grid position.

#### Direction Icon Circle

| Direction | Background | Icon color |
|---|---|---|
| Rear (sun behind vehicle) | `--color-sun` | `--color-sun-text` |
| Right | `--color-nav-bg` | `--color-nav-text` |
| Left | `--color-nav-bg` | `--color-nav-text` |
| Front (sun ahead of vehicle) | `--color-gray-1` + `0.5px solid --color-gray-2` border | `--color-gray-3` |

Icon circle: 24 × 24px, `border-radius: 50%`. Contains a directional arrow character centered with flex.

#### Text

| Property | Value |
|---|---|
| Direction label | 11px, weight 500, `--color-text` |
| Duration value | 10px, weight 400, `--color-gray-3` |
| Gap (icon to text) | 8px |

---

### 6.12 Step List

A vertical list of route steps on the Directions screen. Each step has a tracker dot indicating sun exposure at that segment.

#### Anatomy

```
  ● — Charing Cross → Trafalgar Square         <1min
  │
  ● — Trafalgar → Cockspur Street              1min
  │
  ○ — Piccadilly → A4                          2min
  │
  ● — M40 → M42/E05                            1h 4min
```

`●` (yellow) = significant sun exposure. `○` (hollow) = no notable sun exposure.

#### Step Row Specs

| Property | Value |
|---|---|
| Padding | 6px top and bottom |
| Border bottom | `0.5px solid --color-gray-2` |
| Last row | No border bottom |
| Minimum height | 44px (mobile touch target) |

#### Tracker Dots

| Property | Sun-exposure dot | Neutral dot |
|---|---|---|
| Size | 6 × 6px | 6 × 6px |
| Background | `--color-sun` | `--color-white` |
| Border | `1.5px solid --color-sun-dark` | `1.5px solid --color-gray-2` |
| Border radius | 50% | 50% |

#### Tracker Lines

| Property | Value |
|---|---|
| Width | 1px |
| Height | 14px |
| Background | `--color-gray-2` |
| Position | Centered below each dot except the last |

#### Text and Time

| Property | Value |
|---|---|
| Step text | 11px, weight 400, `--color-text`, `flex: 1` |
| Time | 10px, weight 400, `--color-gray-3`, `flex-shrink: 0`, right-aligned |
| Gap (tracker column to text) | 8px |

#### HTML Structure

```html
<ul role="list">
  <li role="listitem" class="step-row">
    <div class="tracker" aria-hidden="true">
      <div class="dot dot--sun"></div>
      <div class="track-line"></div>
    </div>
    <span class="step-text">Charing Cross → Trafalgar Square</span>
    <span class="step-time">&lt;1min</span>
  </li>
</ul>
```

---

## 7. Screens

Each screen section documents its purpose, layout, component references, and screen-specific behavior.

> **How to add a new screen:** Copy the template below, fill in each section, and open a pull request. Screens are numbered sequentially. Do not renumber existing screens.

```markdown
### 7.X Screen Name

**Purpose:** One sentence.

**Layout (top to bottom):**
1. App bar — [describe right element].
2. [Next element]
3. [...]

**Component references:**
- [Component name] — [where and how used]

**Screen-specific behavior:**
- [Behavior 1]
- [Behavior 2]

**Screen-specific accessibility:**
- [Any ARIA or keyboard notes not covered in Section 10]
```

---

### 7.1 Welcome

**Purpose:** First screen. Communicates the app value proposition and lets the user pick a language before starting.

**Layout (top to bottom):**

1. App bar — logo left, language toggle right.
2. Screen title — "Anticipate the sun on your journey", 20–22px, weight 500, `letter-spacing: -0.03em`.
3. Subtitle — 2-line description, 12–13px, `--color-gray-3`, `line-height: 1.6`.
4. Tag pill row — 3 pills. First pill active (sun-bg), others neutral.
   - Pill 1 (active): "Live position"
   - Pill 2 (inactive): "Planning"
   - Pill 3 (inactive): "Comfort"
5. Sun illustration — centered inline SVG, ~110 × 77px.
6. Primary button — full-width, label "Start" (EN) / "Commencer" (FR).

**Component references:**
- App Bar (Section 6.1) — with language toggle right element.
- Tag Pills (Section 6.5) — 3 pills, first active.
- Primary Button (Section 6.2) — full-width, bottom of screen.

**Screen-specific behavior:**
- Language selection (EN / FR) immediately updates all visible text client-side, without a page reload.
- Selected language persists across all subsequent screens (store in app state or `localStorage`).
- No navigation push when switching language.

**Screen-specific accessibility:**
- `<main>` begins immediately after the app bar.
- Language toggle implemented as `<fieldset>` + `<legend>Language</legend>` + two `<input type="radio">`.

---

### 7.2 Route Entry

**Purpose:** Collects the user's journey details (departure city, destination city, departure time).

**Layout (top to bottom):**

1. App bar — logo left, step indicator "Step 1 / 3" right.
2. Screen title — "Your itinerary", 16–17px, weight 500.
3. Route Card (Section 6.7) — full width. Contains departure field, destination field, swap button, time chips, and continue button.

**Component references:**
- App Bar (Section 6.1) — with step indicator.
- Route Card (Section 6.7) — main interactive element.
- Autocomplete Dropdown (Section 6.8) — opens on desktop when a field is tapped.
- Search Overlay (Section 6.9) — opens on mobile when a field is tapped.

**Screen-specific behavior:**
- After city is confirmed, field transitions to confirmed state (sun-bg, sun-text).
- Tapping "Continue →" with one or both fields empty shows validation error (see Section 8.3).
- Tapping "Continue →" with both fields filled navigates to the Sun Position screen and begins sun-exposure computation.

**Step indicator wording:** "Step 1 / 3" — use this exact format (not "1 of 3", not "1/3").

---

### 7.3 Sun Position

**Purpose:** Displays the cumulative sun exposure analysis as a polar chart and summary grid.

**Layout (top to bottom):**

1. App bar — logo left, "Edit" link right.
2. Screen title — "Cumulative durations", 16–17px, weight 500.
3. Journey info banner — sun-bg surface, 1-line: "London → Birmingham · 20/04 · 10:00", 11px, `--color-sun-text`, `--color-sun-border` border, `--color-sun-bg` background, border-radius 8px, padding 8px 10px.
4. Polar Chart (Section 6.10) — centered.
5. Summary Cards Grid (Section 6.11) — 2 × 2.
6. Secondary button (Section 6.2) — "View directions →", full-width, sun-themed style.

**Component references:**
- App Bar (Section 6.1) — with "Edit" link.
- Polar Chart (Section 6.10).
- Summary Cards Grid (Section 6.11).
- Secondary Button (Section 6.2).

**Screen-specific behavior:**
- "Edit" navigates back to Route Entry with all fields pre-filled.
- While computing: replace polar chart with spinner (see Section 8.1). Summary cards are hidden until computation completes.
- Summary card grid order is fixed: Rear (top-left), Right (top-right), Left (bottom-left), Front (bottom-right). The card with the longest duration is highlighted regardless of position.

---

### 7.4 Directions

**Purpose:** Lists all route segments with their duration and sun exposure per segment.

**Layout (top to bottom):**

1. App bar — logo left, "Edit" link right.
2. Screen title — "Directions", 16–17px, weight 500.
3. Route meta bar — Gray 1 background, origin → destination + date/time on the left; sun summary badge on the right.
4. Step List (Section 6.12) — all route steps.
5. Pagination dots (optional) — 4 dots, active dot: `--color-nav`, width 14px; inactive dots: `--color-gray-2`, 5 × 5px.

**Component references:**
- App Bar (Section 6.1) — with "Edit" link.
- Badges (Section 6.6) — sun badge in meta bar.
- Step List (Section 6.12).

**Screen-specific behavior:**
- "Edit" navigates back to Route Entry with pre-filled fields.
- Desktop: show all steps, no internal scroll.
- Mobile: step list has `max-height: 320px`, `overflow-y: auto`.

**Sun summary badge wording:**
- Format: "Sun [direction] [percentage]%"
- Direction labels: "ahead" / "behind" / "on the right" / "on the left"
- Percentage: rounded to nearest integer
- Example: "Sun behind 85%"

---

## 8. States & Interactions

### 8.1 Loading States

**Search results loading** (in dropdown or overlay):
- Replace result rows with 3 skeleton rows.
- Skeleton: `height: 44px`, `background: --color-gray-1`, `border-radius: 8px`, full width.
- Animation: `opacity` pulses from `0.4` to `1.0`, `1.2s ease-in-out infinite`.
- Do not use a spinner in the search area.

**Sun-exposure computation loading** (Sun Position screen):
- Replace polar chart area with a centered CSS spinner.
- Spinner: 24px diameter, `border: 2px solid --color-gray-2`, `border-top-color: --color-nav`, `border-radius: 50%`, `animation: spin 0.8s linear infinite`.
- Hide summary cards until computation completes.
- Never block the full screen with a modal overlay or spinner.

### 8.2 Empty / First-Use State

When the user first opens the app:

- Departure and destination fields: placeholder "Enter a city…", `--color-gray-3`.
- Recents section in overlay: if history is empty, show "No recent searches yet", 12px, `--color-gray-3`.

### 8.3 Validation Error State

Triggered when the user taps "Continue →" with one or both fields empty.

```
[Route Card]

Please fill in both a departure and a destination before continuing.
```

| Property | Value |
|---|---|
| Position | Directly below the route card, `margin-top: 8px` |
| Font | 12px, `--color-error` (#C0392B) |
| Background | None — inline text only, no box |
| Icon | None |
| Appear animation | `opacity: 0 → 1`, `150ms ease` |
| Dismiss | Disappears automatically when both fields are confirmed |

### 8.4 City Not Found State

When geocoding returns zero results:

```
No results for "[query]"
Try a different spelling or a nearby city.
```

| Property | Value |
|---|---|
| Main text | 12px, `--color-gray-3` |
| Hint text | 11px, `--color-gray-3`, `font-style: italic` |
| Padding | 14px 12px |
| Color | Neutral gray only — not red, not a warning state |

### 8.5 Swap with Partially Empty Fields

| Scenario | Behavior |
|---|---|
| Departure filled, destination empty | Departure value moves to destination. Departure becomes empty. |
| Destination filled, departure empty | Destination value moves to departure. Destination becomes empty. |
| Both fields filled | Values swap. |
| Both fields empty | Nothing happens. No error shown. |

Optional: swap button icon rotates 180° over 200ms (`transform`, CSS `ease`) on click.

---

## 9. Responsive Behavior

The behavior breakpoint is **768px**. Below this value, the mobile experience applies. At or above, the desktop experience applies.

| Property | Mobile (< 768px) | Desktop (≥ 768px) |
|---|---|---|
| Search interaction | Full-screen overlay (Section 6.9) | Inline dropdown (Section 6.8) |
| Route card width | 100% of viewport | max-width 480px, centered |
| Field height | 38px | 36px |
| Body font size | 12px | 13–14px |
| App bar padding | 12–14px horizontal | 16px horizontal |
| Step list | max-height 320px, `overflow-y: auto` | No scroll, all steps visible |
| Summary grid | 2 × 2 | 2 × 2 |
| Time chips | Wrap to 2 rows if needed | Single row |
| Primary button | Full-width | Full-width within card |

### Minimum Touch Target (Mobile)

All interactive elements must have a minimum tap area of **44 × 44px**. If the visual element is smaller, extend the tap area using an invisible `::after` pseudo-element:

```css
.swap-btn {
  position: relative;
}
.swap-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
}
```

---

## 10. Accessibility

### 10.1 Required ARIA Attributes

| Component | Required ARIA |
|---|---|
| Field button (departure) | `role="button"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-label="Select departure city"` |
| Field button (destination) | Same, with label `"Select destination city"` |
| Field button (confirmed) | Update `aria-label` to `"Departure: [city name]. Tap to change."` |
| Dropdown list | `role="listbox"`, `aria-label="City suggestions"` |
| Dropdown item | `role="option"`, `aria-selected` |
| Swap button | `aria-label="Swap departure and destination"` |
| Polar chart SVG | `role="img"`, `aria-label="[plain text description of all sector values]"` |
| Step list | `<ul role="list">` wrapping `<li role="listitem">` |
| Language toggle | `<fieldset>` + `<legend>Language</legend>` + `<input type="radio">` |
| Step indicator | `<span aria-label="Step 1 of 3">` (not a link) |

### 10.2 Keyboard Navigation

| Component | Keys | Action |
|---|---|---|
| Field button | `Tab` | Focus field |
| Field button | `Enter` or `Space` | Open dropdown / overlay |
| Dropdown | `Arrow Down` / `Arrow Up` | Move highlighted result |
| Dropdown | `Enter` | Confirm highlighted result |
| Dropdown | `Escape` | Close, return focus to field button |
| Dropdown | `Tab` | Close, move focus to next element |
| Swap button | `Tab` | Focus button |
| Swap button | `Enter` or `Space` | Swap fields |
| Primary button | `Tab` | Focus button |
| Primary button | `Enter` or `Space` | Activate |
| Back button (overlay) | `Tab` | Focus button |
| Back button (overlay) | `Enter` or `Space` | Close overlay |

### 10.3 Focus Management

- When the search overlay opens: move focus to the search pill input.
- When the overlay closes (back button or city selection): return focus to the field button that triggered it.
- When the desktop dropdown opens: keep focus on the field button while the dropdown listens to keyboard events.

### 10.4 Screen Reader Announcements

Use a visually-hidden live region for dynamic confirmations:

```html
<div
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
  id="suno-live-region"
></div>
```

Inject text into this element after a city is confirmed:

```
"Departure set to London, England."
"Destination set to Birmingham, England."
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 10.5 Pre-Calculated Contrast Reference

See Section 2.2 for the full contrast ratio table. Quick reference for the most common combinations:

- Black text on white: **17.7:1** ✅
- Nav Blue on white: **4.6:1** ✅
- White on Nav Blue: **4.6:1** ✅
- Sun Text on Sun BG: **6.2:1** ✅
- Gray 3 on white: **2.8:1** ❌ — secondary/decorative text only.

---

## 11. Adding New Screens or Components

### New Screen Checklist

- [ ] Assign the next sequential number (e.g., 7.5).
- [ ] Add an entry to the Table of Contents.
- [ ] Use the screen template from Section 7 (Purpose / Layout / Component references / Behavior / Accessibility).
- [ ] Verify all components are documented in Section 6. If a new component is needed, add it to Section 6 first.
- [ ] Specify the app bar right element.
- [ ] Define the step indicator label (e.g., "Step 3 / 3"), or note if not applicable.
- [ ] Document any new state or interaction not already covered in Section 8.
- [ ] Confirm responsive behavior (Section 9) or add a new row if behavior differs.
- [ ] Add new ARIA attributes to Section 10.1 if needed.
- [ ] Update Section 12 (Changelog).

### New Component Checklist

- [ ] Assign the next sequential number (e.g., 6.13).
- [ ] Add an entry to the Table of Contents.
- [ ] Follow the component template: What it is / Anatomy / Specs / States / Behavior / Accessibility / Do-Don't.
- [ ] Ensure all colors used are existing tokens from Section 2. If a new color is needed, update Section 2 first and open a design ticket.
- [ ] Ensure all spacing values are multiples of 4px or 8px (Section 4.1).
- [ ] Update Section 12 (Changelog).

### Naming Conventions

| Type | Format | Example |
|---|---|---|
| CSS custom property | `--color-[role]-[variant]` | `--color-sun-bg` |
| CSS class | `suno-[component]__[element]--[modifier]` (BEM) | `suno-field-btn--confirmed` |
| ARIA label | Sentence case, descriptive | `"Swap departure and destination"` |
| Screen title text | Sentence case | `"Your itinerary"` |
| File names | `kebab-case` | `route-card.tsx`, `polar-chart.svg` |

---

## 12. Changelog

> Add new entries at the **top** of this table. Include the version number, date, affected sections, a brief description of the change, and the author's name or initials.

| Version | Date | Section(s) | Change | Author |
|---|---|---|---|---|
| 1.0 | April 2026 | All | Initial release — 4 screens, 12 components, full token set, accessibility and responsive documentation | Design Lead |

---

*Suno Design System — v1.0*
*Maintained by the Suno Design & Engineering team.*
*To propose changes: open a pull request against this file. All changes require sign-off from both the design lead and the frontend lead before merging.*
