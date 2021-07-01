import React from 'react';
import CreateEventForm from './CreateEventForm';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';

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
    webhookEndpoint: '',
    category: '',
    topic: '',
    subtopic: ''
  },
  validators: {},
  onSubmitSuccess: () => {
    showSuccessPopup({
      message: 'You have successfully changed your password.'
    });
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
