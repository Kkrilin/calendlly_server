import UserController from '../controllers/user.js';
import config from '../../config/config.js';
import jwt from 'jsonwebtoken';
import bycrypt from 'bcrypt';

export const registerUser = async function (req, res, next) {
  const values = req.body;
  try {
    const user = await UserController.registerUser(values);
    if (user) {
      const token = jwt.sign({ id: user.id }, config.secretKey, {
        expiresIn: config.jwtExpiration,
      });
      //   res.cookie('jwt', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
      res.status(201).json({
        success: 1,
        userdata: { id: user.id, name: user.name, email: user.email },
        token,
      });
    } else {
      res.status(409).send({ success: 0, message: 'details are nor correct' });
    }
  } catch (error) {
    error.status = 409;
    next(error);
  }
};

export const login = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserController.findOneByEmail(email);
    if (user) {
      const isSame = await bycrypt.compare(password, user.password);
      if (isSame) {
        const token = jwt.sign({ id: user.id }, config.secretKey, {
          expiresIn: config.jwtExpiration,
        });
        // res.cookie('jwt', token, {
        //   maxAge: 24 * 60 * 60 * 1000,
        //   httpOnly: true,
        // });
        return res.status(200).json({ success: 1, user, token });
      } else {
        throw new Error('Authentication failed');
      }
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

export const googleAuth = async function (req, res, next) {
  const { name, email, googleId } = req.body;
  try {
    if (!name || !email || !googleId) {
      throw new Error(`please send ${!name || !email || !googleId}`);
    }
    const data = {
      name,
      email,
      googleId,
    };
    let user = await UserController.findOneByEmail(email);
    let status = '';
    if (!user) {
      user = await UserController.registerUser(data);
      status = 'NEW_USER';
    } else if (user.googleId !== googleId) {
      throw new Error('Account exists with password login');
    } else {
      status = 'EXISTING_USER';
    }
    const token = jwt.sign({ id: user.id }, config.secretKey, {
      expiresIn: config.jwtExpiration,
    });
    //   res.cookie('jwt', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res
      .status(201)
      .json({ success: 1, userData: { name, email, googleId }, token, status });
  } catch (error) {
    error.status = 409;
    next(error);
  }
};
