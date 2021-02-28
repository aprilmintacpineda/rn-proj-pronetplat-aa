import { useNavigation } from '@react-navigation/native';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import { Alert, View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import Caption from 'components/Caption';
import Menu from 'components/Menu';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';
import { showRequestFailedPopup } from 'fluxible/actions/popup';
import { xhr } from 'libs/xhr';

function ContactDetailRow (contactDetail) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { navigate } = useNavigation();

  const { id, value, description, updatedAt } = contactDetail;

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
          Alert.alert(
            null,
            'Are you sure you want to delete this contact detail?',
            [
              {
                text: 'Yes',
                style: 'destructive',
                onPress: deleteContactDetail
              },
              {
                text: 'No',
                style: 'cancel'
              }
            ]
          );
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
        <Title>{value}</Title>
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
