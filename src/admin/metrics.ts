import type { Request, Response } from 'express';
import { config } from '../config.ts';

export function handleMetricsRead(req: Request, res: Response) {
	const hits = config.api.fileServerHits;
	res.set('Content-Type', 'text/html; charset=utf-8').send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${hits} times!</p>
  </body>
</html>`);
}
