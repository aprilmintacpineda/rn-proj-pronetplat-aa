import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { SafeAreaView } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { clearPopup } from 'fluxible/actions/popup';

function mapStates ({ popup }) {
  return { popup };
}

function PopupManager () {
  const modalRef = React.useRef();
  const { popup } = useFluxibleStore(mapStates);
  const { shown, body } = popup;

  React.useEffect(() => {
    if (shown) modalRef.current.open();
    else if (!shown && body) modalRef.current.close();
  }, [shown, body]);

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        onClosed={clearPopup}
        adjustToContentHeight
        handlePosition
      >
        <SafeAreaView>{body}</SafeAreaView>
      </Modalize>
    </Portal>
  );
}

export default React.memo(PopupManager);
