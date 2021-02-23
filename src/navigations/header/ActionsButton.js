import React from 'react';
import { Appbar } from 'react-native-paper';
import Menu from 'components/Menu';

function ActionsButton ({ actions }) {
  if (!actions.length) return null;
  return <Menu IconComponent={Appbar.Action} menus={actions} />;
}

export default React.memo(ActionsButton);
