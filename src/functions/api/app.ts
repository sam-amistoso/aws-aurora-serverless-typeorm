import express from 'express';
import apiRouter from './routes';

const app = express();

app.use('/api', apiRouter);

export { app };
