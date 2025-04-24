import { NextFunction, Request, Response } from 'express';
import AvailabilityController from '../controllers/availability.ts';

const dayOfWeeks = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

export const enum  DayOfWeeks {
  SUN = 'sun',
  MON = "mon",
  TUE = 'tue',
  WED = 'wed',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
}

export const getAllAvailability = async function (req: Request,res: Response,next: NextFunction) {
  const { userId } = req;

  try {
    const availability = await AvailabilityController.findAllByUserId(userId);
      res.status(200).json({ sucess: 1, availability });
  } catch (error: any) {
    error.status = 404;
    next(error);
  }
};

export const createAvailability = async function (req: Request,res: Response,next: NextFunction) {
  const { userId } = req;
  const { dayOfWeek, startTime, endTime, active, availabilities } = req.body;
  const values = {
    day_of_week: dayOfWeeks[dayOfWeek as DayOfWeeks],
    start_time: startTime,
    end_time: endTime,
    active,
    userId,
  };

  try {
    if (availabilities && Array.isArray(availabilities) && availabilities.length) {
      const availabilityValues = availabilities.map((av) => {
        return {
          day_of_week: dayOfWeeks[av.dayOfWeek as DayOfWeeks],
          start_time: av.startTime,
          end_time: av.endTime,
          active: av.active,
          userId,
        };
      });
      const availabilityData = await AvailabilityController.bulkCreateAvailability(availabilityValues);
       res.status(201).json({ sucess: 1, availabilities:  availabilityData});
    } else {
      const availabilityData = await AvailabilityController.creatAvailability(values);
       res.status(201).json({ sucess: 1, availability: availabilityData });
    }
  } catch (error: any) {
    error.status = 401;
    next(error);
  }
};

export const updateAvailability = async function (req: Request,res: Response,next: NextFunction) {
  const { id } = req.params;
  const { userId } = req;
  const { startTime, endTime, active } = req.body;
  const values = {
    start_time: startTime,
    end_time: endTime,
    active,
  };

  try {
    const existAvailability = await AvailabilityController.findOneById(id);
    if (!existAvailability) {
      throw new Error('Availability is not exist');
    }
    const availability = await AvailabilityController.updateById(
      userId,
      id,
      values,
    );
    res.status(200).json({
      sucess: 1,
      availability,
      message: 'eventType update SuccessFull',
    });
  } catch (error: any) {
    error.status = 404;
    next(error);
  }
};


// not in use

// export const updateAvailabilityStatus = async function (req: Request,res: Response,next: NextFunction) {
//   const {userId} = req;
//   const { id } = req.params;
//   const values = {
//     active: req.active || 0,
//   };
//   try {
//     const existAvailability = await AvailabilityController.findOneById(id);
//     if (!existAvailability) {
//       throw new Error('Availability does not exist');
//     }
//     const availability = await AvailabilityController.updateById(
//       userId,
//       id,
//       values,
//     );
//      res.status(200).json({
//       sucess: 1,
//       availability,
//       message: `${req.active ? 'Availability active' : 'Availability inactive'}`,
//     });
//   } catch (error: any) {
//     error.status = 404;
//     next(error);
//   }
// };
