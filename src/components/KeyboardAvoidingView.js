import React from 'react';
import { Keyboard, View } from 'react-native';

function KeyboardAvoidingView ({ children }) {
  const [paddingBottom, setPaddingBottom] = React.useState(0);

  React.useEffect(() => {
    const removeWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      ev => {
        setPaddingBottom(ev.endCoordinates.height);
      }
    );

    const removeWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setPaddingBottom(0);
      }
    );

    return () => {
      removeWillShowListener();
      removeWillHideListener();
    };
  }, []);

  return <View style={{ flex: 1, paddingBottom }}>{children}</View>;
}

export default React.memo(KeyboardAvoidingView);
