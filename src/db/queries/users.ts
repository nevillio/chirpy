import { db } from '../index.ts';
import { type NewUser, users } from '../schema.ts';

export async function createUser(user: NewUser) {
	const [result] = await db
		.insert(users)
		.values(user)
		.onConflictDoNothing()
		.returning();
	return result;
}

export async function deleteAllUsers() {
	await db.delete(users);
}
