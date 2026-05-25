import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const dbUser = process.env.DB_USER || process.env.DB_USERNAME;
const dbName = process.env.DB_NAME || process.env.DB_DATABASE;
const useSsl = (process.env.DB_SSL || "true").toLowerCase() !== "false";

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: dbUser,
    database: dbName,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "3306"),
    // TiDB Cloud serverless requires encrypted transport.
    ...(useSsl
        ? {
              ssl: {
                  minVersion: "TLSv1.2",
                  rejectUnauthorized: true
              }
          }
        : {})
});

export const db = drizzle(connection);


