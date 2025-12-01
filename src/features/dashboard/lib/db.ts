import { Pool } from "pg";

export const NEXT_PUBLIC_DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: NEXT_PUBLIC_DATABASE_URL,
});

// Configurar timezone de Argentina para cada nueva conexión
pool.on("connect", (client) => {
  client.query("SET timezone = 'America/Argentina/Buenos_Aires'");
});

export default pool;
