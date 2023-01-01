import cors from 'cors';
import express, { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/user', userRoutes);

export default router;
