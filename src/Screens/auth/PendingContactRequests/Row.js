import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text, TouchableRipple, ActivityIndicator } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animatable from 'components/Animatable';
import StatusCaption from 'components/StatusCaption';
import UserAvatar from 'components/UserAvatar';
import { addToContact, getFullName, renderContactTitle } from 'helpers/contact';
import useHasInternet from 'hooks/useHasInternet';
import { paperTheme } from 'theme';

const { rippleColor } = paperTheme.colors;

function PendingContactRequestRow ({ index, ...contactData }) {
  const fullName = getFullName(contactData);
  const hasInternet = useHasInternet();
  const { status, id } = contactData;

  const [{ animation, delay }, setAnimation] = React.useState({
    animation: 'fadeInFromRight',
    delay: index % 10 * 100
  });

  const isInitial = status === 'initial';
  const isConnecting = status === 'sending' || isInitial;
  const isError = status === 'error';
  const isSuccess = status === 'success';

  const sendContactRequest = React.useCallback(() => {
    addToContact(contactData);
  }, [contactData]);

  const onAnimationEnd = React.useCallback(() => {
    if (!isSuccess) return;

    updateStore({
      pendingContactRequests: store.pendingContactRequests.filter(
        pendingContactRequest => pendingContactRequest.id !== id
      )
    });
  }, [isSuccess, id]);

  React.useEffect(() => {
    if (isInitial) {
      sendContactRequest();
    } else if (isSuccess) {
      const timer = setTimeout(() => {
        setAnimation({
          animation: 'fadeOutToRight',
          delay: 0
        });
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isInitial, isSuccess, sendContactRequest]);

  return (
    <Animatable animation={animation} delay={delay} onAnimationEnd={onAnimationEnd}>
      <View style={{ margin: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <UserAvatar {...contactData} />
          <View style={{ marginLeft: 15, flex: 1, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>{fullName}</Text>
            </View>
            {renderContactTitle(contactData)}
            {isError ? (
              <StatusCaption
                isError
                message={!hasInternet ? 'Waiting for internet' : 'Failed, please retry.'}
              />
            ) : isSuccess ?
              <StatusCaption message="Sent" />
             : null}
          </View>
          {isError ? (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ borderRadius: 100, overflow: 'hidden' }}>
                <TouchableRipple onPress={sendContactRequest} rippleColor={rippleColor}>
                  <Ionicons name="ios-refresh-circle-outline" size={35} />
                </TouchableRipple>
              </View>
            </View>
          ) : isConnecting ?
            <ActivityIndicator style={{ marginRight: 10 }} size={25} />
           : null}
        </View>
      </View>
    </Animatable>
  );
}

export default React.memo(PendingContactRequestRow);
