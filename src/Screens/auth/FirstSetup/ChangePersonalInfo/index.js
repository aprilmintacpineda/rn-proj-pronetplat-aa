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
    gender: ''
  },
  validators: {
    firstName: ({ firstName }) => validate(firstName, ['required', 'maxLength:255']),
    middleName: ({ middleName }) => validate(middleName, ['maxLength:255']),
    surname: ({ surname }) => validate(surname, ['required', 'maxLength:255']),
    gender: ({ gender }) => validate(gender, ['required', 'options:male,female'])
  },
  onSubmitError: showRequestFailedPopup,
  onSubmitSuccess: ({ responseData: { authUser, authToken } }) => {
    console.log(authUser, authToken);
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
