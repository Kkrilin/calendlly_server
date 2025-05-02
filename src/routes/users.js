import express from 'express';
import { updateUser, getUser } from '../services/user.js';

const router = express();

router.route('/').get(getUser).post(updateUser);

export default router;
