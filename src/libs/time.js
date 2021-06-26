import { format, isToday } from 'date-fns';

export function sleep (seconds) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export function formatDate (dateStr) {
  const date = new Date(dateStr);

  return isToday(date)
    ? `Today, ${format(date, 'p')}`
    : format(date, 'PPp');
}
