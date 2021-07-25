import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { DataFetchContext } from 'components/DataFetch';
import FullScreenModal from 'components/FullScreenModal';
import RNVectorIcon from 'components/RNVectorIcon';
import SelectContacts from 'components/SelectContacts';
import { TabContext } from 'components/Tabs';
import { unknownErrorPopup } from 'fluxible/actions/popup';
import { xhr } from 'libs/xhr';

function AddOrganizer () {
  const { params: event } = useRoute();
  const { data, replaceData } = React.useContext(DataFetchContext);
  const [isVisible, setIsVisible] = React.useState(false);
  const { setOptions } = useNavigation();
  const { activeTab } = React.useContext(TabContext);
  const [addingUsersList, setAddingUsersList] = React.useState([]);

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

        replaceData(data => [user].concat(data));
      } catch (error) {
        console.log(error);
        unknownErrorPopup();
      } finally {
        setAddingUsersList(oldList =>
          oldList.filter(({ id }) => id !== user.id)
        );
      }
    },
    [replaceData, event]
  );

  const resolveIsSelected = React.useCallback(
    user => {
      return Boolean(data.find(({ id }) => id === user.id));
    },
    [data]
  );

  const resolveIsLoading = React.useCallback(
    user => {
      return Boolean(
        addingUsersList.find(({ id }) => id === user.id)
      );
    },
    [addingUsersList]
  );

  return (
    <FullScreenModal isVisible={isVisible}>
      <SelectContacts
        onClose={closeModal}
        onSelect={addOrganizer}
        resolveIsSelected={resolveIsSelected}
        resolveIsLoading={resolveIsLoading}
      />
    </FullScreenModal>
  );
}

export default React.memo(AddOrganizer);
