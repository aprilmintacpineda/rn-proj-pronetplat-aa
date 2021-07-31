import NetInfo from '@react-native-community/netinfo';
import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import AnimatedErrorIcon from 'components/AnimatedErrorIcon';
import AnimatedSuccessIcon from 'components/AnimatedSuccessIcon';
import Button from 'components/Button';
import { paperTheme } from 'theme';

export function showPopup (body) {
  updateStore({
    popup: {
      shown: true,
      body
    }
  });
}

export function hidePopup () {
  updateStore({
    popup: {
      shown: false,
      body: store.popup.body
    }
  });
}

export function clearPopup () {
  updateStore({
    popup: {
      shown: false,
      body: null
    }
  });
}

export function showSuccessPopup ({ message }) {
  showPopup(
    <View style={{ margin: 20 }}>
      <AnimatedSuccessIcon size={100} />
      <Text style={{ marginTop: 20, textAlign: 'center' }}>
        {message}
      </Text>
    </View>
  );
}

export function showErrorPopup ({ message, buttons = null }) {
  showPopup(
    <View style={{ margin: 20 }}>
      <AnimatedErrorIcon size={100} />
      <Text style={{ marginTop: 20, textAlign: 'center' }}>
        {message}
      </Text>
      {buttons && (
        <View style={{ marginTop: 20 }}>
          {buttons.map(({ label, ...btnProps }, i) => (
            <Button key={`${label}-${i}`} {...btnProps}>
              {label}
            </Button>
          ))}
        </View>
      )}
    </View>
  );
}

export async function showRequestFailedPopup ({
  message,
  ...errorPopupArgs
} = {}) {
  const { isConnected, isInternetReachable } = await NetInfo.fetch();

  if (!isConnected || !isInternetReachable) {
    showErrorPopup({
      message:
        'Could not connect. Please check your internet connection.'
    });
  } else {
    showErrorPopup({
      message:
        message || 'Could not process your request at this time.',
      ...errorPopupArgs
    });
  }
}

let toastId = 0;
export function toast (params) {
  toastId++;
  const id = toastId;

  updateStore({
    toasts: store.toasts.concat({
      ...params,
      hasExpired: false,
      id
    })
  });

  return id;
}

export function updateOrCreateToast ({ id, ...params }) {
  let wasFound = false;
  const toasts = store.toasts.map(toast => {
    if (toast.id === id) {
      wasFound = true;

      return {
        ...toast,
        ...params,
        updateCount: (toast.updateCount || 0) + 1
      };
    }

    return toast;
  });

  if (wasFound) {
    updateStore({ toasts });
    return id;
  }

  return toast(params);
}

export function showConfirmDialog ({
  message,
  onConfirm,
  onCancel,
  isDestructive
}) {
  showPopup(
    <View style={{ margin: 20 }}>
      <Text style={{ marginTop: 20, textAlign: 'center' }}>
        {message}
      </Text>
      <View style={{ marginTop: 20 }}>
        <Button
          mode="contained"
          color={
            isDestructive
              ? paperTheme.colors.error
              : paperTheme.colors.primary
          }
          onPress={() => {
            hidePopup();
            if (onConfirm) onConfirm();
          }}
          style={{ marginBottom: 10 }}
        >
          Yes
        </Button>
        <Button
          mode="outlined"
          color={paperTheme.colors.primary}
          onPress={() => {
            hidePopup();
            if (onCancel) onCancel();
          }}
        >
          No
        </Button>
      </View>
    </View>
  );
}

export function unknownErrorPopup () {
  showErrorPopup({
    message: 'An unknown error occured. Please try again.'
  });
}
