import React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import ResetPassword from './ResetPassword';
import SendResetCode from './SendResetCode';

function ForgotPassword () {
  const { width } = useWindowDimensions();
  const scrollViewRef = React.useRef();
  const [email, setEmail] = React.useState('');

  const scrollTo = React.useCallback(
    page => {
      scrollViewRef.current.scrollTo({
        x: page * width,
        animated: true
      });
    },
    [width]
  );

  const onResetCodeSent = React.useCallback(
    email => {
      scrollTo(1);
      setEmail(email);
    },
    [scrollTo]
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      decelerationRate="normal"
      scrollEnabled={false}
      contentOffset={{ x: 0 }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width }}>
          <SendResetCode onResetCodeSent={onResetCodeSent} />
        </View>
        <View style={{ width }}>
          <ResetPassword email={email} />
        </View>
      </View>
    </ScrollView>
  );
}

export default React.memo(ForgotPassword);
