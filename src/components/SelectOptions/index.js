import React from 'react';
import { View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-paper';
import Options from './Options';
import TextInput from 'components/TextInput';
import { camelToTitleCase } from 'libs/strings';

function SelectOptions ({
  options,
  labelSuffix,
  disabled,
  onChange,
  value,
  error,
  label,
  labelUpperCase = false,
  ...textInputProps
}) {
  const modalizeRef = React.useRef();

  const openModal = React.useCallback(() => {
    modalizeRef.current.open();
  }, []);

  const closeModal = React.useCallback(() => {
    modalizeRef.current.close();
  }, []);

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
        disabled={disabled}
        {...textInputProps}
        onPress={openModal}
      />
      <Portal>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight
          handlePosition="inside"
        >
          <View style={{ margin: 20, marginTop: 40 }}>
            <Options
              labelUpperCase={labelUpperCase}
              options={options}
              onChange={handleChange}
              value={value}
            />
          </View>
        </Modalize>
      </Portal>
    </>
  );
}

export default React.memo(SelectOptions);
