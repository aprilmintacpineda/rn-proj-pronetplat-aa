import { format } from 'date-fns';

const validationRules = {
  alphanumeric (value) {
    if (/[^a-zA-Z0-9_]/.test(value))
      return 'Only alphabets, numbers, and underscores are allowed.';
    return '';
  },
  email (value) {
    if (
      value.length > 320 ||
      // eslint-disable-next-line
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      )
    )
      return 'Invalid email.';

    return '';
  },
  url (value) {
    if (/^http:\/\//.test(value)) return 'Always use HTTPS.';
    if (value.length > 255) return 'Use shorter url';

    if (
      // eslint-disable-next-line
      !/(?:(?:http|https):\/\/)?([-a-zA-Z0-9.]{2,256}\.[a-z]{2,10})\b(?:\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gim.test(
        value
      )
    )
      return 'invalid url';

    return '';
  },
  contactOther (value) {
    if (!this.email(value) || !this.url(value))
      return 'That seems to be inappropriate for the selected type.';

    return '';
  },
  required (value) {
    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    )
      return 'Required.';

    return '';
  },
  maxLength (value, [max]) {
    if (value.length > max)
      return `Should be less than ${max} characters.`;
    return '';
  },
  password (value) {
    const minLength = 8;
    const maxLength = 30;

    if ((value.match(/[0-9]/gm) || []).length < 2)
      return 'Password must contain at least 2 numbers.';
    if ((value.match(/[a-z]/gm) || []).length < 2)
      return 'Password must contain at least 2 small letters.';
    if ((value.match(/[A-Z]/gm) || []).length < 2)
      return 'Password must contain at least 2 capital letters.';
    if (value.length < minLength || value.length > maxLength)
      return `Password should be ${minLength} to ${maxLength} characters.`;

    if (
      (
        value.match(
          /[\s\!@#$%^&*()_\-\+=\{\}\[\]|\\;:"'<>?,.\/]/gm // eslint-disable-line
        ) || []
      ).length < 2
    )
      return 'Password must contain at least 2 special characters; !@#$%^&*()_+-={}|[]\\:";\'<>?,./';

    return '';
  },
  options (value, options) {
    if (value.constructor === Array) {
      if (value.find(val => !options.includes(val)))
        return 'Please select from the options.';
    } else if (!options.includes(value)) {
      return 'Please select from the options.';
    }

    return '';
  },
  matches (value, [payload, fieldName]) {
    if (value !== payload) return `${fieldName} must match.`;
    return '';
  },
  bool (value) {
    if (value !== true && value !== false) return 'Invalid.';
    return '';
  },
  integer (value) {
    if (/[^0-9]/gim.test(value)) return 'Must be an integer.';
    return '';
  },
  futureDate (value, [relativeTo, label] = []) {
    const date = new Date(value);

    if (date.toString() === 'Invalid Date') return 'Invalid date.';

    const relativeDate = relativeTo
      ? new Date(unescape(relativeTo))
      : new Date();

    if (date <= relativeDate) {
      return `Must be after ${
        label
          ? `the ${label}`
          : format(new Date(relativeDate), "MMMM d, Y 'at' p")
      }`;
    }

    return '';
  }
};

function validate (value, rules) {
  const isOptional = !rules.includes('required');
  if (validationRules.required(value) && isOptional) return;

  const numRules = rules.length;

  for (let a = 0; a < numRules; a++) {
    let rule = rules[a];
    let payload = [];

    const hasParameters = rule.includes(':');
    if (hasParameters) {
      const [_rule, _payload] = rule.split(':');
      rule = _rule;
      payload = _payload.split(',');
    }

    const error = validationRules[rule](value, payload);
    if (error) return error;
  }

  return '';
}

export default validate;
