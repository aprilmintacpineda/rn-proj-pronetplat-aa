import { store, updateStore } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { ActivityIndicator, Portal, Text, TouchableRipple } from 'react-native-paper';
import Animatable from 'components/Animatable';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Caption from 'components/Caption';
import { DataFetchContext } from 'components/DataFetch';
import StatusCaption from 'components/StatusCaption';
import TimeAgo from 'components/TimeAgo';
import { getFullName, getInitials, renderContactTitle } from 'helpers/contact';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

const { rippleColor, primary } = paperTheme.colors;

function ContactRequestRow ({ id, sender, createdAt, status = 'initial', index }) {
  const modalizeRef = React.useRef();
  const timerRef = React.useRef();
  const { updateData, filterData } = React.useContext(DataFetchContext);
  const [{ animation, delay }, setAnimation] = React.useState({
    animation: 'fadeInFromRight',
    delay: index % 10 * 100
  });

  const { profilePicture, bio } = sender;
  const avatarLabel = getInitials(sender);
  const fullName = getFullName(sender);
  const didAccept = status.includes('accept');
  const didDecline = status.includes('decline');
  const isLoading = status.includes('Loading');
  const isSuccess = status.includes('Success');
  const isError = status.includes('Error');

  const accept = React.useCallback(async () => {
    try {
      updateData(data => {
        if (data.id !== id) return data;

        return {
          ...data,
          status: 'acceptLoading'
        };
      });

      await xhr('/accept-contact-request', {
        method: 'post',
        body: { id }
      });

      updateStore({
        receivedContactRequestCount: store.receivedContactRequestCount - 1
      });

      updateData(data => {
        if (data.id !== id) return data;

        return {
          ...data,
          status: 'acceptSuccess'
        };
      });
    } catch (error) {
      console.log(error);
      updateData(data => {
        if (data.id !== id) return data;

        return {
          ...data,
          status: 'acceptError'
        };
      });
    }
  }, [id, updateData]);

  const decline = React.useCallback(async () => {
    try {
      updateData(data => {
        if (data.id !== id) return data;

        return {
          ...data,
          status: 'declineLoading'
        };
      });

      await xhr('/decline-contact-request', {
        method: 'post',
        body: { id }
      });

      updateStore({
        receivedContactRequestCount: store.receivedContactRequestCount - 1
      });

      updateData(data => {
        if (data.id !== id) return data;

        return {
          ...data,
          status: 'declineSuccess'
        };
      });
    } catch (error) {
      console.log(error);
      updateData(data => {
        if (data.id !== id) return data;

        return {
          ...data,
          status: 'declineError'
        };
      });
    }
  }, [id, updateData]);

  const openPopup = React.useCallback(() => {
    modalizeRef.current.open();
  }, []);

  const removeItem = React.useCallback(() => {
    if (!isSuccess) return;
    filterData(data => data.id !== id);
  }, [isSuccess, filterData, id]);

  React.useEffect(() => {
    if (!isSuccess || timerRef.current) return;
    modalizeRef.current.close();

    timerRef.current = setTimeout(() => {
      setAnimation({
        animation: 'fadeOutToRight',
        delay: 0
      });
    }, 2000);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [isSuccess, id]);

  return (
    <>
      <Animatable animation={animation} delay={delay} onAnimationEnd={removeItem}>
        <TouchableRipple
          rippleColor={rippleColor}
          onPress={openPopup}
          disabled={isSuccess}>
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <Avatar uri={profilePicture} label={avatarLabel} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text numberOfLines={1} style={{ fontSize: 18 }}>
                {fullName}
              </Text>
              {renderContactTitle(sender)}
              <Caption>
                <TimeAgo dateFrom={createdAt} />
              </Caption>
              {isSuccess ?
                <StatusCaption message={didAccept ? 'Accepted' : 'Declined'} />
               : isError ?
                <StatusCaption isError message="An error occured, please try again." />
               : null}
              {isLoading && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator size={10} />
                  <Caption color={primary} style={{ marginLeft: 5 }}>
                    Responding...
                  </Caption>
                </View>
              )}
            </View>
          </View>
        </TouchableRipple>
      </Animatable>
      <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          adjustToContentHeight
          onClosed={removeItem}>
          <View style={{ marginVertical: 30, marginHorizontal: 20 }}>
            <View style={{ alignItems: 'center' }}>
              <Avatar size={120} label={avatarLabel} uri={profilePicture} />
              <Text numberOfLines={1} style={{ fontSize: 18, marginTop: 10 }}>
                {fullName}
              </Text>
              {renderContactTitle(sender, { textAlign: 'center' })}
              <Text style={{ textAlign: 'center', marginTop: 10, marginBottom: 30 }}>
                {bio}
              </Text>
            </View>
            <View>
              <Button
                onPress={accept}
                mode="contained"
                color={primary}
                style={{ marginBottom: 10 }}
                loading={didAccept && isLoading}
                disabled={isLoading}>
                Accept
              </Button>
              <Button
                mode="outlined"
                color={primary}
                loading={didDecline && isLoading}
                disabled={isLoading}
                onPress={decline}>
                Decline
              </Button>
            </View>
          </View>
        </Modalize>
      </Portal>
    </>
  );
}

export default React.memo(ContactRequestRow);
