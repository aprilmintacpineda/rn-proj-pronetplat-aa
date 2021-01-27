import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import CenteredSurface from 'components/CenteredSurface';

function mapStates ({ authUser }) {
  return { authUser };
}

function MyCode () {
  const { authUser } = useFluxibleStore(mapStates);
  const { width } = useWindowDimensions();

  const codeValue = JSON.stringify({
    id: authUser.id,
    profilePicture: authUser.profilePicture,
    firstName: authUser.firstName,
    middleName: authUser.middleName,
    surname: authUser.surname,
    gender: authUser.gender,
    bio: authUser.bio,
    company: authUser.company,
    jobTitle: authUser.jobTitle
  });

  return (
    <CenteredSurface containerStyle={{ alignItems: 'center' }}>
      <QRCode value={codeValue} size={width * 0.7} />
      <Text style={{ textAlign: 'center', marginTop: 30 }}>
        Tell your contacts to scan the QR code above using their
        Quaint account.
      </Text>
    </CenteredSurface>
  );
}

export default React.memo(MyCode);
