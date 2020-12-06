import React from 'react';
import { ScrollView, View } from 'react-native';
import { Caption, Divider, Headline, Text } from 'react-native-paper';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  ShineOverlay
} from 'rn-placeholder';

import UserAvatar from 'components/UserAvatar';
import { getFullName, renderContactTitle } from 'helpers/contact';
import ContactDetailRow from './Row';
import useDataFetch from 'hooks/useDataFetch';

function ContactProfile ({ route: { params: contactData } }) {
  const { id, bio } = contactData;
  const fullName = getFullName(contactData);

  const { data, isFirstFetch } = useDataFetch({ endpoint: `/contacts/${id}` });

  const contactDetails = React.useMemo(() => {
    if (!data) {
      if (isFirstFetch) {
        return (
          <Placeholder Animation={ShineOverlay}>
            <View style={{ margin: 15 }}>
              <PlaceholderLine width={30} height={8} />
              <View
                style={{
                  marginLeft: 15,
                  marginBottom: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                <PlaceholderLine width={50} />
                <PlaceholderMedia style={{ borderRadius: 100 }} size={40} />
              </View>
              <View
                style={{
                  marginLeft: 15,
                  marginBottom: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                <PlaceholderLine width={50} />
                <PlaceholderMedia style={{ borderRadius: 100 }} size={40} />
              </View>
              <Divider />
            </View>
            <View style={{ margin: 15 }}>
              <PlaceholderLine width={30} height={8} />
              <View
                style={{
                  marginLeft: 15,
                  marginBottom: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                <PlaceholderLine width={50} />
                <PlaceholderMedia style={{ borderRadius: 100 }} size={40} />
              </View>
              <View
                style={{
                  marginLeft: 15,
                  marginBottom: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                <PlaceholderLine width={50} />
                <PlaceholderMedia style={{ borderRadius: 100 }} size={40} />
              </View>
            </View>
          </Placeholder>
        );
      }

      return null;
    }

    const types = {
      email: {
        data: [],
        labels: {
          plural: 'Emails',
          singular: 'Email'
        }
      },
      mobile: {
        data: [],
        labels: {
          plural: 'Mobile numbers',
          singular: 'Mobile number'
        }
      },
      telephone: {
        data: [],
        labels: {
          plural: 'Telephone numbers',
          singular: 'Telephone number'
        }
      }
    };

    data.forEach(contactData => {
      const { type } = contactData;

      types[type].data.push(<ContactDetailRow key={contactData.id} {...contactData} />);
    });

    const groupedData = Object.keys(types).reduce((accumulator, group) => {
      const { data, labels } = types[group];
      const { plural, singular } = labels;
      const { length } = data;

      if (length > 0) {
        return accumulator.concat({
          data,
          label: length > 1 ? plural : singular
        });
      }

      return accumulator;
    }, []);

    const groupLastIndex = groupedData.length - 1;

    return (
      <View style={{ margin: 15 }}>
        {groupedData.map(({ label, data }, index) => {
          if (!data.length) return null;

          return (
            <View key={label} style={{ marginBottom: 15 }}>
              <Caption>{label}</Caption>
              {data}
              {index < groupLastIndex ? <Divider /> : null}
            </View>
          );
        })}
      </View>
    );
  }, [data, isFirstFetch]);

  return (
    <ScrollView>
      <View style={{ margin: 15, marginTop: 30 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <UserAvatar {...contactData} size={100} />
          <View style={{ marginTop: 15 }}>
            <Headline style={{ textAlign: 'center' }}>{fullName}</Headline>
            {renderContactTitle(contactData, { justifyContent: 'center' })}
          </View>
        </View>
        <Text style={{ textAlign: 'center', marginTop: 15, color: 'gray' }}>{bio}</Text>
      </View>
      {contactDetails}
    </ScrollView>
  );
}

export default React.memo(ContactProfile);
