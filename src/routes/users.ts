import express from 'express';
import { registerUser, login, googleAuth, updateUser } from '../services/user.js';
import { validateSignUp, validateLogin } from '../middleware/userAuth.js';

const router = express();

router.post('/signup', validateSignUp, registerUser);
router.post('/login', validateLogin, login);
router.post('/google', googleAuth);
router.post('/', updateUser);

export default router;
