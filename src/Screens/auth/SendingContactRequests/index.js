import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { FlatList } from 'react-native';
import { Paragraph, Text, Title } from 'react-native-paper';
import Row from './Row';
import CenteredSurface from 'components/CenteredSurface';
import ListItemSeparator from 'components/ListItemSeparator';

function mapStates ({ sendingContactRequests }) {
  return { sendingContactRequests };
}

function renderRow ({ item, index }) {
  return <Row {...item} index={index} />;
}

function keyExtractor ({ id }) {
  return id;
}

function SendingContactRequests () {
  const { sendingContactRequests } = useFluxibleStore(mapStates);

  if (!sendingContactRequests.length) {
    return (
      <CenteredSurface>
        <Title style={{ marginBottom: 10 }}>
          Scan your QR codes of your network to add to add them to
          your contacts
        </Title>
        <Text style={{ marginBottom: 10 }}>
          When you scan the QR code of your contacts, they will
          appear here and {"you'll"} see the results real-time.
        </Text>
        <Paragraph>
          <Text style={{ fontWeight: 'bold' }}>No internet? </Text>
          <Text>
            You can scan the QR code of your contacts even when you
            {" don't"} have internet, they will appear here and when
            you connect to the internet, the app will automatically
            process them.
          </Text>
        </Paragraph>
        <Paragraph>
          <Text style={{ fontWeight: 'bold' }}>
            Too many QRs to scan?{' '}
          </Text>
          <Text>
            You can fast scan QR codes. Simply point the camera on
            the QR code one after the other, you {"don't"} need to
            wait for each of them to complete, {"you'll"} see the
            progress or each request here.
          </Text>
        </Paragraph>
      </CenteredSurface>
    );
  }

  return (
    <FlatList
      data={sendingContactRequests}
      renderItem={renderRow}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ListItemSeparator}
    />
  );
}

export default React.memo(SendingContactRequests);
