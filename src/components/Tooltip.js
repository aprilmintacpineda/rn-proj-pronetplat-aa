import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import RNTooltip from 'react-native-walkthrough-tooltip';

function Tooltip ({ content, children, placement = 'top' }) {
  const [isVisible, setIsVisible] = React.useState(false);

  const close = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  const open = React.useCallback(() => {
    setIsVisible(true);
  }, []);

  return (
    <RNTooltip
      isVisible={isVisible}
      content={content}
      placement={placement}
      onClose={close}
    >
      <TouchableWithoutFeedback onPress={open}>
        <View>{children}</View>
      </TouchableWithoutFeedback>
    </RNTooltip>
  );
}

export default React.memo(Tooltip);
