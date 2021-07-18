import React from 'react';
import DefaultTriggerComponent from './TriggerComponent';
import { FormContext } from 'components/FormWithContext';
import ImagePicker from 'components/ImagePicker';
import ResponsiveImageView from 'components/ResponsiveImageView';

function FormImagePicker ({
  field,
  triggerComponentProps,
  TriggerComponent = DefaultTriggerComponent,
  aspectRatio
}) {
  const { formValues, formErrors, disabled, onChangeHandlers } =
    React.useContext(FormContext);

  const error = formErrors[field];
  const value = formValues[field];
  const onChange = onChangeHandlers[field];

  return (
    <>
      {value && <ResponsiveImageView uri={value.uri} />}
      <ImagePicker
        TriggerComponent={TriggerComponent}
        triggerComponentProps={{
          disabled,
          hasError: Boolean(error),
          ...triggerComponentProps
        }}
        onSelect={onChange}
        error={error}
        aspectRatio={aspectRatio}
      />
    </>
  );
}

export default React.memo(FormImagePicker);
