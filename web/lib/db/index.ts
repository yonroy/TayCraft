import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Khởi tạo lười: import module này KHÔNG cần DATABASE_URL.
// Chỉ ném lỗi khi thực sự truy vấn mà thiếu env (giúp landing/login chạy trước khi cắm DB).
let _db: PostgresJsDatabase<typeof schema> | null = null;

function getDb(): PostgresJsDatabase<typeof schema> {
  if (_db) return _db;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL chưa được cấu hình");
  }
  // prepare:false để tương thích connection pooler của Supabase (transaction mode).
  const client = postgres(connectionString, { prepare: false });
  _db = drizzle(client, { schema });
  return _db;
}

export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop) {
    const real = getDb();
    return Reflect.get(real, prop, real);
  },
});

export { schema };
