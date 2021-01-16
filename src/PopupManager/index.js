import React from 'react';
import ModalPopup from './ModalPopup';
import NotificationPopup from './NotificationPopup';
import ToastPopup from './ToastPopup';

function PopupManager () {
  return (
    <>
      <ModalPopup />
      <NotificationPopup />
      <ToastPopup />
    </>
  );
}

export default React.memo(PopupManager);
