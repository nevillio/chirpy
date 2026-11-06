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

app.use(middlewareLogResponse);
app.use(express.json());
app.use('/app', middlewareMetricsInc, express.static('./src/app'));
app.get('/api/healthz', handleReadinessRead);
app.post('/api/validate_chirp', handleChirpValidation);
app.get('/admin/metrics', handleMetricsRead);
app.post('/admin/reset', handleMetricsReset);

app.listen(port, () => {
	console.log(`Example app listening on port: ${port}`);
});
