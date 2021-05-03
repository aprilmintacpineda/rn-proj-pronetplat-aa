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
import { decrementContactRequestsCount } from 'fluxible/actions/user';
import { getFullName, renderUserTitle } from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function ReceivedContactRequestRow ({ sender, createdAt, index }) {
  const fullName = getFullName(sender);
  const delay = (index % 10) * 100;
  const modalizeRef = React.useRef();
  const [action, setAction] = React.useState();

  const showPopup = React.useCallback(() => {
    modalizeRef.current.open();
  }, []);

  const confirmAccept = React.useCallback(async () => {
    try {
      setAction('accept');

      await xhr(`/accept-contact-request/${sender.id}`, {
        method: 'post'
      });

      decrementContactRequestsCount();
      emitEvent('respondedToContactRequest', sender.id);
      emitEvent('refreshMyContactList');
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
      setAction('');
    }
  }, [sender.id]);

  const accept = React.useCallback(() => {
    showConfirmDialog({
      message: `Are you sure you want to add ${fullName} to your contacts? You will be able to see each other's contact details.`,
      onConfirm: confirmAccept
    });
  }, [fullName, confirmAccept]);

  const confirmDecline = React.useCallback(async () => {
    try {
      setAction('decline');

      await xhr(`/decline-contact-request/${sender.id}`, {
        method: 'post'
      });

      decrementContactRequestsCount();
      emitEvent('respondedToContactRequest', sender.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
      setAction('');
    }
  }, [sender.id]);

  const decline = React.useCallback(() => {
    showConfirmDialog({
      message: `Are you sure you want to decline the contact request of ${fullName}?`,
      onConfirm: confirmDecline
    });
  }, [fullName, confirmDecline]);

  const confirmBlockUser = React.useCallback(async () => {
    try {
      setAction('block');

      await xhr(`/block-user/${sender.id}`, {
        method: 'post'
      });

      decrementContactRequestsCount();
      emitEvent('respondedToContactRequest', sender.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
      setAction('');
    }
  }, [sender.id]);

  const blockUser = React.useCallback(() => {
    showConfirmDialog({
      message: `Are you sure you want to block ${fullName}?`,
      onConfirm: confirmBlockUser
    });
  }, [confirmBlockUser, fullName]);

  return (
    <>
      <Animatable animation="fadeInFromRight" delay={delay}>
        <TouchableRipple onPress={showPopup}>
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <UserAvatar user={sender} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text numberOfLines={1} style={{ fontSize: 18 }}>
                {fullName}
              </Text>
              {renderUserTitle(sender)}
              <Caption>
                <TimeAgo dateFrom={createdAt} />
              </Caption>
            </View>
          </View>
        </TouchableRipple>
      </Animatable>
      <UserModalize user={sender} ref={modalizeRef}>
        <Button
          mode="contained"
          onPress={accept}
          disabled={Boolean(action)}
          loading={action === 'accept'}
        >
          Accept
        </Button>
        <Button
          mode="outlined"
          style={{ marginTop: 15 }}
          onPress={decline}
          disabled={Boolean(action)}
          loading={action === 'decline'}
        >
          Decline
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

export default React.memo(ReceivedContactRequestRow);
