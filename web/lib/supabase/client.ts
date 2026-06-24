import { createBrowserClient } from "@supabase/ssr";

// Supabase client cho Client Components (trình duyệt).
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
