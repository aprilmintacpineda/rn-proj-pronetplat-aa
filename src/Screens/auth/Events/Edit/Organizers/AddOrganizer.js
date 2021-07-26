import { useNavigation, useRoute } from '@react-navigation/native';
import { emitEvent } from 'fluxible-js';
import React from 'react';
import { DataFetchContext } from 'components/DataFetch';
import FullScreenModal from 'components/FullScreenModal';
import RNVectorIcon from 'components/RNVectorIcon';
import SelectContacts from 'components/SelectContacts';
import { TabContext } from 'components/Tabs';
import { unknownErrorPopup } from 'fluxible/actions/popup';
import { xhr } from 'libs/xhr';

const eventListeners = {
  addedToOrganizer: (userId, { replaceData }) => {
    replaceData(data =>
      data.map(contact => {
        if (contact.id !== userId) return contact;

        return {
          ...contact,
          isOrganizer: true
        };
      })
    );
  },
  organizerRemoved: (userId, { replaceData }) => {
    replaceData(data =>
      data.map(contact => {
        if (contact.id !== userId) return contact;

        return {
          ...contact,
          isOrganizer: false
        };
      })
    );
  }
};

function AddOrganizer () {
  const { params: event } = useRoute();
  const [isVisible, setIsVisible] = React.useState(false);
  const { setOptions } = useNavigation();
  const { activeTab } = React.useContext(TabContext);
  const [addingUsersList, setAddingUsersList] = React.useState([]);
  const [shouldRefresh, setShouldRefresh] = React.useState(false);
  const { refreshData } = React.useContext(DataFetchContext);

  React.useEffect(() => {
    if (activeTab !== 1) {
      setOptions({
        actions: []
      });
    } else {
      setOptions({
        actions: [
          {
            title: 'Add organizer',
            icon: props => (
              <RNVectorIcon
                provider="Ionicons"
                name="person-add-outline"
                {...props}
              />
            ),
            onPress: () => {
              setIsVisible(true);
            }
          }
        ]
      });
    }
  }, [activeTab, setOptions]);

  const closeModal = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  const addOrganizer = React.useCallback(
    async user => {
      try {
        setAddingUsersList(oldList => [user].concat(oldList));

        await xhr(`/events/organizers/add/${event.id}`, {
          method: 'post',
          body: {
            contactId: user.id
          }
        });

        emitEvent('addedToOrganizer', user.id);
        setShouldRefresh(true);
      } catch (error) {
        console.log(error);
        unknownErrorPopup();
      } finally {
        setAddingUsersList(oldList =>
          oldList.filter(({ id }) => id !== user.id)
        );
      }
    },
    [event]
  );

  const resolveIsSelected = React.useCallback(
    user => user.isOrganizer,
    []
  );

  const resolveIsLoading = React.useCallback(
    user => {
      return Boolean(
        addingUsersList.find(({ id }) => id === user.id)
      );
    },
    [addingUsersList]
  );

  const onModalClose = React.useCallback(() => {
    if (shouldRefresh) {
      setShouldRefresh(false);
      refreshData();
    }
  }, [shouldRefresh, refreshData]);

  return (
    <FullScreenModal isVisible={isVisible} onClose={onModalClose}>
      <SelectContacts
        onClose={closeModal}
        onSelect={addOrganizer}
        resolveIsSelected={resolveIsSelected}
        resolveIsLoading={resolveIsLoading}
        url={`/events/add-organizer/${event.id}`}
        eventListeners={eventListeners}
      />
    </FullScreenModal>
  );
}

export default React.memo(AddOrganizer);
