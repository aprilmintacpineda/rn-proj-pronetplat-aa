import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import {
  Text,
  TouchableRipple,
  ActivityIndicator,
  Portal
} from 'react-native-paper';
import Animatable from 'components/Animatable';
import Button from 'components/Button';
import Caption from 'components/Caption';
import RNVectorIcon from 'components/RNVectorIcon';
import StatusCaption from 'components/StatusCaption';
import UserAvatar from 'components/UserAvatar';
import useHasInternet from 'hooks/useHasInternet';
import {
  addToContact,
  getFullName,
  renderUserTitle
} from 'libs/user';
import { paperTheme } from 'theme';

const { colors } = paperTheme;

function PendingContactRequestRow ({ index, ...contactData }) {
  const fullName = getFullName(contactData);
  const hasInternet = useHasInternet();
  const { status, id } = contactData;
  const modalizeRef = React.useRef();
  const timerRef = React.useRef();

  const [{ animation, delay }, setAnimation] = React.useState({
    animation: 'fadeInFromRight',
    delay: (index % 10) * 100
  });

  const isInitial = status === 'initial';
  const isConnecting = status === 'sending' || isInitial;
  const isError = status === 'error';
  const isSuccess = status === 'success';

  const openOptions = React.useCallback(() => {
    modalizeRef.current.open();
  }, []);

  const sendContactRequest = React.useCallback(() => {
    modalizeRef.current?.close();
    addToContact(contactData);
  }, [contactData]);

  const removeItem = React.useCallback(() => {
    clearTimeout(timerRef.current);

    setAnimation({
      animation: 'fadeOutToRight',
      delay: 0
    });
  }, []);

  const onAnimationEnd = React.useCallback(() => {
    if (animation !== 'fadeOutToRight') return;

    updateStore({
      sendingContactRequests: store.sendingContactRequests.filter(
        sendingContactRequest => sendingContactRequest.id !== id
      )
    });
  }, [animation, id]);

  React.useEffect(() => {
    if (isInitial) {
      sendContactRequest();
    } else if (isSuccess) {
      timerRef.current = setTimeout(() => {
        setAnimation({
          animation: 'fadeOutToRight',
          delay: 0
        });
      }, 2000);

      return () => {
        clearTimeout(timerRef.current);
      };
    }
  }, [isInitial, isSuccess, sendContactRequest]);

  return (
    <>
      <TouchableRipple onPress={openOptions}>
        <Animatable
          animation={animation}
          delay={delay}
          onAnimationEnd={onAnimationEnd}
        >
          <View style={{ margin: 15 }}>
            <View style={{ flexDirection: 'row' }}>
              <UserAvatar user={contactData} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={{ fontSize: 18 }}>{fullName}</Text>
                {renderUserTitle(contactData)}
                {isError ? (
                  <StatusCaption
                    isError
                    message={
                      !hasInternet
                        ? 'Waiting for internet'
                        : 'Failed, please retry.'
                    }
                  />
                ) : isSuccess ? (
                  <StatusCaption message="Sent" />
                ) : null}
                {isConnecting && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <ActivityIndicator size={10} />
                    <Caption
                      color={colors.primary}
                      style={{ marginLeft: 5 }}
                    >
                      Sending contact request...
                    </Caption>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Animatable>
      </TouchableRipple>
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          adjustToContentHeight
        >
          <View style={{ margin: 20, marginTop: 40 }}>
            <Button
              onPress={sendContactRequest}
              mode="outlined"
              color={colors.primary}
              icon={props => (
                <RNVectorIcon
                  provider="Ionicons"
                  name="ios-refresh-circle-outline"
                  {...props}
                />
              )}
              disabled={!isError}
            >
              Resend request
            </Button>
            <Button
              onPress={removeItem}
              mode="contained"
              color={colors.error}
              icon={props => (
                <RNVectorIcon
                  provider="Ionicons"
                  name="ios-trash"
                  {...props}
                />
              )}
              style={{ marginTop: 15 }}
              disabled={!isError}
            >
              Remove
            </Button>
          </View>
        </Modalize>
      </Portal>
    </>
  );
}

export default React.memo(PendingContactRequestRow);
