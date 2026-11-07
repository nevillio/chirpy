import express, {
	type Express,
	type NextFunction,
	type Request,
	type Response,
} from 'express';
import {
	handleMetricsRead,
	handleMetricsReset,
	middlewareMetricsInc,
} from './admin/metrics.ts';
import { handleChirpValidation } from './api/chirps.ts';
import { handleReadinessRead } from './api/readiness.ts';
import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from './customErrors.ts';

const app: Express = express();
const port = 8080;

const middlewareLogResponse = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	res.on('finish', () => {
		const { statusCode } = res;
		if (statusCode !== 200) {
			console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
		}
	});
	next();
};

function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	console.log(err);
	if (err instanceof BadRequestError) {
		res.status(400).json({ error: err.message });
	} else if (err instanceof UnauthorizedError) {
		res.status(401).json({ error: err.message });
	} else if (err instanceof ForbiddenError) {
		res.status(403).json({ error: err.message });
	} else if (err instanceof NotFoundError) {
		res.status(404).json({ error: err.message });
	} else res.status(500).send({ error: 'Something went wrong on our end' });
}

app.use(middlewareLogResponse);
app.use(express.json());
app.use('/app', middlewareMetricsInc, express.static('./src/app'));
app.get('/api/healthz', handleReadinessRead);
app.post('/api/validate_chirp', handleChirpValidation);
app.get('/admin/metrics', handleMetricsRead);
app.post('/admin/reset', handleMetricsReset);
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Example app listening on port: ${port}`);
});
