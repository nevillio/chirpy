import type { Request, Response } from 'express';
import { config } from '../config.ts';
import { ForbiddenError } from '../customErrors.ts';
import { deleteAllUsers } from '../db/queries/users.ts';

export async function handleUsersReset(req: Request, res: Response) {
	if (config.api.platform !== 'dev') {
		throw new ForbiddenError('Reset is only allowed in dev environments');
	}
	config.api.fileServerHits = 0;
	await deleteAllUsers();
	res.send('All users deleted');
}
