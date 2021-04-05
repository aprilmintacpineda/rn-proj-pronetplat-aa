import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Divider, Headline, Text } from 'react-native-paper';
import Button from 'components/FormWithContext/Button';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';
import { logout } from 'fluxible/actions/user';

function AuthenticateForm () {
  const logoutDiag = React.useCallback(() => {
    Alert.alert(
      null,
      'Are you sure you want to log out? QR codes you scanned offline will be lost.',
      [
        {
          style: 'destructive',
          text: 'Yes',
          onPress: logout
        },
        {
          style: 'cancel',
          text: 'No'
        }
      ]
    );
  }, []);

  return (
    <ScrollView>
      <View style={{ margin: 20 }}>
        <Headline>Session expired.</Headline>
        <Text>
          This is normal. We just need you to enter your password
          again.
        </Text>
        <Divider style={{ marginVertical: 20 }} />
        <TextInput field="password" type="password" />
        <SubmitButton>Submit</SubmitButton>
        <Button
          style={{ marginTop: 15 }}
          mode="outlined"
          onPress={logoutDiag}
        >
          Log out
        </Button>
      </View>
    </ScrollView>
  );
}

export default React.memo(AuthenticateForm);
