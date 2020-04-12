import Express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import { mainRouter } from './routes/v1';
import { port } from './config';
import { escapeBody } from './middleware/escapeBody';

import './lib/db';
import cookieParser from 'cookie-parser';

const app = Express();
const corsMiddleware: any = cors({ credentials: true });

// Middleware
app.use(helmet() as any);

// CORS
app.use(corsMiddleware);
app.options(corsMiddleware);

app.use(cookieParser() as any)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(escapeBody);

// Routes
app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});