import React from 'react';
import { View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import TextLink from 'components/TextLink';

function About () {
  return (
    <View
      style={{
        flex: 1,
        marginTop: 15,
        alignItems: 'center'
      }}
    >
      <Title>Entrepic {'\u00A9'} 2021</Title>
      <View style={{ padding: 15 }}>
        <Text style={{ marginBottom: 15 }}>
          To learn more about us, you can visit our website at{' '}
          <TextLink isExternal to="https://entrepic.com">
            https://entrepic.com
          </TextLink>
          .
        </Text>
        <Text style={{ marginBottom: 15 }}>
          Please also take some time to read our{' '}
          <TextLink
            isExternal
            to="https://entrepic.com/privacy-policy"
          >
            Privacy policy
          </TextLink>{' '}
          and{' '}
          <TextLink
            isExternal
            to="https://entrepic.com/terms-and-conditions"
          >
            Terms and conditions
          </TextLink>
        </Text>
        <Text style={{ marginBottom: 15 }}>
          If you found any problems with the app,{' '}
          <TextLink
            isExternal
            to="https://forms.gle/DF9A9Y37qNma5X7u9"
          >
            please send an error report
          </TextLink>
          .
        </Text>
        <Text style={{ marginBottom: 15 }}>
          If you have suggestions or any useful thoughts for the
          platform,{' '}
          <TextLink
            isExternal
            to="https://forms.gle/dAaq8YEMQox7gvYn9"
          >
            please send us your feedback
          </TextLink>
          .
        </Text>
        <Text>
          For other professional concerns, you may send us an email
          at{' '}
          <TextLink isExternal to="mailto:hello@entrepic.com">
            hello@entrepic.com
          </TextLink>
          .
        </Text>
      </View>
    </View>
  );
}

export default React.memo(About);
