import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { FlatList } from 'react-native';
import { Paragraph, Text, Title } from 'react-native-paper';
import Row from './Row';
import CenteredSurface from 'components/CenteredSurface';
import ListItemSeparator from 'components/ListItemSeparator';

function mapStates ({ pendingConnections }) {
  return { pendingConnections };
}

function renderRow ({ item, index }) {
  return <Row {...item} index={index} />;
}

function keyExtractor ({ id }) {
  return id;
}

function PendingConnections () {
  const { pendingConnections } = useFluxibleStore(mapStates);

  if (!pendingConnections.length) {
    return (
      <CenteredSurface>
        <Title>No pending connections.</Title>
        <Text style={{ marginBottom: 10 }}>
          When you scan the QR code of your network, they will appear here and {'you\'ll'}{' '}
          see the results real-time.
        </Text>
        <Paragraph>
          <Text style={{ fontWeight: 'bold' }}>No internet? </Text>
          <Text>
            You can scan the QR code of your network even when you {'don\'t'} have
            internet, they will appear here and when you connect to the internet, the app
            will automatically process them.
          </Text>
        </Paragraph>
        <Paragraph>
          <Text style={{ fontWeight: 'bold' }}>Have many QRs to scan? </Text>
          <Text>
            You can fast scan QR codes. Simple point the camera on the QR code one after
            the other.
          </Text>
        </Paragraph>
      </CenteredSurface>
    );
  }

  return (
    <FlatList
      data={pendingConnections}
      renderItem={renderRow}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ListItemSeparator}
    />
  );
}

export default React.memo(PendingConnections);
