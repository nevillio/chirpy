import { config } from '../../config.ts';
import { db } from '../index.ts';
import { refresh_tokens } from '../schema.ts';

export async function saveRefreshToken(userId: string, token: string) {
	const rows = await db
		.insert(refresh_tokens)
		.values({
			userId,
			token,
			expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
			revokedAt: null,
		})
		.onConflictDoNothing()
		.returning();

	return rows.length > 0;
}
