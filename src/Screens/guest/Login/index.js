import { updateStore } from 'fluxible-js';
import React from 'react';
import Authenticate from './Authenticate';
import VerifyEmail from './VerifyEmail';
import SlideView from 'components/SlideView';
import { login } from 'fluxible/actions/user';

function Login ({ navigation: { replace } }) {
  const [page, setPage] = React.useState(1);

  const onCancel = React.useCallback(() => {
    setPage(1);
  }, []);

  const onLogin = React.useCallback(({ authUser, authToken }) => {
    const wasEmailVerified = Boolean(authUser.emailVerifiedAt);

    if (!wasEmailVerified) {
      updateStore({ authToken });
      setPage(2);
    } else {
      login({ authUser, authToken });
    }
  }, []);

  const onVerified = React.useCallback(
    ({ authUser, authToken }) => {
      login({ authUser, authToken });
      replace('LoggedInStack');
    },
    [replace]
  );

  return (
    <SlideView page={page}>
      <Authenticate onLogin={onLogin} />
      <VerifyEmail onVerified={onVerified} onCancel={onCancel} />
    </SlideView>
  );
}

export default React.memo(Login);
