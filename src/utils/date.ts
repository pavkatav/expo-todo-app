import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  parseISO,
} from 'date-fns';

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return 'Today';
  }

  if (isTomorrow(date)) {
    return 'Tomorrow';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'MMM d, yyyy');
};

export const formatTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'h:mm a');
};

export const formatDateTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

export const isOverdue = (dateString: string): boolean => {
  const date = parseISO(dateString);
  return isPast(date) && !isToday(date);
};

export const createDateString = (date: Date): string => {
  return date.toISOString();
};
