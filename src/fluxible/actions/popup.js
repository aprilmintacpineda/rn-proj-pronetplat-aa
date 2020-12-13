import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import AnimatedSuccessIcon from 'components/AnimatedSuccessIcon';

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
      <Text style={{ marginTop: 20, textAlign: 'center' }}>{message}</Text>
    </View>
  );
}
