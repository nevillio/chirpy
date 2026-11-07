import type { Request, Response } from 'express';
import { BadRequestError } from '../customErrors.ts';

type responseData = {
	cleanedBody?: string;
	error?: string;
};

function censor(chirp: string) {
	return chirp.replace(/\b(kerfuffle|sharbert|fornax)\b/gi, '****');
}

export function handleChirpValidation(req: Request, res: Response) {
	res.header('Content-Type', 'application/json');
	let status = -1;
	let respBody: responseData = {};

	const { body: chirp } = req.body;
	if (chirp.length > 140) {
		throw new BadRequestError('Chirp is too long. Max length is 140');
	} else {
		const cleanedBody = censor(chirp);
		status = 200;
		respBody = { cleanedBody };
		res.status(status).send(respBody);
	}
}
