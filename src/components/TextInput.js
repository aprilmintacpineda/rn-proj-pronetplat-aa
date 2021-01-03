import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { HelperText, TextInput as RNPTextInput } from 'react-native-paper';
import Caption from './Caption';

const propsBasedOnTypes = {
  code: {
    textContentType: 'oneTimeCode',
    autoCapitalize: 'none',
    autoCorrect: false
  },
  password: {
    secureTextEntry: true,
    autoCapitalize: 'none',
    autoCorrect: false,
    autoCompleteType: 'password',
    textContentType: 'password'
  },
  email: {
    autoCapitalize: 'none',
    autoCorrect: false,
    autoCompleteType: 'email',
    keyboardType: 'email-address',
    textContentType: 'emailAddress'
  },
  givenName: {
    autoCapitalize: 'words',
    autoCorrect: false,
    autoCompleteType: 'name',
    keyboardType: 'default',
    textContentType: 'givenName'
  },
  middleName: {
    autoCapitalize: 'words',
    autoCorrect: false,
    autoCompleteType: 'name',
    keyboardType: 'default',
    textContentType: 'middleName'
  },
  surname: {
    autoCapitalize: 'words',
    autoCorrect: false,
    autoCompleteType: 'name',
    keyboardType: 'default',
    textContentType: 'familyName'
  }
};

function TextInput ({
  error,
  style,
  type,
  onPress = null,
  onChangeText,
  disabled,
  displayCharsRemaining = false,
  maxLength = null,
  value,
  helperText,
  multiline,
  numberOfLines,
  ..._textInputProps
}) {
  const hasError = Boolean(error);

  const propsBasedOnType = propsBasedOnTypes[type] || {};

  const textInputProps = {
    ...propsBasedOnType,
    ..._textInputProps
  };

  const onFocus = React.useCallback(() => {
    const shouldClearText = type === 'password';
    if (shouldClearText) onChangeText('');
  }, [type, onChangeText]);

  return (
    <View>
      <View style={{ position: 'relative' }}>
        <RNPTextInput
          error={hasError}
          mode="outlined"
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            {
              backgroundColor: '#fff',
              maxHeight: multiline ? 20 * numberOfLines : undefined
            },
            style
          ]}
          editable={!onPress}
          onFocus={onFocus}
          onChangeText={onChangeText}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          {...textInputProps}
        />
        {!disabled && onPress && (
          <TouchableWithoutFeedback onPress={onPress}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1
              }}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
      {helperText && <Caption>{helperText}</Caption>}
      {displayCharsRemaining && maxLength &&
        <Caption>{maxLength - value.length} character(s) remaining</Caption>
      }
      <HelperText type="error" visible={hasError}>
        {error}
      </HelperText>
    </View>
  );
}

export default React.memo(TextInput);
