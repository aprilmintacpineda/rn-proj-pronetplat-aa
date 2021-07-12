import React from 'react';
import CreateEventForm from './CreateEventForm';
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
    organizers: [],
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
    endDateTime: ({ endDateTime, startDateTime }) =>
      validate(endDateTime, [
        'required',
        `futureDate:${escape(
          startDateTime.toISOString()
        )},start date time`
      ]),
    location: ({ location }) => validate(location, ['required']),
    visibility: ({ visibility }) =>
      validate(visibility, ['required', 'options:private,public']),
    maxAttendees: ({ maxAttendees }) =>
      validate(maxAttendees, ['required', 'integer'])
  },
  validatorChains: {
    startDateTime: ['endDateTime']
  },
  onSubmitSuccess: () => {
    showSuccessPopup({
      message: 'You have successfully changed your password.'
    });

    navigationRef.current.goBack();
  },
  endPoint: '/create-event',
  ignoreResponse: true,
  stayDisabledOnSuccess: true
};

function CreateEvent () {
  return (
    <FormWithContext formOptions={formOptions}>
      <CreateEventForm />
    </FormWithContext>
  );
}

export default React.memo(CreateEvent);
