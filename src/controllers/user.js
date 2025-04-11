import db from '../models/index.js';

const user = db.User;

const UserController = {};

//  find user by name
UserController.findOneByName = (name) => {
  const filter = {
    where: {
      name,
    },
  };

  return user.findOne(filter);
};

// find user by email
UserController.findOneByEmail = (email) => {
  const filter = {
    where: {
      email,
    },
  };
  return user.findOne(filter);
};

// register the user
UserController.registerUser = async (values = {}) => {
  const registeredUser = await user.create(values);
  if (!registeredUser) {
    throw new Error('user failed to create');
  }
  return registeredUser;
};

export default UserController;
