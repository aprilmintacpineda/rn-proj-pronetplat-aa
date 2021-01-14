import { updateStore } from 'fluxible-js';
import React from 'react';
import ChangePersonalInfoForm from './ChangePersonalInfoForm';
import FormWithContext from 'components/FormWithContext';
import { showRequestFailedPopup } from 'fluxible/actions/popup';
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
      validate(firstName, ['required', 'maxLength:255']),
    middleName: ({ middleName }) =>
      validate(middleName, ['maxLength:255']),
    surname: ({ surname }) =>
      validate(surname, ['required', 'maxLength:255']),
    gender: ({ gender }) =>
      validate(gender, ['required', 'options:male,female']),
    jobTitle: ({ jobTitle }) =>
      validate(jobTitle, ['required', 'maxLength:255']),
    company: ({ company }) => validate(company, ['maxLength:255']),
    bio: ({ bio }) => validate(bio, ['maxLength:255'])
  },
  onSubmitError: showRequestFailedPopup,
  onSubmitSuccess: ({ responseData: { authUser, authToken } }) => {
    updateStore({ authUser, authToken });
  },
  stayDisabledOnSuccess: true,
  endPoint: '/change-personal-info'
};

function ChangePersonalInfo (props) {
  return (
    <FormWithContext formOptions={formOptions}>
      <ChangePersonalInfoForm {...props} />
    </FormWithContext>
  );
}

export default React.memo(ChangePersonalInfo);
