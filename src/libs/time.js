import { format, isToday } from 'date-fns';

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const hours = Array.from(Array(12), (_, index) =>
  (index + 1).toString().padStart(2, '0')
);

export const minutes = Array.from(Array(60), (_, index) =>
  index.toString().padStart(2, '0')
);

export const anteMeridiem = ['am', 'pm'];

export const monthsIndexes = months.reduce(
  (accumulator, current, index) => ({
    ...accumulator,
    [current]: index
  }),
  {}
);

export const monthsCsv = months.join(',');

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
