import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(supabaseURL, supabaseKey);
