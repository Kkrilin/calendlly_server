import UserController from '../controllers/user.js';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { OAuth2Client } from 'google-auth-library';
import bycrypt from 'bcrypt';
const client = new OAuth2Client(config.googleClientId);
// validate register request
export const validateSignUp = async (req, re, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw new Error(`please send ${!name || !email || !password}`);
    }
    // const userByName = await UserController.findOneByName(name);
    // if (userByName) {
    //   throw new Error('Invalid request: userName is already in use');
    // }

    const user = await UserController.findOneByEmail(email);
    if (user && user.googleId) {
      throw new Error('Invalid request: user is registered with google account');
    }
    if (user) {
      throw new Error('Invalid request: userEmail is already in use');
    }
    req.body.password = await bycrypt.hash(password, 10);
    next();
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

// validate login request
export const validateLogin = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await UserController.findOneByEmail(email);
    if (!user) {
      throw new Error('user with email is not regsiter');
    }
    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

// authenticate protected routes
export const authenticate = async (req, res, next) => {
  console.log('req.headers', req.headers)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  try {
    if (!token) {
      throw new Error('user authentication falied');
    }
    const decoded = jwt.verify(token, config.secretKey);
    const user = await UserController.findOneById(decoded.id);
    if (!user) {
      throw new Error('user doest not exist');
    }
    req.userId = decoded.id;
    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
};
