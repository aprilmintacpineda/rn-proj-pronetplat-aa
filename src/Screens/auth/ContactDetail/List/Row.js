import { useNavigation } from '@react-navigation/native';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import { View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import Caption from 'components/Caption';
import Menu from 'components/Menu';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/Tooltip';
import {
  showConfirmDialog,
  showRequestFailedPopup
} from 'fluxible/actions/popup';
import { logEvent } from 'libs/logging';
import { xhr } from 'libs/xhr';
import { paperTheme } from 'theme';

function ContactDetailRow (contactDetail) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { navigate } = useNavigation();

  const {
    id,
    value,
    description,
    isCloseFriendsOnly,
    updatedAt
  } = contactDetail;

  const deleteContactDetail = React.useCallback(async () => {
    try {
      setIsDeleting(true);

      await xhr(`/contact-details/${id}`, {
        method: 'delete'
      });

      emitEvent('contactDetailsDeleted', id);
    } catch (error) {
      console.log(error);
      showRequestFailedPopup();
      setIsDeleting(false);

      logEvent('deleteContactDetailError', {
        message: error.message
      });
    }
  }, [id]);

  const menus = React.useMemo(() => {
    return [
      {
        title: 'Edit',
        icon: props => (
          <RNVectorIcon
            provider="Ionicons"
            name="ios-pencil"
            {...props}
          />
        ),
        onPress: () => {
          navigate('ContactDetailsForm', contactDetail);
        }
      },
      {
        title: 'Delete',
        icon: props => (
          <RNVectorIcon
            provider="Ionicons"
            name="ios-remove-circle-outline"
            {...props}
          />
        ),
        onPress: () => {
          showConfirmDialog({
            message:
              'Are you sure you want to delete that contact detail?',
            onConfirm: deleteContactDetail,
            isDestructive: true
          });
        }
      }
    ];
  }, [deleteContactDetail, navigate, contactDetail]);

  return (
    <View
      style={{
        padding: 15,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        opacity: isDeleting ? 0.4 : 1
      }}
    >
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {isCloseFriendsOnly ? (
            <View style={{ marginRight: 10 }}>
              <Tooltip
                content={
                  <Text>Only close friends can see this.</Text>
                }
                placement="right"
              >
                <RNVectorIcon
                  provider="MaterialCommunityIcons"
                  name="star"
                  size={20}
                  color={paperTheme.colors.primary}
                />
              </Tooltip>
            </View>
          ) : null}
          <Title>{value}</Title>
        </View>
        <Text>{description}</Text>
        <Caption>
          Last updated <TimeAgo dateFrom={updatedAt} />
        </Caption>
      </View>
      <Menu menus={menus} disabled={isDeleting} />
    </View>
  );
}

export default React.memo(ContactDetailRow);
