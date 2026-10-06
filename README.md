# NovaAdmin — Premium Admin Dashboard Template

NovaAdmin is a premium, production-inspired admin dashboard template built with HTML, CSS, and vanilla JavaScript. It is designed to be opened directly from the filesystem without a backend, a build step, or package install.

## Product overview

This template is intended for SaaS products, startups, agencies, service businesses, and operational dashboards. It includes multiple business-ready screens, realistic data, reusable UI components, and persistence using localStorage so the frontend works like a real application without a server.

## Features

- Dark and light themes
- Responsive desktop, tablet, and mobile layouts
- Sidebar with collapsible behavior and mobile drawer
- Dashboard metrics and analytics charts
- Users, products, orders, customers, analytics, reports, notifications, settings, and profile screens
- Login flow with demo authentication
- CRUD interactions using localStorage
- Toasts, modals, validation, filters, sorting, and pagination
- CSV export for report screens
- Commercial-quality styling and reusable UI patterns

## Folder structure

```text
admin-dashboard/
├── index.html
├── login.html
├── 404.html
├── README.md
├── CUSTOMIZATION.md
├── LICENSE.txt
├── CHANGELOG.md
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   ├── storage.js
│   ├── utils.js
│   ├── charts.js
│   ├── auth.js
│   └── app.js
├── assets/
│   └── logo.svg
├── docs/
│   └── notes.md
├── screenshots/
│   └── .gitkeep
└── .
```

## Installation

1. Download or extract the template folder.
2. Open the folder in your file explorer.
3. Double-click `index.html` to open the dashboard or `login.html` to access the auth screen.

No server, framework, or npm installation is required.

## Demo credentials

- Email: `admin@example.com`
- Password: `admin123`

These credentials are for the frontend demo only.

## How to run

The template is intended to run directly in a browser without a local server. You may also serve the folder with any static host if preferred.

Example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
```

## How to customize colors

Open `css/styles.css` and modify the CSS custom properties at the top of the file:

```css
:root {
  --color-primary: #6d5efc;
  --color-bg: #0e1320;
  --color-surface: #171d2d;
  --color-text: #edf2ff;
}
```

For light mode, the same variables are reused under the `.theme-light` selector.

## How to customize the logo

Replace the SVG in `assets/logo.svg` with your own brand mark or update the logo text in `index.html`.

## How to add pages

The app is organized around a hash-based router in `js/app.js`. To add a new page:

1. Add a new route key in the `routes` object.
2. Define a render function that fills the main content.
3. Place a matching sidebar link in `index.html`.

## How to modify mock data

All default mock data is stored in `js/data.js` and seeded into localStorage when the app first loads.

You can update values such as:

- Users
- Products
- Orders
- Customers
- Notifications
- Reports
- Dashboard metrics

## How localStorage works

The app persists:

- Login state
- Theme preference
- Users
- Products
- Orders
- Notifications
- Settings

The helper functions in `js/storage.js` manage all storage access and data initialization.

## How to deploy

This template is static by design. You can deploy it to:

- GitHub Pages
- Netlify
- Vercel static hosting
- Any standard static web host

No server-side dependencies are required.

## Browser support

The template is optimized for:

- Chrome
- Edge
- Firefox
- Safari

## License

This project is released under the MIT license. See `LICENSE.txt` for details.
