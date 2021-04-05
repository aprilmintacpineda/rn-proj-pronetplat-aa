import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Title } from 'react-native-paper';
import DisplayProfile from './DisplayProfile';

function mapStates ({ authUser }) {
  return { authUser };
}

function ContactProfile ({ route: { params: contactData } }) {
  const { authUser } = useFluxibleStore(mapStates);

  if (authUser.isTestAccount !== contactData.isTestAccount) {
    return (
      <View style={{ margin: 15, alignItems: 'center' }}>
        <Title style={{ textAlign: 'center', marginBottom: 15 }}>
          Test accounts may only interact with test accounts.
        </Title>
      </View>
    );
  }

  return <DisplayProfile contactData={contactData} />;
}

export default React.memo(ContactProfile);
