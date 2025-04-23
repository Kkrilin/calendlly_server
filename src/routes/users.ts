import express from 'express';
import { registerUser, login, googleAuth, updateUser } from '../services/user';
import { validateSignUp, validateLogin } from '../middleware/userAuth';

const router = express.Router();

router.post('/signup', validateSignUp, registerUser);
router.post('/login', validateLogin, login);
router.post('/google', googleAuth);
router.post('/', updateUser);

export default router;
