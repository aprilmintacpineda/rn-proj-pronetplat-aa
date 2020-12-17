import React from 'react';
import ResetPassword from './ResetPassword';
import SendResetCode from './SendResetCode';
import SlideView from 'components/SlideView';

function ForgotPassword () {
  const [{ email, page }, setState] = React.useState({
    page: 1,
    email: null
  });

  const onResetCodeSent = React.useCallback(email => {
    setState({
      email,
      page: 2
    });
  }, []);

  return (
    <SlideView page={page}>
      <SendResetCode onResetCodeSent={onResetCodeSent} />
      <ResetPassword email={email} />
    </SlideView>
  );
}

export default React.memo(ForgotPassword);
