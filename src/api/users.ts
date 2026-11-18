import type { Request, Response } from 'express';
import { getUsers } from '../db/queries/users.ts';
import {
	authenticateUser,
	createAndGetResponse,
	validateCredentials,
} from './helpers.ts';
import { respondWithJSON } from './json.ts';

export async function handleUsersFetch(req: Request, res: Response) {
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
	respondWithJSON(res, 200, userResponse);
}
