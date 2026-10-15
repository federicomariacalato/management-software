# Management Software

A React + TypeScript admin dashboard for managing an ecommerce store — orders, sales analytics, customers and products, backed by Supabase.

Built as a portfolio project to practice frontend architecture, state management, and data visualization with a modern React stack.

**Live demo:** [management-software-three.vercel.app](https://management-software-three.vercel.app)

## Features

**Authentication**
- Admin-only login with Supabase Auth: the admin role lives in `app_metadata`, and Row Level Security policies restrict what the dashboard can read and write

**Dashboard**
- KPI cards (revenue, orders, average order value) computed live from order data over a rolling 30-day window, with sparkline trends
- Sales performance bar chart (rolling 12 months) and category breakdown donut chart
- Recent orders widget

**Orders**
- Full order list with status badges and formatted currency
- Filter by status, search by customer/email, and filter by date range
- Order detail side panel with line items and totals
- Order status updates with TanStack Query mutations, cache invalidation and saving/offline/error feedback

**Customers**
- Customer list aggregated from order history (orders count, total spent, last order)
- Search and sort, with a "Returning" vs "New" segment badge
- Order history detail panel per customer

**Products**
- Product catalog with image thumbnails and an availability toggle
- Create products with image upload to Supabase Storage
- Delete products with a confirmation dialog (the Storage image is removed too)

**Responsive layout**
- Sidebar navigation on desktop, bottom tab bar on mobile

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query) for data fetching and caching
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org) for charts
- [Supabase](https://supabase.com) (Postgres, Auth, Storage, Row Level Security)
- [Vitest](https://vitest.dev) for unit tests

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL and publishable key
npm run dev
```

The app runs at `http://localhost:5173`.

Dashboard metrics and customer summaries are derived from the orders at runtime rather than pre-computed, so they stay consistent with the current date and with each other.

## Testing

The functions that turn orders into dashboard data are pure and live in `src/utils`, separate from data fetching, so they can be unit-tested without mocking Supabase.

```bash
npm run test       # watch mode
npm run test:run   # single run
```

Tests sit next to the code they cover (`*.test.ts`), and `src/test/factories.ts` builds test orders with sensible defaults so each test only sets the fields it cares about.

## Backend

The dashboard uses the same Supabase project as the companion [Terre d'Oliva storefront](https://github.com/federicomariacalato/terre-doliva-ecommerce), so both apps share one database: orders placed in the store show up here. The database schema lives in the storefront repository, as the single source of truth (see [`supabase/README.md`](supabase/README.md)).

## Roadmap

- [x] Connect to a real backend, shared with a companion ecommerce storefront project
- [x] Products page
- [x] Unit tests for the dashboard data builders
- [ ] Code cleanup and 404 page

## Project structure

```
src/
├── components/
│   ├── dashboard/   # Dashboard-specific widgets
│   ├── orders/      # Orders domain components (table, filters, row detail)
│   ├── products/    # Products table and new product sheet
│   ├── shared/      # Components shared across domains
│   ├── layout/      # Sidebar, mobile navbar, header
│   └── ui/          # shadcn/ui primitives
├── hooks/           # Custom hooks (auth)
├── lib/             # Supabase client and helpers
├── pages/           # Route-level pages
├── services/        # Data-fetching layer (Supabase queries)
├── test/            # Test helpers (data factories)
├── types/           # Shared TypeScript types
└── utils/           # Formatting, status helpers and derived-data builders (unit-tested)
```
