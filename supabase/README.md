# Database

This dashboard uses the same Supabase project as the
[Terre d'Oliva storefront](https://github.com/federicomariacalato/terre-doliva-ecommerce).

The schema (tables, Row Level Security policies and database functions) lives in a
single place, in the storefront repository:
[`supabase/schema.sql`](https://github.com/federicomariacalato/terre-doliva-ecommerce/blob/main/supabase/schema.sql).
Make database changes there, then regenerate the TypeScript types in both projects:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
```
