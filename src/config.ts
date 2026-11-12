import type { MigrationConfig } from 'drizzle-orm/migrator';

process.loadEnvFile();

function envOrThrow(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`No environment variable set for ${key}`);
	}
	return String(value);
}

type APIConfig = {
	fileServerHits: number;
	port: number;
	platform: string;
};

type DBConfig = {
	url: string;
	migrationConfig: MigrationConfig;
};

const api: APIConfig = {
	fileServerHits: 0,
	port: Number(envOrThrow('PORT')),
	platform: envOrThrow('PLATFORM'),
};

const db: DBConfig = {
	url: envOrThrow('DB_URL'),
	migrationConfig: {
		migrationsFolder: './src/db/migrations/',
	},
};

export const config = {
	db,
	api,
};
