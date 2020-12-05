import React from 'react';
import { useNavigation } from '@react-navigation/native';

import TouchableButton from './TouchableButton';

function TouchableButtonLink ({ to, params = null, children }) {
  const { navigate } = useNavigation();

  const onPress = React.useCallback(() => {
    navigate(to, params);
  }, [to, params, navigate]);

  return <TouchableButton onPress={onPress}>{children}</TouchableButton>;
}

export default React.memo(TouchableButtonLink);
