import { store, updateStore } from 'fluxible-js';
import React from 'react';
import ChangePersonalInfoForm from './ChangePersonalInfoForm';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: () => ({
    firstName: store.authUser.firstName,
    middleName: store.authUser.middleName,
    surname: store.authUser.surname,
    gender: store.authUser.gender,
    jobTitle: store.authUser.jobTitle,
    company: store.authUser.company,
    bio: store.authUser.bio
  }),
  validators: {
    firstName: ({ firstName }) =>
      validate(firstName, ['required', 'maxLength:50']),
    middleName: ({ middleName }) =>
      validate(middleName, ['maxLength:50']),
    surname: ({ surname }) =>
      validate(surname, ['required', 'maxLength:50']),
    gender: ({ gender }) =>
      validate(gender, ['required', 'options:male,female']),
    jobTitle: ({ jobTitle }) =>
      validate(jobTitle, ['required', 'maxLength:50']),
    company: ({ company }) => validate(company, ['maxLength:50']),
    bio: ({ bio }) => validate(bio, ['maxLength:50'])
  },
  onSubmitSuccess: ({ responseData: { userData, authToken } }) => {
    showSuccessPopup({ message: 'Changes saved.' });
    updateStore({ authUser: userData, authToken });
  },
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
