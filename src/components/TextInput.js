import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import {
  HelperText,
  TextInput as RNPTextInput
} from 'react-native-paper';
import Caption from './Caption';

const propsBasedOnTypes = {
  code: {
    textContentType: 'oneTimeCode',
    autoCapitalize: 'none',
    autoCorrect: false
  },
  mobile: {
    autoCapitalize: 'none',
    autoCorrect: false,
    autoCompleteType: 'tel',
    keyboardType: 'phone-pad',
    textContentType: 'telephoneNumber'
  },
  telephone: {
    autoCapitalize: 'none',
    autoCorrect: false,
    autoCompleteType: 'tel',
    keyboardType: 'phone-pad',
    textContentType: 'telephoneNumber'
  },
  url: {
    autoCapitalize: 'none',
    autoCorrect: false,
    keyboardType: 'url',
    textContentType: 'URL'
  },
  website: {
    autoCapitalize: 'none',
    autoCorrect: false,
    keyboardType: 'url',
    textContentType: 'URL'
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
  },
  number: {
    autoCapitalize: 'none',
    autoCorrect: false,
    autoCompleteType: 'off',
    keyboardType: 'number-pad',
    textContentType: 'none'
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
  hideErrorMessageWhenEmpty = false,
  noErrorMessage = false,
  viewProps,
  ..._textInputProps
}) {
  const hasError = Boolean(error);

  const textInputProps = {
    ...(propsBasedOnTypes[type] || {}),
    ..._textInputProps
  };

  const onFocus = React.useCallback(() => {
    const shouldClearText = type === 'password';
    if (shouldClearText) onChangeText('');
  }, [type, onChangeText]);

  return (
    <View {...viewProps}>
      <View style={{ position: 'relative' }}>
        <RNPTextInput
          error={!noErrorMessage && hasError}
          mode="outlined"
          multiline={multiline}
          style={[
            {
              backgroundColor: '#fff'
            },
            style
          ]}
          editable={!onPress}
          onFocus={onFocus}
          onChangeText={onChangeText}
          disabled={disabled}
          maxLength={maxLength}
          value={String(value || '')}
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
      {displayCharsRemaining && maxLength && (
        <Caption>
          {maxLength - value.length} character(s) remaining
        </Caption>
      )}
      {!noErrorMessage &&
      (!hideErrorMessageWhenEmpty ||
        (hideErrorMessageWhenEmpty && hasError)) ? (
        <HelperText type="error" visible={hasError}>
          {error}
        </HelperText>
      ) : null}
    </View>
  );
}

export default React.memo(TextInput);
