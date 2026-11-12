import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { config } from '../config.ts';

const migrateClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrateClient), config.db.migrationConfig);
