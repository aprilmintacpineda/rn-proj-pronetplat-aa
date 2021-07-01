import React from 'react';
import Options from './Options';
import Modalize from 'components/Modalize';
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
  capitalize = true,
  ...textInputProps
}) {
  const modalizeRef = React.useRef();

  const openModal = React.useCallback(() => {
    modalizeRef.current.open();
  }, []);

  const closeModal = React.useCallback(() => {
    modalizeRef.current.close();
  }, []);

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
        value={
          value
            ? labelUpperCase
              ? value.toUpperCase()
              : capitalize
              ? camelToTitleCase(value)
              : value
            : null
        }
        error={error}
        label={label}
        disabled={disabled}
        {...textInputProps}
        onPress={openModal}
      />
      <Modalize ref={modalizeRef}>
        <Options
          capitalize={capitalize}
          labelUpperCase={labelUpperCase}
          options={options}
          onChange={handleChange}
          value={value}
        />
      </Modalize>
    </>
  );
}

export default React.memo(SelectOptions);
