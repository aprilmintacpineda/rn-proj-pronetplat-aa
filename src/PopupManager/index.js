import React from 'react';
import ModalPopup from './ModalPopup';
import NotificationPopup from './NotificationPopup';

function PopupManager () {
  return (
    <>
      <ModalPopup />
      <NotificationPopup />
    </>
  );
}

export default React.memo(PopupManager);
