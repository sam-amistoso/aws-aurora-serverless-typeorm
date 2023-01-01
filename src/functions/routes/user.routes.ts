import express, { Response } from 'express';

const route = express.Router();

route.get('/list', (_, res: Response) => {
  return res.status(200).send('API Users Route');
});

export default route;
