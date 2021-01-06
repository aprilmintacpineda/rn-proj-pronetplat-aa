import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text, TouchableRipple, ActivityIndicator } from 'react-native-paper';
import Animatable from 'components/Animatable';
import Caption from 'components/Caption';
import RNVectorIcon from 'components/RNVectorIcon';
import StatusCaption from 'components/StatusCaption';
import UserAvatar from 'components/UserAvatar';
import { addToContact, getFullName, renderContactTitle } from 'helpers/contact';
import useHasInternet from 'hooks/useHasInternet';
import { paperTheme } from 'theme';

const { rippleColor, primary } = paperTheme.colors;

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
        <View style={{ flexDirection: 'row' }}>
          <UserAvatar {...contactData} />
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={{ fontSize: 18 }}>{fullName}</Text>
            {renderContactTitle(contactData)}
            {isError ? (
              <StatusCaption
                isError
                message={!hasInternet ? 'Waiting for internet' : 'Failed, please retry.'}
              />
            ) : isSuccess ?
              <StatusCaption message="Sent" />
             : null}
            {isConnecting && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator size={10} />
                <Caption color={primary} style={{ marginLeft: 5 }}>
                  Sending contact request...
                </Caption>
              </View>
            )}
          </View>
          {isError ? (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ borderRadius: 100, overflow: 'hidden' }}>
                <TouchableRipple onPress={sendContactRequest} rippleColor={rippleColor}>
                  <RNVectorIcon
                    provider="Ionicons"
                    name="ios-refresh-circle-outline"
                    size={35}
                  />
                </TouchableRipple>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </Animatable>
  );
}

export default React.memo(PendingContactRequestRow);
