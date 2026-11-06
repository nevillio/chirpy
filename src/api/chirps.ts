import type { Request, Response } from 'express';

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
	try {
		const { body: chirp } = req.body;
		if (chirp.length > 140) {
			status = 400;
			respBody = { error: 'Chirp is too long' };
		} else {
			const cleanedBody = censor(chirp);
			status = 200;
			respBody = { cleanedBody };
		}
	} catch (error) {
		status = 400;
		respBody = { error: 'Something went wrong' };
	}
	res.status(status).send(respBody);
}
