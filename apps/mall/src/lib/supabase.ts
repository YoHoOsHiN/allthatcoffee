import { createClient } from "@supabase/supabase-js";
import type { Database } from "@coffeeshop/db";

export const supabase = createClient<Database, "coffeeshop">(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "coffeeshop" } }
);
