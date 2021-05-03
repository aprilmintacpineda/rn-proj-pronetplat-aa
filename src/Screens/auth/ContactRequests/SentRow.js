import { emitEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import Button from 'components/Button';
import Caption from 'components/Caption';
import TimeAgo from 'components/TimeAgo';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import UserModalize from 'components/UserModalize';
import {
  showConfirmDialog,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
import { logEvent } from 'libs/logging';
import { getFullName, renderUserTitle } from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function SentContactRequestRow ({
  recipient,
  createdAt,
  canFollowUpAt,
  index
}) {
  const fullName = getFullName(recipient);
  const delay = (index % 10) * 100;
  const modalizeRef = React.useRef();
  const [action, setAction] = React.useState();

  const showPopup = React.useCallback(() => {
    modalizeRef.current.open();
  }, []);

  const sendFollowUp = React.useCallback(async () => {
    try {
      setAction('sendFollowUp');

      const response = await xhr(`/send-follow-up/${recipient.id}`, {
        method: 'post'
      });

      const data = await response.json();

      emitEvent('sentFollowUp', data);
      setAction('');
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('sendFollowUpError', {
        message: error.message
      });

      setAction('');
    }
  }, [recipient.id]);

  const confirmBlockUser = React.useCallback(async () => {
    try {
      setAction('block');

      await xhr(`/block-user/${recipient.id}`, {
        method: 'post'
      });

      emitEvent('cancelledContactRequest', recipient.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('confirmBlockUserError', {
        message: error.message
      });

      setAction('');
    }
  }, [recipient.id]);

  const blockUser = React.useCallback(() => {
    showConfirmDialog({
      message: `Are you sure you want to block ${fullName}?`,
      onConfirm: confirmBlockUser
    });
  }, [confirmBlockUser, fullName]);

  const confirmCancelRequest = React.useCallback(async () => {
    try {
      setAction('cancel');

      await xhr(`/cancel-contact-request/${recipient.id}`, {
        method: 'post'
      });

      emitEvent('cancelledContactRequest', recipient.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();

      logEvent('confirmCancelRequestError', {
        message: error.message
      });

      setAction('');
    }
  }, [recipient.id]);

  const cancelRequest = React.useCallback(() => {
    showConfirmDialog({
      message: `Are you sure you want to cancel your contact request to ${fullName}?`,
      onConfirm: confirmCancelRequest
    });
  }, [confirmCancelRequest, fullName]);

  return (
    <>
      <Animatable animation="fadeInFromRight" delay={delay}>
        <TouchableRipple onPress={showPopup}>
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <UserAvatar user={recipient} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text numberOfLines={1} style={{ fontSize: 18 }}>
                {fullName}
              </Text>
              {renderUserTitle(recipient)}
              <Caption>
                <TimeAgo dateFrom={createdAt} />
              </Caption>
            </View>
          </View>
        </TouchableRipple>
      </Animatable>
      <UserModalize user={recipient} ref={modalizeRef}>
        <Button
          mode="contained"
          onPress={sendFollowUp}
          disabled={Boolean(action)}
          style={{ marginBottom: 15 }}
          loading={action === 'sendFollowUp'}
          countDown={{
            toTime: canFollowUpAt
          }}
        >
          {({ timeLeftStr }) => `Send follow up ${timeLeftStr}`}
        </Button>
        <Button
          mode="outlined"
          onPress={cancelRequest}
          disabled={Boolean(action)}
          loading={action === 'cancel'}
        >
          Cancel
        </Button>
        <Button
          color={paperTheme.colors.error}
          style={{ marginTop: 15 }}
          onPress={blockUser}
          disabled={Boolean(action)}
          loading={action === 'block'}
        >
          Block
        </Button>
      </UserModalize>
    </>
  );
}

export default React.memo(SentContactRequestRow);
