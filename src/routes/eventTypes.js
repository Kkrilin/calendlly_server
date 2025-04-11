import express from 'express';
import { registerUser, login, googleAuth } from '../services/user.js';
import { validateSignUp, validateLogin } from '../middleware/userAuth.js';

const router = express();

router.post('/', validateSignUp, registerUser);
router.get('/:id', validateLogin, login);
router.delete('/:id', googleAuth);

export default router;
