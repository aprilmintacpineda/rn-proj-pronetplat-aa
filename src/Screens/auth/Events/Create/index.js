import { emitEvent } from 'fluxible-js';
import React from 'react';
import CreateEventForm from './CreateEventForm';
import { navigationRef } from 'App';
import FormWithContext from 'components/FormWithContext';
import { showSuccessPopup } from 'fluxible/actions/popup';
import validate from 'libs/validate';
import { uploadFileToSignedUrl, waitForPicture } from 'libs/xhr';

const formOptions = {
  initialFormValues: {
    coverPicture: null,
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
    coverPicture: ({ coverPicture }) =>
      validate(coverPicture, ['required']),
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
  transformInput: ({
    formValues: { organizers, coverPicture, ...formValues }
  }) => ({
    ...formValues,
    coverPicture: coverPicture.type,
    organizers: organizers.map(user => user.id)
  }),
  onSubmitSuccess: async ({
    responseData: { signedUrl, coverPicture },
    formValues: { coverPicture: file }
  }) => {
    await uploadFileToSignedUrl({ signedUrl, file });
    await waitForPicture(coverPicture);

    showSuccessPopup({
      message:
        'Event has been created. Please publish the event when you have finalized it.'
    });

    emitEvent('eventCreated');
    navigationRef.current.goBack();
  },
  endPoint: '/event',
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
