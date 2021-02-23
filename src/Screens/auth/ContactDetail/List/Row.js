import React from 'react';
import { Alert, View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import Caption from 'components/Caption';
import Menu from 'components/Menu';
import RNVectorIcon from 'components/RNVectorIcon';
import TimeAgo from 'components/TimeAgo';

function ContactDetailRow (props) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { value, description, updatedAt } = props;

  const deleteContactDetail = React.useCallback(async () => {
    console.log('delete');
    setIsDeleting(true);
  }, []);

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
          console.log('edit');
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
  }, [deleteContactDetail]);

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
