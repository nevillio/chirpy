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
} from './api/metrics.ts';
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
app.use('/app', middlewareMetricsInc, express.static('./src/app'));
app.get('/healthz', handleReadinessRead);
app.get('/metrics', handleMetricsRead);
app.get('/reset', handleMetricsReset);

app.listen(port, () => {
	console.log(`Example app listening on port: ${port}`);
});
