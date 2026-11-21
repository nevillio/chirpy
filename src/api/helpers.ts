import { checkPasswordHash, hashPassword } from '../auth/auth.ts';
import { createUser, getUser } from '../db/queries/users.ts';
import type { NewUser } from '../db/schema.ts';
import { BadRequestError, UnauthorizedError } from './errors.ts';

const INVALID_CREDENTIALS_MSG = 'incorrect email or password';

export function validateCredentials(email: string, password: string) {
	// NOTE: Type and isEmpty checks can be performed from the client side.
	if (typeof email !== 'string' || email.trim() === '') {
		throw new BadRequestError('Email should be valid');
	}

	if (typeof password !== 'string' || password.trim() === '') {
		throw new BadRequestError('Password should be valid');
	}
}

export type UserResponse = Omit<NewUser, 'hashed_password'>;
export async function createAndGetResponse(
	email: string,
	password: string,
): Promise<UserResponse> {
	const hashedPassword = await hashPassword(password);
	const user = await createUser({ email, hashed_password: hashedPassword });
	if (!user) {
		throw new BadRequestError('Email is already in use');
	}

	const { hashed_password: _hashedPassword, ...userResponse } = user;
	return userResponse;
}

export async function authenticateUser(
	email: string,
	password: string,
): Promise<UserResponse> {
	const user = await getUser(email);
	if (user === null) {
		throw new UnauthorizedError(INVALID_CREDENTIALS_MSG);
	}

	const { hashed_password, ...userResponse } = user;
	if (!(await checkPasswordHash(password, hashed_password))) {
		throw new UnauthorizedError(INVALID_CREDENTIALS_MSG);
	}
	return userResponse;
}
