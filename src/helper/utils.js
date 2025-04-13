import slug from 'slug';
import db from '../models/index.js';
import UserController from '../controllers/user.js';
// import eventTypeController from '../controllers/eventType.js';

const utils = {};

utils.slugify = (val) => {
  if (val === null) {
    return null;
  }
  return (
    slug(val, {
      lower: true,
      remove: null,
    }) || val
  );
};

const checkProfileSlugExist = async (slug) =>
  await UserController.findOneByProfileSlug(slug);

utils.uniqueProfileSlug = async (slug) => {
  let count = 1;
  let uniqueSlug = slug;
  while (await checkProfileSlugExist(uniqueSlug)) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }
  return uniqueSlug;
};

const checkEventTypeSlugExist = async (slug) =>
  await eventTypeController.findOneByEventTyepSlug(slug);

utils.uniqueEventTypeSlug = async (slug) => {
  let count = 1;
  let uniqueSlug = slug;
  while (await checkEventTypeSlugExist(uniqueSlug)) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }
  return uniqueSlug;
};
export default utils;
