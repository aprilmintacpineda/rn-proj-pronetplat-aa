import {
  format,
  formatDistance,
  formatDistanceToNow
} from 'date-fns';
import React from 'react';
import Authenticate from './Authenticate';
import LoginContext from './LoginContext';
import VerifyEmail from './VerifyEmail';
import SlideView from 'components/SlideView';
import {
  showRequestFailedPopup,
  showSuccessPopup
} from 'fluxible/actions/popup';
import { login } from 'fluxible/actions/user';
import useState from 'hooks/useState';
import { logEvent } from 'libs/logging';
import { xhr } from 'libs/xhr';

function Login ({ navigation: { replace } }) {
  const dateFormat = 'MMMM dd, yyyy';

  const { state, updateState } = useState({
    page: 1,
    emailCodeCanSendAt: null,
    authToken: null
  });

  const { page, authToken } = state;

  const onLogin = React.useCallback(
    ({ userData, authToken }) => {
      if (!userData.emailVerifiedAt) {
        const accountCreateDate = new Date(userData.createdAt);

        logEvent('emailNotVerified', {
          accountCreatedAt: format(accountCreateDate, dateFormat),
          timeLapse: formatDistanceToNow(accountCreateDate)
        });

        updateState({
          page: 2,
          emailCodeCanSendAt: userData.emailCodeCanSendAt,
          authToken
        });
      } else {
        login({ userData, authToken });
        replace('LoggedInRoutes');
      }
    },
    [updateState, replace]
  );

  const onVerified = React.useCallback(
    ({ userData, authToken }) => {
      const accountCreateDate = new Date(userData.createdAt);
      const emailVerifyDate = new Date(userData.emailVerifiedAt);

      logEvent('emailVerified', {
        accountCreatedAt: format(accountCreateDate, dateFormat),
        emailVerifiedAt: format(emailVerifyDate, dateFormat),
        timeLapse: formatDistance(accountCreateDate, emailVerifyDate)
      });

      login({ userData, authToken });
      replace('LoggedInRoutes');
    },
    [replace]
  );

  const onResendCode = React.useCallback(async () => {
    try {
      const response = await xhr('/resend-email-code', {
        method: 'post',
        headers: {
          Authorization: `bearer ${authToken}`
        }
      });

      showSuccessPopup({
        message:
          'We have sent your new verification code to your email.'
      });

      const {
        userData,
        authToken: newAuthToken
      } = await response.json();

      updateState({
        authToken: newAuthToken,
        emailCodeCanSendAt: userData.emailCodeCanSendAt
      });
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('onResendCodeError', {
        message: error.message
      });
    }
  }, [updateState, authToken]);

  return (
    <LoginContext.Provider value={state}>
      <SlideView page={page}>
        <Authenticate onLogin={onLogin} />
        <VerifyEmail
          onVerified={onVerified}
          onResendCode={onResendCode}
        />
      </SlideView>
    </LoginContext.Provider>
  );
}

export default React.memo(Login);
