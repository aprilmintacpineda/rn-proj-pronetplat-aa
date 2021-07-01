export function capitalize (value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function camelToTitleCase (value) {
  return String(value)
    .replace(/([A-Z])/g, '_$1')
    .split('_')
    .reduce((accumulator, current) => {
      if (accumulator) accumulator += ' ';
      accumulator += capitalize(current);
      return accumulator;
    }, '');
}

export function shortenStr (str, maxLen) {
  if (str.length < maxLen) return str;
  return str.substr(0, maxLen) + '...';
}
