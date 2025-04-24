import UserController from '../controllers/user.ts';
import jwt from 'jsonwebtoken';
import config from '../config/config.ts';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { UserAttributes } from '../types/model/user.ts';

const client = new OAuth2Client(config.googleClientId);

// 👇 Extend Request interface to allow custom userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// validate register request
export const validateSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw new Error(`please send ${!name || !email || !password}`);
    }
    // const userByName = await UserController.findOneByName(name);
    // if (userByName) {
    //   throw new Error('Invalid request: userName is already in use');
    // }

    const user: UserAttributes = await UserController.findOneByEmail(email);
    if (user && user.googleId) {
      throw new Error(
        'Invalid request: user is registered with google account',
      );
    }
    if (user) {
      throw new Error('Invalid request: userEmail is already in use');
    }
    req.body.password = await bcrypt.hash(password, 10);
    next();
  } catch (error: any) {
    error.status = 400;
    next(error);
  }
};

// validate login request
export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;
  try {
    const user: UserAttributes = await UserController.findOneByEmail(email);
    if (!user) {
      throw new Error('user with email is not regsiter');
    }
    next();
  } catch (error: any) {
    error.status = 401;
    next(error);
  }
};

// authenticate protected routes
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  try {
    if (!token) throw new Error('User authentication failed');
    if (!config.secretKey) throw new Error('User authentication failed');

    const decoded = jwt.verify(token, config.secretKey);
    if (typeof decoded === 'string' || !('id' in decoded)) {
      throw new Error('Invalid token payload');
    }

    const user: UserAttributes = await UserController.findOneById(decoded.id);
    if (!user) throw new Error('User does not exist');

    req.userId = decoded.id;
    next();
  } catch (error: any) {
    error.status = 401;
    next(error);
  }
};
