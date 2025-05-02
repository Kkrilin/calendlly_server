import UserController from '../controllers/user.js';
import utils from '../helper/utils.js';

export const getUser = async (req, res) => {
  const { userId } = req;
  try {
    const user = await UserController.findOneById(userId);
    if (!user) {
      throw new Error('user does not exist');
    }
    res.status(200).json({
      success: 1,
      userData: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    error.status = 403;
    next(error);
  }
};

export const updateUser = async function (req, res, next) {
  const { userId } = req;
  const { email, name } = req.body;
  const value = {
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
    return res.status(200).json({
      success: 1,
      userData: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    error.status = 409;
    next(error);
  }
};
