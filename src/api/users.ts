import type { Request, Response } from 'express';
import { BadRequestError } from '../customErrors.ts';
import { createUser } from '../db/queries/users.ts';

export async function handleUserCreation(req: Request, res: Response) {
	const { email = '' } = req.body ?? {};
	if (typeof email !== 'string' || email.trim() === '') {
		throw new BadRequestError('Email should be valid');
	}
	const user = await createUser({ email });
	res
		.status(201)
		.header('Content-Type', 'application/json')
		.send({ ...user });
}
