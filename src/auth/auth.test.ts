import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { BadRequestError, ForbiddenError } from '../api/errors.ts';
import {
	checkPasswordHash,
	extractBearerToken,
	hashPassword,
	makeJWT,
	validateJWT,
} from './auth.ts';

describe('Password Hashing', () => {
	const password1 = 'correctPassword123!';
	const password2 = 'anotherPassword456!';
	let hash1: string;
	let hash2: string;

	beforeAll(async () => {
		hash1 = await hashPassword(password1);
		hash2 = await hashPassword(password2);
	});

	it('should return true for the correct password', async () => {
		const result = await checkPasswordHash(password1, hash1);
		expect(result).toBe(true);
	});
});

describe('JSON web tokens', () => {
	const userId1 = 'simple user';
	const userId2 = 'gigachad user';

	let token1: string = '';
	let token2: string = '';
	const correctSecret = 'secret';
	const wrongSecret = 'public';

	beforeAll(() => {
		token1 = makeJWT(userId1, 1000, correctSecret);
		token2 = makeJWT(userId2, 500, correctSecret);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should return the userId for valid tokens', () => {
		const userId = validateJWT(token1, correctSecret);
		expect(userId).toBe(userId1);
	});

	it('should throw for an invalid token', () => {
		expect(() => validateJWT(token2, wrongSecret)).toThrowError(ForbiddenError);
	});

	it('should reject a token that has expired', () => {
		const token = makeJWT(userId1, 60, correctSecret);

		vi.useFakeTimers();
		vi.advanceTimersByTime(2 * 60 * 1000);

		expect(() => {
			validateJWT(token, correctSecret);
		}).toThrowError(ForbiddenError);
	});
});

describe('extracting bearer tokens', () => {
	it('should return the token for valid header', () => {
		const authHeader = 'Bearer GafoorKa1stDosth';
		const token = extractBearerToken(authHeader);
		expect(token).toBe('GafoorKa1stDosth');
	});

	it('should throw for invalid header', () => {
		let authHeader;
		expect(() => {
			extractBearerToken(authHeader);
		}).toThrowError(BadRequestError);
	});

	it('should throw for wrong scheme', () => {
		const authHeader = 'Borer GafoorKa2ndDosth';
		expect(() => {
			extractBearerToken(authHeader);
		}).toThrowError(BadRequestError);
	});
});
