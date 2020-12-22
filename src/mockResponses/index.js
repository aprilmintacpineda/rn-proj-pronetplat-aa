import contactDetails from './_get/contactDetails';
import contacts from './_get/contacts';
import contactsPage2 from './_get/contactsPage2';
import forgotPassword from './_post/forgotPassword';
import login from './_post/login';
import resetPassword from './_post/resetPassword';
import verifyEmail from './_post/verifyEmail';

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
      isMatch: path => /^\/?login$/gim.test(path),
      handler: login
    },
    {
      isMatch: path => /^\/?verify-email$/gim.test(path),
      handler: verifyEmail
    }
  ],
  _get: [
    {
      isMatch: path => /^\/?contacts\/?$/gim.test(path),
      handler: contacts
    },
    {
      isMatch: path => /^\/?contacts\/?\?nextToken=([a-zA-Z0-9]+)$/gim.test(path),
      handler: contactsPage2
    },
    {
      isMatch: path => /^\/?contacts\/[0-9]\/?$/gim.test(path),
      handler: contactDetails
    }
  ],
  _put: [],
  _delete: []
};
