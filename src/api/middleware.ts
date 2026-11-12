import type { NextFunction, Request, Response } from 'express';
import { config } from '../config.ts';
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from './errors.ts';
import { respondWithError } from './json.ts';

export function middlewareError(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	let statusCode = 500;
	let message =
		config.api.platform === 'dev'
			? err.message
			: 'Something went wrong on our end';

	if (err instanceof BadRequestError) {
		statusCode = 400;
		message = err.message;
	} else if (err instanceof UnauthorizedError) {
		statusCode = 401;
		message = err.message;
	} else if (err instanceof ForbiddenError) {
		statusCode = 403;
		message = err.message;
	} else if (err instanceof NotFoundError) {
		statusCode = 404;
		message = err.message;
	}
	respondWithError(res, statusCode, message);
}

export function middlewareMetricsInc(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	config.api.fileServerHits++;
	next();
}

export const middlewareLogResponse = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	res.on('finish', () => {
		const { statusCode } = res;
		if (statusCode > 299) {
			console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
		}
	});
	next();
};
