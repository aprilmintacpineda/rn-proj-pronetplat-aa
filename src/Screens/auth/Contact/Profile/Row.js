import React from 'react';
import { Linking, Text, View } from 'react-native';
import { Caption, TouchableRipple } from 'react-native-paper';
import RNVectorIcon from 'components/RNVectorIcon';
import Tooltip from 'components/Tooltip';
import { paperTheme } from 'theme';

function ContactDetailRow ({
  type,
  value,
  description,
  isCloseFriendsOnly,
  disabled
}) {
  const actionButtons = React.useMemo(() => {
    const actions = [];
    const iconSize = 20;
    const iconColor = disabled
      ? paperTheme.colors.disabled
      : paperTheme.colors.primary;

    switch (type) {
      case 'email':
        actions.push(
          <View
            style={{
              backgroundColor: '#ededed',
              borderRadius: 100,
              overflow: 'hidden',
              flexDirection: 'row',
              marginLeft: 15
            }}
          >
            <TouchableRipple
              onPress={() => {
                Linking.openURL(`mailto:${value}`);
              }}
              style={{ padding: 10 }}
              disabled={disabled}
            >
              <RNVectorIcon
                provider="Feather"
                name="send"
                color={iconColor}
                size={iconSize}
              />
            </TouchableRipple>
          </View>
        );
        break;
      case 'mobile':
        actions.push(
          <View
            style={{
              backgroundColor: '#ededed',
              borderRadius: 100,
              overflow: 'hidden',
              flexDirection: 'row',
              marginLeft: 15
            }}
          >
            <TouchableRipple
              onPress={() => {
                Linking.openURL(`sms:${value}`);
              }}
              style={{ padding: 10 }}
              disabled={disabled}
            >
              <RNVectorIcon
                provider="Ionicons"
                name="chatbox-ellipses-outline"
                color={iconColor}
                size={iconSize}
              />
            </TouchableRipple>
          </View>
        );
        break;
      case 'website':
        actions.push(
          <View
            style={{
              backgroundColor: '#ededed',
              borderRadius: 100,
              overflow: 'hidden',
              flexDirection: 'row',
              marginLeft: 15
            }}
          >
            <TouchableRipple
              onPress={() => {
                Linking.openURL(
                  !/^https?:\/\//.test(value)
                    ? `https://${value}`
                    : value
                );
              }}
              style={{ padding: 10 }}
              disabled={disabled}
            >
              <RNVectorIcon
                provider="Feather"
                name="external-link"
                color={iconColor}
                size={iconSize}
              />
            </TouchableRipple>
          </View>
        );
        break;
    }

    if (type === 'mobile' || type === 'telephone') {
      actions.push(
        <View
          style={{
            backgroundColor: '#ededed',
            borderRadius: 100,
            overflow: 'hidden',
            flexDirection: 'row',
            marginLeft: 15
          }}
        >
          <TouchableRipple
            onPress={() => {
              Linking.openURL(`tel:${value}`);
            }}
            style={{ padding: 10 }}
            disabled={disabled}
          >
            <RNVectorIcon
              provider="Feather"
              name="phone-call"
              size={iconSize}
              color={iconColor}
            />
          </TouchableRipple>
        </View>
      );
    }

    return actions;
  }, [disabled, type, value]);

  return (
    <View
      style={{
        marginBottom: 15,
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {isCloseFriendsOnly ? (
            <Tooltip
              content={<Text>Only close friends can see this.</Text>}
              placement="right"
            >
              <RNVectorIcon
                provider="MaterialCommunityIcons"
                name="star"
                size={20}
                color={paperTheme.colors.primary}
                style={{ marginRight: 5 }}
              />
            </Tooltip>
          ) : null}
          <Text style={{ fontSize: 16 }} numberOfLines={1}>
            {value}
          </Text>
        </View>
        <Caption>{description}</Caption>
      </View>
      <View style={{ flexDirection: 'row' }}>{actionButtons}</View>
    </View>
  );
}

export default React.memo(ContactDetailRow);
