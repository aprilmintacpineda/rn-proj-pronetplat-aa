import contactDetails from './_get/contactDetails';
import contacts from './_get/contacts';

export default {
  _post: [],
  _get: [
    {
      isMatch: path => /^\/?contacts\/?(\?page=[0-9])?$/gim.test(path),
      handler: contacts
    },
    {
      isMatch: path => /^\/?contacts\/[0-9]\/?$/gim.test(path),
      handler: contactDetails
    }
  ],
  _put: [],
  _delete: []
};
