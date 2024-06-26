import React from 'react';
import { Menu as RNPMenu, IconButton } from 'react-native-paper';
import RNVectorIcon from './RNVectorIcon';
import { paperTheme } from 'theme';

function menuIcon (props) {
  return (
    <RNVectorIcon
      provider="Feather"
      name="more-horizontal"
      {...props}
    />
  );
}

function Menu ({
  menus,
  IconComponent = IconButton,
  size,
  disabled,
  color = paperTheme.colors.accent
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleActionMenu = React.useCallback(() => {
    setIsOpen(isOpen => !isOpen);
  }, []);

  return (
    <RNPMenu
      visible={isOpen}
      onDismiss={toggleActionMenu}
      anchor={
        <IconComponent
          size={size}
          icon={menuIcon}
          onPress={toggleActionMenu}
          disabled={disabled}
          color={color}
        />
      }
    >
      {menus.map(({ onPress, title, ...menuItemProps }, index) => (
        <RNPMenu.Item
          key={`${title}-${index}`}
          onPress={ev => {
            toggleActionMenu();
            onPress(ev);
          }}
          title={title}
          {...menuItemProps}
        />
      ))}
    </RNPMenu>
  );
}

export default React.memo(Menu);
