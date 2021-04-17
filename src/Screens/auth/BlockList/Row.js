import { emitEvent } from 'fluxible-js';
import React from 'react';
import { Alert, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Headline, Portal, Text } from 'react-native-paper';
import Animatable from 'components/Animatable';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import TouchableRipple from 'components/TouchableRipple';
import UserAvatar from 'components/UserAvatar';
import { showRequestFailedPopup } from 'fluxible/actions/popup';
import useState from 'hooks/useState';
import {
  addToContact,
  getFullName,
  renderUserTitle
} from 'libs/user';
import { xhr } from 'libs/xhr';

function BlockListRow ({ index, ...user }) {
  const fullName = getFullName(user);
  const delay = (index % 10) * 50;
  const modalRef = React.useRef(null);
  const {
    state: { shouldAddToContact, isDisabled },
    updateState
  } = useState({ shouldAddToContact: true, isDisabled: false });

  const showPopup = React.useCallback(() => {
    modalRef.current.open();
  }, []);

  const setShouldAddToContact = React.useCallback(() => {
    updateState(oldState => ({
      addToContact: !oldState.addToContact
    }));
  }, [updateState]);

  const confirmUnblock = React.useCallback(async () => {
    try {
      updateState({ isDisabled: true });
      await xhr(`/unblock-user/${user.id}`, { method: 'post' });
      if (shouldAddToContact) addToContact(user);
      emitEvent('userUnblocked', user.id);
    } catch (error) {
      console.log(error);
      updateState({ isDisabled: false });
      showRequestFailedPopup();
    }
  }, [updateState, shouldAddToContact, user]);

  const unblock = React.useCallback(async () => {
    Alert.alert(
      null,
      `Are you sure you want to unblock ${fullName}?`,
      [
        {
          onPress: confirmUnblock,
          style: 'destructive',
          text: 'Yes'
        },
        {
          style: 'cancel',
          text: 'No'
        }
      ]
    );
  }, [fullName, confirmUnblock]);

  return (
    <>
      <Animatable animation="fadeInFromRight" delay={delay}>
        <TouchableRipple onPress={showPopup}>
          <View
            style={{
              flexDirection: 'row',
              margin: 15
            }}
          >
            <UserAvatar user={user} />
            <View
              style={{
                marginLeft: 15,
                flex: 1,
                justifyContent: 'center'
              }}
            >
              <Text numberOfLines={1} style={{ fontSize: 18 }}>
                {fullName}
              </Text>
              {renderUserTitle(user)}
            </View>
          </View>
        </TouchableRipple>
      </Animatable>
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalRef}
          handlePosition="inside"
        >
          <View
            style={{ padding: 15, marginTop: 30, marginBottom: 30 }}
          >
            <View style={{ marginBottom: 30 }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <UserAvatar user={user} size={100} />
                <View style={{ marginTop: 15 }}>
                  <Headline
                    style={{ textAlign: 'center' }}
                    numberOfLines={3}
                  >
                    {fullName}
                  </Headline>
                  <View style={{ alignItems: 'center' }}>
                    {renderUserTitle(user, {
                      textAlign: 'center',
                      numberOfLines: 3
                    })}
                  </View>
                </View>
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 15,
                  color: 'gray'
                }}
              >
                {user.bio}
              </Text>
            </View>
            <Checkbox
              value={addToContact}
              onValueChange={setShouldAddToContact}
              content={
                <Text>Also send contact request to {fullName}</Text>
              }
              disabled={isDisabled}
            />
            <Button
              mode="contained"
              onPress={unblock}
              disabled={isDisabled}
            >
              Unblock
            </Button>
          </View>
        </Modalize>
      </Portal>
    </>
  );
}

export default React.memo(BlockListRow);
