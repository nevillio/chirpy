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
	res.set('Content-Type', 'text/html; charset=utf-8').send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${hits} times!</p>
  </body>
</html>`);
}

export function handleMetricsReset(req: Request, res: Response) {
	config.fileserverHits = 0;
	res.send('OK');
}
