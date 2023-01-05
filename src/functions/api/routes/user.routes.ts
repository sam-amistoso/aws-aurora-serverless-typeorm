import express, { Request, Response } from 'express';
import { User } from '@enties/user.entity';
// import { AppDataSource } from '@db/';
import { getDBConnection } from 'src/db/db-manager';

const route = express.Router();

route.get('/lists', async (_, res: Response) => {
  // const users = await AppDataSource.getRepository(User).find();
  // return res.status(200).json(users);
  try {
    const userRepository = await (await getDBConnection()).getRepository(User);
    const users: User[] = await userRepository.find().catch((e) => {
      console.log('Error Catch:', e);
      throw new Error('Empty');
    });
    console.log('users', users);
    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
});

route.put('/update', (req: Request, res: Response) => {
  const params = req.query;
  const id = params?.id || 0;
  return res
    .status(200)
    .send({ message: `The user is id:${id} has been updated` });
});

export default route;
