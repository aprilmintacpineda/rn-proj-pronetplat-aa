import React from 'react';
import { Keyboard, View } from 'react-native';

function KeyboardAvoidingView ({ children }) {
  const [paddingBottom, setPaddingBottom] = React.useState(0);

  React.useEffect(() => {
    function keyboardWillShow (ev) {
      setPaddingBottom(ev.endCoordinates.height);
    }

    function keyboardWillHide () {
      setPaddingBottom(0);
    }

    Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      Keyboard.removeListener('keyboardWillShow', keyboardWillShow);
      Keyboard.removeListener('keyboardWillHide', keyboardWillHide);
    };
  }, []);

  return <View style={{ flex: 1, paddingBottom }}>{children}</View>;
}

export default React.memo(KeyboardAvoidingView);
