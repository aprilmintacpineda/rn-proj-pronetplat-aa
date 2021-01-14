import {
  Text as RNText,
  TextInput as RNTextInput
} from 'react-native';
import { Text, Caption, TextInput } from 'react-native-paper';

const maxFontSizeMultiplier = 1.5;
const allowFontScaling = true;

Text.defaultProps = {
  ...Text.defaultProps,
  maxFontSizeMultiplier,
  allowFontScaling
};

Caption.defaultProps = {
  ...Caption.defaultProps,
  maxFontSizeMultiplier,
  allowFontScaling
};

TextInput.defaultProps = {
  ...TextInput.defaultProps,
  maxFontSizeMultiplier,
  allowFontScaling
};

RNTextInput.defaultProps = {
  ...RNTextInput.defaultProps,
  maxFontSizeMultiplier,
  allowFontScaling
};

RNText.defaultProps = {
  ...RNText.defaultProps,
  maxFontSizeMultiplier,
  allowFontScaling
};
