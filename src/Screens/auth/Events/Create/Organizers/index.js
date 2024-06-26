import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { FormContext } from 'components/FormWithContext';
import Button from 'components/FormWithContext/Button';
import IconButton from 'components/FormWithContext/IconButton';
import FullScreenModal from 'components/FullScreenModal';
import RNVectorIcon from 'components/RNVectorIcon';
import SelectContacts from 'components/SelectContacts';
import UserAvatar from 'components/UserAvatar';
import { showErrorPopup } from 'fluxible/actions/popup';
import { getFullName, renderUserTitle } from 'libs/user';

function removeIcon (props) {
  return (
    <RNVectorIcon
      {...props}
      provider="Ionicons"
      name="close-outline"
    />
  );
}

function mapStates ({ authUser }) {
  return { authUser };
}

function Organizers () {
  const { authUser } = useFluxibleStore(mapStates);
  const [isVisible, setIsVisible] = React.useState(false);
  const { formValues, setField } = React.useContext(FormContext);

  const openModal = React.useCallback(() => {
    setIsVisible(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  const addOrganizer = React.useCallback(
    contact => {
      if (formValues.organizers.length + 1 === 20) {
        showErrorPopup({
          message: 'Number of organizers is limited to 20'
        });
      } else {
        setField('organizers', ({ formValues }) =>
          formValues.organizers.concat(contact)
        );
      }
    },
    [setField, formValues.organizers]
  );

  const removeOrganizer = React.useCallback(
    contact => {
      setField('organizers', ({ formValues }) =>
        formValues.organizers.filter(
          organizer => organizer.id !== contact.id
        )
      );
    },
    [setField]
  );

  const resolveIsSelected = React.useCallback(
    user => {
      return Boolean(
        formValues.organizers.find(({ id }) => id === user.id)
      );
    },
    [formValues.organizers]
  );

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          padding: 15
        }}
      >
        <UserAvatar user={authUser} />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginLeft: 10
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            You
          </Text>
        </View>
      </View>
      {formValues.organizers.map(user => {
        const fullName = getFullName(user);

        return (
          <View
            key={user.id}
            style={{
              flexDirection: 'row',
              padding: 15
            }}
          >
            <UserAvatar user={user} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text numberOfLines={1} style={{ fontSize: 18 }}>
                {fullName}
              </Text>
              {renderUserTitle(user)}
            </View>
            <View
              style={{
                justifyContent: 'center',
                marginLeft: 10
              }}
            >
              <IconButton
                icon={removeIcon}
                size={20}
                onPress={() => {
                  removeOrganizer(user);
                }}
              />
            </View>
          </View>
        );
      })}
      <Button
        mode="outlined"
        style={{ marginTop: 10 }}
        onPress={openModal}
      >
        Add organizers
      </Button>
      <FullScreenModal isVisible={isVisible}>
        <SelectContacts
          onClose={closeModal}
          onSelect={addOrganizer}
          resolveIsSelected={resolveIsSelected}
        />
      </FullScreenModal>
    </>
  );
}

export default React.memo(Organizers);
