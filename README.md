# Management Software

A React + TypeScript admin dashboard for managing an ecommerce store — orders, sales analytics, customers, and (soon) products.

Built as a portfolio project to practice frontend architecture, state management, and data visualization with a modern React stack.

**Live demo:** [management-software-three.vercel.app](https://management-software-three.vercel.app)

## Features

**Dashboard**
- KPI cards (revenue, orders, average order value, conversion rate) computed live from order data over a rolling 30-day window, with sparkline trends
- Sales performance bar chart (rolling 12 months) and category breakdown donut chart
- Recent orders widget

**Orders**
- Full order list with status badges and formatted currency
- Filter by status, search by customer/email, and filter by date range
- Order detail side panel with line items and totals

**Customers**
- Customer list aggregated from order history (orders count, total spent, last order)
- Search and sort, with a "Returning" vs "New" segment badge
- Order history detail panel per customer

**Responsive layout**
- Sidebar navigation on desktop, bottom tab bar on mobile

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query) for data fetching and caching
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org) for charts

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

Data is served from local mock JSON — dashboard metrics and customer summaries are derived from it at runtime rather than pre-computed, so they stay consistent with the current date and with each other.

## Backend

The dashboard is being connected to the same Supabase project as the companion [Terre d'Oliva storefront](https://github.com/federicomariacalato/terre-doliva-ecommerce), so both apps share one database: orders placed in the store show up here. The database schema lives in the storefront repository, as the single source of truth (see [`supabase/README.md`](supabase/README.md)).

## Roadmap

- [ ] Products page
- [ ] Connect to a real backend, shared with a companion ecommerce storefront project

## Project structure

```
src/
├── components/
│   ├── dashboard/   # Dashboard-specific widgets
│   ├── orders/       # Orders domain components (table, filters, row detail)
│   ├── layout/        # Sidebar, mobile navbar, header
│   └── ui/              # shadcn/ui primitives
├── pages/            # Route-level pages
├── services/         # Data-fetching layer (mock services for now)
├── types/             # Shared TypeScript types
└── utils/             # Formatting, status helpers and derived-data builders
```
