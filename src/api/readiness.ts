import type { Request, Response } from 'express';

export function handleReadinessRead(req: Request, res: Response) {
	res.set({ 'Content-Type': 'text/plain; charset=utf-8' }).send('OK');
}
