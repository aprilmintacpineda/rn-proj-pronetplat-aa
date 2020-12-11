import React from 'react';
import { View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-paper';
import Options from './Options';

import { FormContext } from 'components/FormWithContext/index';
import TextInput from 'components/TextInput';
import { camelToTitleCase } from 'libs/strings';

function SelectOptions ({ field, options, labelSuffix, ...textInputProps }) {
  const { onChangeHandlers, formValues, formErrors } = React.useContext(FormContext);
  const modalizeRef = React.useRef();

  const openModal = React.useCallback(() => {
    modalizeRef.current.open();
  }, []);

  const closeModal = React.useCallback(() => {
    modalizeRef.current.close();
  }, []);

  const value = formValues[field];
  const error = formErrors[field];
  const onChange = onChangeHandlers[field];
  let label = camelToTitleCase(field);
  const displayValue = camelToTitleCase(value);

  const handleChange = React.useCallback(
    newValue => {
      closeModal();
      onChange(newValue);
    },
    [onChange, closeModal]
  );

  if (labelSuffix) label += ` ${labelSuffix}`;

  return (
    <>
      <TextInput
        value={displayValue}
        error={error}
        label={label}
        {...textInputProps}
        onPress={openModal}
      />
      <Portal>
        <Modalize ref={modalizeRef} adjustToContentHeight handlePosition="inside">
          <View style={{ margin: 20, marginTop: 40 }}>
            <Options options={options} onChange={handleChange} value={value} />
          </View>
        </Modalize>
      </Portal>
    </>
  );
}

export default React.memo(SelectOptions);
