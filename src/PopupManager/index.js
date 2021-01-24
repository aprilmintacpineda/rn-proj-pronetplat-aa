import React from 'react';
import LoadingOverlay from './LoadingOverlay';
import ModalPopup from './ModalPopup';
import NotificationPopup from './NotificationPopup';
import ToastPopup from './ToastPopup';

function PopupManager () {
  return (
    <>
      <ModalPopup />
      <NotificationPopup />
      <ToastPopup />
      <LoadingOverlay />
    </>
  );
}

export default React.memo(PopupManager);
