import Express from 'express';
import bodyParser from 'body-parser';

import { mainRouter } from './routes/v1';
import { port } from './config';
import './lib/db';

const app = Express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});