import type { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../customErrors.ts';
import { createChirp, getChirp, getChirps } from '../db/queries/chirps.ts';
import { respondWithJSON } from './json.ts';

function censor(chirp: string) {
	return chirp.replace(/\b(kerfuffle|sharbert|fornax)\b/gi, '****');
}

export async function handleChirpsFetch(_req: Request, res: Response) {
	const chirps = await getChirps();
	if (chirps.length > 0) {
		respondWithJSON(res, 200, chirps);
	}
	respondWithJSON(res, 200, 'No chirps found');
}

export async function handleChirpFetch(req: Request, res: Response) {
	const { chirpId } = req.params;
	if (typeof chirpId !== 'string') {
		throw new BadRequestError('Invalid chirp id');
	}

	const chirp = await getChirp(chirpId);
	if (chirp != null) {
		respondWithJSON(res, 200, chirp);
	}

	throw new NotFoundError('Chirp not found');
}

export async function handleChirpCreation(req: Request, res: Response) {
	const { body: chirp, userId } = req.body ?? {};

	let body = '';
	try {
		if (
			typeof chirp !== 'string' ||
			typeof userId !== 'string' ||
			chirp.trim() === '' ||
			userId.trim() === ''
		) {
			throw 'invalid chirp';
		}
		body = validateChirp(chirp);
	} catch (error: any) {
		throw new BadRequestError(error);
	}

	try {
		const newChirp = await createChirp({ body, userId });
		res
			.status(201)
			.header('Content-Type', 'application/json')
			.send({ ...newChirp });
	} catch (error: any) {
		throw new Error(error);
	}
}

function validateChirp(chirp: string) {
	if (chirp.length > 140) {
		throw 'Chirp is too long. Max length is 140';
	}
	return censor(chirp);
}
