import contactDetails from './_get/contactDetails';
import contacts from './_get/contacts';
import forgotPassword from './_post/forgotPassword';
import register from './_post/register';
import resetPassword from './_post/resetPassword';

export default {
  _post: [
    {
      isMatch: path => /^\/?forgot-password$/gim.test(path),
      handler: forgotPassword
    },
    {
      isMatch: path => /^\/?reset-password$/gim.test(path),
      handler: resetPassword
    },
    {
      isMatch: path => /^\/?register$/gim.test(path),
      handler: register
    }
  ],
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
