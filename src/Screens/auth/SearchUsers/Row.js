import { emitEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import Button from 'components/Button';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import UserModalize from 'components/UserModalize';
import {
  showConfirmDialog,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
import { decrementContactRequestsCount } from 'fluxible/actions/user';
import {
  getFullName,
  renderUserTitle,
  sendContactRequest
} from 'libs/user';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function SearchUserRow ({ index, ...user }) {
  const fullName = getFullName(user);
  const delay = (index % 10) * 100;
  const modalizeRef = React.useRef();
  const [action, setAction] = React.useState('');

  const showPopup = React.useCallback(() => {
    modalizeRef.current.open();
  }, []);

  const sendRequest = React.useCallback(async () => {
    sendContactRequest(user);
  }, [user]);

  const confirmBlockUser = React.useCallback(async () => {
    try {
      setAction('block');

      await xhr(`/block-user/${user.id}`, {
        method: 'post'
      });

      decrementContactRequestsCount();
      emitEvent('respondedToContactRequest', user.id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
      setAction('');
    }
  }, [user]);

  const blockUser = React.useCallback(() => {
    showConfirmDialog({
      message: `Are you sure you want to block ${fullName}?`,
      onConfirm: confirmBlockUser
    });
  }, [fullName, confirmBlockUser]);

  return (
    <>
      <Animatable animation="fadeInFromRight" delay={delay}>
        <TouchableRipple onPress={showPopup}>
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <UserAvatar user={user} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text numberOfLines={1} style={{ fontSize: 18 }}>
                {fullName}
              </Text>
              {renderUserTitle(user)}
            </View>
          </View>
        </TouchableRipple>
      </Animatable>
      <UserModalize user={user} ref={modalizeRef}>
        <Button
          onPress={sendRequest}
          mode="contained"
          disabled={Boolean(action)}
          loading={action === 'sendRequest'}
        >
          Send contact request
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

export default React.memo(SearchUserRow);
