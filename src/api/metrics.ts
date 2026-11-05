import type { NextFunction, Request, Response } from 'express';
import { config } from '../config.ts';

export function middlewareMetricsInc(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	config.fileserverHits++;
	next();
}

export function handleMetricsRead(req: Request, res: Response) {
	const hits = config.fileserverHits;
	res.set('Content-Type', 'text/plain').send(`Hits: ${hits}`);
}

export function handleMetricsReset(req: Request, res: Response) {
	config.fileserverHits = 0;
	res.send('OK');
}
