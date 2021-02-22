import React from 'react';
import RowComponent from './Row';
import ContactDetailLoadingPlaceholder from 'components/ContactDetailLoadingPlaceholder';
import DataFlatList from 'components/DataFlatList';
import ListEmpty from 'components/ListEmpty';
import RNVectorIcon from 'components/RNVectorIcon';

const events = {
  contactDetailsAdded: (contactDetail, { concatData }) => {
    concatData(contactDetail);
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
            navigate('ContactDetailsAdd');
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
      LoadingPlaceHolder={ContactDetailLoadingPlaceholder}
      events={events}
    />
  );
}

export default React.memo(ContactDetailsList);
