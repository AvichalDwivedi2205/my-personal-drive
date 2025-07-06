import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { createPool, type Pool } from "mysql2/promise";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
   conn: Pool | undefined;
};
// What this does is that it creates a global object that is used to store the database connection
// This is used to avoid creating a new connection on every HMR update.

const conn = globalForDb.conn ?? 
createPool({
  host: env.SINGLESTORE_HOST,
  port: parseInt(env.SINGLESTORE_PORT),
  user: env.SINGLESTORE_USER,
  password: env.SINGLESTORE_PASS,
  database: env.SINGLESTORE_DB_NAME,
  ssl: {},
  maxIdle: 0
});

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

conn.addListener("error", (err) => {
  console.error("Database connection error:", err);
});


// Drizzle config does not work with pools
// So we are using mysql2/promise to create a pooled connection
// And then we are using drizzle to connect to the database
// And then we are using drizzle to connect to the database
