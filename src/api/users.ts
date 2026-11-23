import type { Request, Response } from 'express';
import { makeJWT, makeRefreshToken } from '../auth/auth.ts';
import { config } from '../config.ts';
import { saveRefreshToken } from '../db/queries/refresh_tokens.ts';
import { getUsers } from '../db/queries/users.ts';
import { UnauthorizedError } from './errors.ts';
import {
	authenticateUser,
	createAndGetResponse,
	validateCredentials,
} from './helpers.ts';
import { respondWithJSON } from './json.ts';

export async function handleUsersFetch(_req: Request, res: Response) {
	const users = await getUsers();
	if (users.length > 0) {
		return respondWithJSON(res, 200, users);
	}
	return respondWithJSON(res, 200, 'No user found');
}

export async function handleUserCreation(req: Request, res: Response) {
	const { email = '', password = '' } = req.body ?? {};

	validateCredentials(email, password);

	const userResponse = await createAndGetResponse(email, password);
	respondWithJSON(res, 201, userResponse);
}

export async function handleUserLogin(req: Request, res: Response) {
	const { email = '', password = '' } = req.body ?? {};

	validateCredentials(email, password);

	const userResponse = await authenticateUser(email, password);
	const userId = userResponse.id || '';
	const jwt = makeJWT(userId, config.jwt.defaultDuration, config.jwt.secret);
	const refreshToken = makeRefreshToken();

	const saved = await saveRefreshToken(userId, refreshToken);
	if (!saved) {
		throw new UnauthorizedError('could not save refresh token');
	}

	respondWithJSON(res, 200, { ...userResponse, token: jwt, refreshToken });
}
