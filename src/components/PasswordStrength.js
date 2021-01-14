import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HelperText, DefaultTheme } from 'react-native-paper';
import RNVectorIcon from './RNVectorIcon';

const errorColor = DefaultTheme.colors.error;

const styles = StyleSheet.create({
  condition: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelValid: {
    paddingLeft: 5,
    color: 'green'
  },
  labelInvalid: {
    paddingLeft: 5,
    color: errorColor
  }
});

function Condition ({ isValid, label }) {
  if (isValid) {
    return (
      <View style={styles.condition}>
        <RNVectorIcon
          provider="Ionicons"
          name="checkmark-circle"
          size={15}
          color="green"
        />
        <HelperText style={styles.labelValid}>{label}</HelperText>
      </View>
    );
  }

  return (
    <View style={styles.condition}>
      <RNVectorIcon
        provider="Ionicons"
        name="close-circle"
        size={15}
        color={errorColor}
      />
      <HelperText style={styles.labelInvalid}>{label}</HelperText>
    </View>
  );
}

function PasswordStrength ({ value }) {
  const minLength = 8;
  const maxLength = 30;

  const isWithinLen =
    value.length >= minLength && value.length <= maxLength;
  const hasNumbers = (value.match(/[0-9]/gm) || []).length >= 2;
  const hasSmallLetters = (value.match(/[a-z]/gm) || []).length >= 2;
  const hasCapLetters = (value.match(/[A-Z]/gm) || []).length >= 2;
  const hasSpecialChars =
    (
      value.match(
        /[\s\!@#$%^&*()_\-\+=\{\}\[\]|\\;:"'<>?,.\/]/gm // eslint-disable-line
      ) || []
    ).length >= 2;

  const specialChars = '!@#$%^&*()_+-={}|[]\\:";\'<>?,./';

  return (
    <View>
      <Condition
        isValid={isWithinLen}
        label={`Must be ${minLength} to ${maxLength} characters long`}
      />
      <Condition
        isValid={hasNumbers}
        label="Must contain at least 2 numbers."
      />
      <Condition
        isValid={hasSmallLetters}
        label="Must contain at least 2 small letters."
      />
      <Condition
        isValid={hasCapLetters}
        label="Must contain at least 2 capital letters."
      />
      <Condition
        isValid={hasSpecialChars}
        label={`Must contain at least 2 special characters; ${specialChars}`}
      />
    </View>
  );
}

export default React.memo(PasswordStrength);
