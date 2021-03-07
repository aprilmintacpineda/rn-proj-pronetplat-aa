import React from 'react';
import { Divider, Headline, Subheading } from 'react-native-paper';
import FormContainer from './FormContainer';

function LoginFormContainer ({ children }) {
  return (
    <FormContainer>
      <Headline>EntrepConnect</Headline>
      <Subheading>Make professional connections</Subheading>
      <Divider style={{ marginVertical: 20 }} />
      {children}
    </FormContainer>
  );
}

export default React.memo(LoginFormContainer);
