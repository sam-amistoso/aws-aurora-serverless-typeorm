import express from 'express';
import apiRouter from '../routes';

const app = express();

// router.get('/', (req: Request, res: Response) => {
//   return res.status(200).send('Welcome to API Express');
// });

app.use('/api', apiRouter);

export { app };
