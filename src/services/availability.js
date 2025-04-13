import AvailabilityController from '../controllers/availability.js';

const dayOfWeeks = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

export const getAllAvailability = async function (req, res, next) {
  const { userId } = req;

  try {
    const availability = await AvailabilityController.findAllByUserId(userId);
    return res.status(200).json({ sucess: 1, availability });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const createAvailability = async function (req, res, next) {
  const { userId } = req;
  const { dayOfWeek, startTime, endTime, active, availabilities } = req.body;

  const values = {
    day_of_week: dayOfWeeks[dayOfWeek],
    start_time: startTime,
    end_time: endTime,
    active,
    userId,
  };

  try {
    if (
      availabilities &&
      Array.isArray(availabilities) &&
      availabilities.length
    ) {
      const availabilityValues = availabilities.map((av) => {
        return {
          day_of_week: dayOfWeeks[av.dayOfWeek],
          start_time: av.startTime,
          end_time: av.endTime,
          active: av.active,
          userId,
        };
      });
      console.log('availabilityValues', availabilityValues);
      const eventTypes =
        await AvailabilityController.bulkCreateAvailability(availabilityValues);
      return res.status(201).json({ sucess: 1, eventTypes });
    } else {
      const eventType = await AvailabilityController.creatAvailability(values);
      return res.status(201).json({ sucess: 1, eventType });
    }
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

export const updateAvailability = async function (req, res, next) {
  const { id } = req.params;
  const { userId } = req;
  const { dayOfWeek, startTime, endTime, active } = req.body;
  const values = {
    day_of_week: dayOfWeeks[dayOfWeek],
    start_time: startTime,
    end_time: endTime,
    active,
    id,
  };

  try {
    const existAvailability = await AvailabilityController.findOneById(id);
    if (!existAvailability || !existAvailability.active) {
      throw new Error('existAvailability is not active');
    }
    const availability = await AvailabilityController.updateById(
      userId,
      id,
      values,
    );
    return req.status(200).json({
      sucess: 1,
      availability,
      message: 'eventType update SuccessFull',
    });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const updateAvailabilityStatus = async function (req, res, next) {
  const [userId] = req;
  const { id } = req.params;
  const values = {
    active: req.active || 0,
  };
  try {
    const existAvailability = await AvailabilityController.findOneById(id);
    if (!existAvailability) {
      throw new Error('Availability does not exist');
    }
    const availability = await AvailabilityController.updateById(
      userId,
      id,
      values,
    );
    return req.status(200).json({
      sucess: 1,
      availability,
      message: `${req.active ? 'Availability active' : 'Availability inactive'}`,
    });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};
