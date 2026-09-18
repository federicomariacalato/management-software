# Management Software

A React + TypeScript admin dashboard for managing an ecommerce store — orders, sales analytics, and (soon) customers and products.

Built as a portfolio project to practice frontend architecture, state management, and data visualization with a modern React stack.

## Features

**Dashboard**
- KPI cards with sparkline trends
- Sales performance bar chart and category breakdown donut chart
- Recent orders widget

**Orders**
- Full order list with status badges and formatted currency
- Filter by status, search by customer/email, and filter by date range
- Order detail side panel with line items and totals

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

Data is currently served from local mock JSON — no backend required to run it.

## Roadmap

- [ ] Customers page (aggregated from order data)
- [ ] Products page
- [ ] Connect to a real backend, shared with a companion ecommerce storefront project

## Project structure

```
src/
├── components/
│   ├── dashboard/   # Dashboard-specific widgets
│   ├── orders/       # Orders domain components (table, filters, row detail)
│   ├── layout/        # Sidebar, header
│   └── ui/              # shadcn/ui primitives
├── pages/            # Route-level pages
├── services/         # Data-fetching layer (mock services for now)
├── types/             # Shared TypeScript types
└── utils/             # Formatting and status helpers
```
