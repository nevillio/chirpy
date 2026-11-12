import express, { type Express } from 'express';
import { handleMetricsRead } from './admin/metrics.ts';
import { handleReadinessRead } from './api/readiness.ts';
import { config } from './config.ts';
import './db/migrationClient.ts';
import { handleUsersReset } from './admin/reset.ts';
import {
	handleChirpCreation,
	handleChirpFetch,
	handleChirpsFetch,
} from './api/chirps.ts';
import {
	middlewareError,
	middlewareLogResponse,
	middlewareMetricsInc,
} from './api/middleware.ts';
import { handleUserCreation } from './api/users.ts';

const app: Express = express();
const port = config.api.port;

app.use(middlewareLogResponse);
app.use(express.json());
app.use('/app', middlewareMetricsInc, express.static('./src/app'));
app.get('/api/healthz', handleReadinessRead);

app.post('/api/users', handleUserCreation);
app.get('/api/chirps', handleChirpsFetch);
app.get('/api/chirps/:chirpId', handleChirpFetch);
app.post('/api/chirps', handleChirpCreation);
app.get('/admin/metrics', handleMetricsRead);
app.post('/admin/reset', handleUsersReset);
app.use(middlewareError);

app.listen(port, () => {
	console.log(`Example app listening on port: ${port}`);
});
