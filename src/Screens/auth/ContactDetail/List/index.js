import React from 'react';
import RowComponent from './Row';
import DataFlatList from 'components/DataFlatList';
import ListEmpty from 'components/ListEmpty';
import MyContactDetailLoadingPlaceholder from 'components/MyContactDetailLoadingPlaceholder';
import RNVectorIcon from 'components/RNVectorIcon';

const events = {
  contactDetailsAdded (contactDetail, { concatData }) {
    concatData(contactDetail);
  },
  contactDetailsDeleted (deletedContactDetailid, { filterData }) {
    filterData(
      contactDetail => contactDetail.id !== deletedContactDetailid
    );
  },
  contactDetailsUpdated (updatedContactDetail, { updateData }) {
    updateData(contactDetail => {
      if (contactDetail.id !== updatedContactDetail.id)
        return contactDetail;

      return updatedContactDetail;
    });
  }
};

function ContactDetailsList ({
  navigation: { setOptions, navigate }
}) {
  React.useEffect(() => {
    setOptions({
      actions: [
        {
          title: 'Add',
          icon: props => (
            <RNVectorIcon
              provider="Ionicons"
              name="ios-add-circle-outline"
              {...props}
            />
          ),
          onPress: () => {
            navigate('ContactDetailsForm');
          }
        }
      ]
    });
  }, [setOptions, navigate]);

  return (
    <DataFlatList
      endpoint="/contact-details"
      ListEmptyComponent={ListEmpty}
      RowComponent={RowComponent}
      LoadingPlaceHolder={MyContactDetailLoadingPlaceholder}
      events={events}
    />
  );
}

export default React.memo(ContactDetailsList);
