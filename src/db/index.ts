import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config.ts';
import * as schema from './schema.ts';

const conn = postgres(config.db.url);
export const db = drizzle(conn, { schema });
