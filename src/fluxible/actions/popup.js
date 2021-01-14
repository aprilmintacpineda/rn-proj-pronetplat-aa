import NetInfo from '@react-native-community/netinfo';
import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import AnimatedErrorIcon from 'components/AnimatedErrorIcon';
import AnimatedSuccessIcon from 'components/AnimatedSuccessIcon';
import Button from 'components/Button';

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
  message = 'An unknown error occured, please try again.'
} = {}) {
  const { isConnected, isInternetReachable } = await NetInfo.fetch();

  if (!isConnected || !isInternetReachable) {
    showErrorPopup({
      message:
        'Could not connect. Please check your internet connection and try again.'
    });
  } else {
    showErrorPopup({ message });
  }
}
