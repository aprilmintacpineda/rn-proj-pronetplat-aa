import { emitEvent } from 'fluxible-js';
import React from 'react';
import EditEventDetailsForm from './EditEventDetailsForm';
import { navigationRef } from 'App';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';
import validate from 'libs/validate';

const formOptions = {
  initialFormValues: {
    name: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    visibility: '',
    maxAttendees: '',
    organization: '',
    category: '',
    topic: '',
    subtopic: ''
  },
  validators: {
    name: ({ name }) =>
      validate(name, ['required', 'maxLength:100']),
    description: ({ description }) =>
      validate(description, ['required', 'maxLength:5000']),
    startDateTime: ({ startDateTime }) =>
      validate(startDateTime, ['required', 'futureDate']),
    endDateTime: ({ endDateTime, startDateTime }) => {
      if (!startDateTime) return 'Select start date and time.';

      return validate(endDateTime, [
        'required',
        `futureDate:${escape(
          startDateTime.toISOString()
        )},start date time`
      ]);
    },
    location: ({ location }) => validate(location, ['required']),
    visibility: ({ visibility }) =>
      validate(visibility, ['required', 'options:private,public']),
    maxAttendees: ({ maxAttendees }) =>
      validate(maxAttendees, ['required', 'integer'])
  },
  validatorChains: {
    startDateTime: ['endDateTime']
  },
  onSubmitSuccess: async ({ responseData }) => {
    showSuccessPopup({
      message: 'Changes have been saved.'
    });

    emitEvent('editedEventData', responseData);
    navigationRef.current.goBack();
  },
  endPoint: '/event/:targetId',
  stayDisabledOnSuccess: true
};

function EditEventDetails () {
  return (
    <FormWithContext formOptions={formOptions}>
      <EditEventDetailsForm />
    </FormWithContext>
  );
}

export default React.memo(EditEventDetails);
