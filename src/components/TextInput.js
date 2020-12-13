import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { HelperText, TextInput as RNPTextInput } from 'react-native-paper';

const propsBasedOnTypes = {
  password: {
    secureTextEntry: true,
    clearTextOnFocus: true,
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

function TextInput ({ error, style, type, onPress = null, ..._textInputProps }) {
  const hasError = Boolean(error);

  const propsBasedOnType = propsBasedOnTypes[type] || {};

  const textInputProps = {
    ...propsBasedOnType,
    ..._textInputProps
  };

  return (
    <View>
      <View style={{ position: 'relative' }}>
        <RNPTextInput
          error={hasError}
          mode="outlined"
          style={[{ backgroundColor: '#fff' }, style]}
          editable={!onPress}
          {...textInputProps}
        />
        {onPress && (
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
      <HelperText type="error" visible={hasError}>
        {error}
      </HelperText>
    </View>
  );
}

export default React.memo(TextInput);
