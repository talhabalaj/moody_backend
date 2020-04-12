import Express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import { mainRouter } from './routes/v1';
import { port } from './config';
import { escapeBody } from './middleware/escapeBody';

import './lib/db';

const app = Express();

// Middleware
app.use(helmet() as any);

// CORS
app.use(cors() as any);
app.options(cors() as any);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(escapeBody);

// Routes
app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});