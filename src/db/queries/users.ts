import { asc, eq } from 'drizzle-orm';
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

export async function getUser(email: string) {
	const [result] = await db.select().from(users).where(eq(users.email, email));
	return result ?? null;
}

export async function getUsers() {
	const result = await db
		.select({ email: users.email, id: users.id })
		.from(users)
		.orderBy(asc(users.createdAt));
	return result;
}

export async function deleteAllUsers() {
	await db.delete(users);
}
