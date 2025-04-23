export type ControllerType = {
  [key: string]: (...args: any[]) => any;
};

export type MailData = {
  guestEmail: string;
  guestName: string;
  eventName: string;
  duration: number;
  date: string;
  hostEmail: string;
  name: string;
  bookTime: string;
  reschedule: boolean;
  rescheduleReason: string;
  email: string;
  formattedDate: string;
};
