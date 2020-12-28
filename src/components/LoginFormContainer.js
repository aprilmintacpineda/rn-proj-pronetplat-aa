import React from 'react';
import { Divider, Headline, Subheading } from 'react-native-paper';
import FormContainer from './FormContainer';

function LoginFormContainer ({ children }) {
  return (
    <FormContainer>
      <Headline>Quaint</Headline>
      <Subheading>Tired of calling cards? We got you.</Subheading>
      <Divider style={{ marginVertical: 20 }} />
      {children}
    </FormContainer>
  );
}

export default React.memo(LoginFormContainer);
