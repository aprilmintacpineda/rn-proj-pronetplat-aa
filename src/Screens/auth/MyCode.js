import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import CenteredSurface from 'components/CenteredSurface';

function MyCode () {
  const { width } = useWindowDimensions();

  return (
    <CenteredSurface containerStyle={{ alignItems: 'center' }}>
      <QRCode value="12313123" size={width * 0.7} />
      <Text style={{ textAlign: 'center', marginTop: 30 }}>
        Tell your peers and network to scan the QR code above using their Connect Express
        account.
      </Text>
    </CenteredSurface>
  );
}

export default React.memo(MyCode);
