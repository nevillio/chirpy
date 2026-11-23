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

type JWTConfig = {
	issuer: string;
	secret: string;
	defaultDuration: number;
	refreshDuration: number;
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

const jwt: JWTConfig = {
	defaultDuration: 60 * 60,
	refreshDuration: 60 * 60 * 24 * 60,
	secret: envOrThrow('SECRET'),
	issuer: 'chirpy',
};

export const config = {
	db,
	api,
	jwt,
};
