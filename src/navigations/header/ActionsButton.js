import React from 'react';
import { Appbar, Menu } from 'react-native-paper';
import RNVectorIcon from 'components/RNVectorIcon';

function menuIcon (props) {
  return (
    <RNVectorIcon
      provider="Feather"
      name="more-vertical"
      {...props}
    />
  );
}

function ActionsButton ({ actions }) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleActionMenu = React.useCallback(() => {
    setIsVisible(isVisible => !isVisible);
  }, []);

  return (
    <Menu
      visible={isVisible}
      onDismiss={toggleActionMenu}
      anchor={
        <Appbar.Action icon={menuIcon} onPress={toggleActionMenu} />
      }
    >
      {actions.map(({ onPress, ...menuItemProps }, index) => (
        <Menu.Item
          key={`label-${index}`}
          onPress={ev => {
            toggleActionMenu();
            onPress(ev);
          }}
          {...menuItemProps}
        />
      ))}
    </Menu>
  );
}

export default React.memo(ActionsButton);
