import db from '../models/index.ts';
import { ControllerType } from '../types/index.js';
// const user = db.User;

const UserController: ControllerType = {};

//  find user by name
UserController.findOneByName = (name) => {
  const filter = {
    where: {
      name,
    },
  };

  return db.User.findOne(filter);
};

//  find user by id
UserController.findOneById = (id, options = {}) => {
  const filter = {
    where: {
      id,
    },
  };

  return db.User.findOne(filter);
};

// find user bt profileSlug
UserController.findOneByProfileSlug = (profileSlug) => {
  const filter = {
    where: {
      profileSlug,
    },
  };

  return db.User.findOne(filter);
};

// find user by email
UserController.findOneByEmail = (email) => {
  const filter = {
    where: {
      email,
    },
  };
  return db.User.findOne(filter);
};

// find user by googleId
UserController.findOneByGoogleId = (googleId) => {
  const filter = {
    where: {
      googleId,
    },
  };
  return db.User.findOne(filter);
};

// register the user
UserController.registerUser = async (values = {}) => {
  const registeredUser = await db.User.create(values);
  if (!registeredUser) {
    throw new Error('user failed to create');
  }
  return registeredUser;
};

export default UserController;
