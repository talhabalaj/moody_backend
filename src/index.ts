import Express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { mainRouter } from './routes/v1';
import { port, origin } from './config';
import { escapeBody } from './middleware/escapeBody';

import './lib/db';

const app = Express();
const corsMiddleware: any = cors({ credentials: true, origin });

// Middleware
app.use(helmet() as any);

// CORS
app.options(corsMiddleware);
app.use(corsMiddleware);

app.use(cookieParser() as any)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(escapeBody);

// Routes
app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});