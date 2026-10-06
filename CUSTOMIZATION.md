# NovaAdmin Customization Guide

This guide helps buyers adapt the template to their brand, product style, and business logic.

## Brand name

Update the visible brand text in:

- `index.html`
- `login.html`
- `404.html`

Replace the word `NovaAdmin` with your own business or product name.

## Logo

The default brand mark lives in `assets/logo.svg`.

To customize:

- Replace the SVG file entirely
- Or update the text and colors in the existing SVG

## Colors

The full visual system is defined in `css/styles.css` with CSS variables.

Common variables to adjust:

```css
:root {
  --color-primary: #6d5efc;
  --color-primary-strong: #564be6;
  --color-accent: #22c55e;
  --color-surface: #101827;
  --color-surface-alt: #0f172a;
  --color-text: #f8fafc;
  --color-muted: #94a3b8;
  --color-border: rgba(148, 163, 184, 0.18);
}
```

## Fonts

The project uses system fonts by default for a clean SaaS appearance. You can swap to Google Fonts or another local font by editing the `font-family` declarations in `css/styles.css`.

## Sidebar menu

To change the navigation labels or ordering, edit the sidebar markup in `index.html`.

The route names are connected to the hash-based router in `js/app.js`.

## Dashboard metrics

The KPI cards and charts are defined in `js/app.js` inside the dashboard renderer. Update the numbers or labels there to match your product metrics.

## Mock data

All realistic mock data is centralized in `js/data.js`.

You can edit:

- Users
- Products
- Orders
- Customers
- Notifications
- Chart values

## Charts

The chart configuration is managed in `js/charts.js` and the dashboard/analytics renderers in `js/app.js`.

To change a chart theme or update a series:

1. Edit the chart config object.
2. Update the dataset values.
3. Persist via localStorage if needed.

## Theme support

Dark and light modes are handled by CSS variables and theme toggling in `js/app.js`. The active theme is stored in localStorage automatically.

## Additional customization

You can customize:

- Page titles and subtitles
- Metric labels
- Status colors
- Card sizes and spacing
- Table labels and actions

The template is intentionally structured so that most business branding and product content can be changed without rewriting the whole app.
