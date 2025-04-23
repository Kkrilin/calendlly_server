import UserController from '../controllers/user.js';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';
import utils from '../helper/utils.js';
import { google } from 'googleapis';
import { NextFunction, Request, Response } from 'express';
import { TokenPayload } from 'google-auth-library';

const { googleClientId, googleSecretClient, redirectUri } = config;
const oauth2Client = new google.auth.OAuth2(googleClientId,googleSecretClient,redirectUri);

export const registerUser = async function (req: Request,res: Response,next: NextFunction) {
  const values = req.body;

  const baseProfileSlug = utils.slugify(values.email.split('@')[0]);
  const profileSlug = await utils.uniqueProfileSlug(baseProfileSlug);
  values.profileSlug = profileSlug;
  try {
    const user = await UserController.registerUser(values);
    if (user) {
      const token = jwt.sign({ id: user.id }, config.secretKey, {
        expiresIn: config.jwtExpiration as jwt.SignOptions['expiresIn'],
      });
      //   res.cookie('jwt', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
      res.status(201).json({
        success: 1,
        userData: { id: user.id, name: user.name, email: user.email },
        token,
      });
    } else {
      res.status(409).send({ success: 0, message: 'details are not correct' });
    }
  } catch (error: any) {
    error.status = 409;
    next(error);
  }
};

export const login = async function (req: Request,res: Response,next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await UserController.findOneByEmail(email);
    if (user) {
      const isSame = await bycrypt.compare(password, user.password);
      if (isSame) {
        const token = jwt.sign({ id: user.id }, config.secretKey, {
          expiresIn: config.jwtExpiration as jwt.SignOptions['expiresIn'],
        });
        // res.cookie('jwt', token, {
        //   maxAge: 24 * 60 * 60 * 1000,
        //   httpOnly: true,
        // });
        res.status(200).json({
          success: 1,
          userData: { id: user.id, name: user.name, email: user.email },
          token,
        });
      } else {
        throw new Error('Authentication failed');
      }
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error: any) {
    error.status = 401;
    next(error);
  }
};

export const googleAuth = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { code } = req.body;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) throw new Error('google authentication falied');

    const { name, email, sub: googleId } = payload;

    if (!name || !email) {
      throw new Error(`please send name and email`);
    }
    const baseProfileSlug = utils.slugify(email.split('@')[0]);
    const profileSlug = await utils.uniqueProfileSlug(baseProfileSlug);
    const data = {
      name,
      email,
      googleId,
      profileSlug,
    };

    const refreshToken = utils.encrypt(tokens.refresh_token);
    let user = await UserController.findOneByEmail(email);
    const userByGoogleId = await UserController.findOneByGoogleId(googleId);
    let status = '';
    if (!user && !userByGoogleId) {
      user = await UserController.registerUser(data);
      status = 'NEW_USER';
    } else if (user.googleId !== googleId) {
      throw new Error('Account exists with password login');
    } else {
      status = 'EXISTING_USER';
    }
    if (userByGoogleId) {
      user = userByGoogleId;
    }
    await user.update({ refreshToken });
    const token = jwt.sign({ id: user.id }, config.secretKey, {
      expiresIn: config.jwtExpiration as jwt.SignOptions['expiresIn'],
    });

    res.status(201).json({
      success: 1,
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
      },
      token,
      status,
    });
  } catch (error: any) {
    error.status = 409;
    next(error);
  }
};

export const updateUser = async function (req: Request, res: Response,next: NextFunction) {
  const { userId } = req;
  const { email, name } = req.body;
  const value: any = {
    email,
    name,
  };
  try {
    const userById = await UserController.findOneById(userId);
    if (!userId) {
      throw new Error('user does not exist');
    }
    if (userById.email !== email) {
      const userByEmail = await UserController.findOneByEmail(email);
      if (userByEmail) {
        throw new Error('email is already in use');
      }
      const baseProfileSlug = utils.slugify(email.split('@')[0]);
      const profileSlug = await utils.uniqueProfileSlug(baseProfileSlug);
      value.profileSlug = profileSlug;
    }
    const user = await userById.update(value);
     res.status(200).json({
      success: 1,
      userData: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    error.status = 409;
    next(error);
  }
};
