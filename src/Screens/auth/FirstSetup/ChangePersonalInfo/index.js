import { updateStore } from 'fluxible-js';
import React from 'react';
import ChangePersonalInfoForm from './ChangePersonalInfoForm';
import FormWithContext from 'components/FormWithContext';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    firstName: '',
    middleName: '',
    surname: '',
    gender: '',
    jobTitle: '',
    company: '',
    bio: ''
  },
  validators: {
    firstName: ({ firstName }) =>
      validate(firstName, ['required', 'maxLength:35']),
    middleName: ({ middleName }) =>
      validate(middleName, ['maxLength:35']),
    surname: ({ surname }) =>
      validate(surname, ['required', 'maxLength:35']),
    gender: ({ gender }) =>
      validate(gender, ['required', 'options:male,female']),
    jobTitle: ({ jobTitle }) =>
      validate(jobTitle, ['required', 'maxLength:35']),
    company: ({ company }) => validate(company, ['maxLength:35']),
    bio: ({ bio }) => validate(bio, ['maxLength:35'])
  },
  onSubmitSuccess: ({ responseData: { userData, authToken } }) => {
    updateStore({ authUser: userData, authToken });
  },
  stayDisabledOnSuccess: true,
  endPoint: 'change-personal-info'
};

function ChangePersonalInfo (props) {
  return (
    <FormWithContext formOptions={formOptions}>
      <ChangePersonalInfoForm {...props} />
    </FormWithContext>
  );
}

export default React.memo(ChangePersonalInfo);
