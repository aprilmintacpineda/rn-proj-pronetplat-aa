import React from 'react';
import { View } from 'react-native';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Fade
} from 'rn-placeholder';
import ListItemSeparator from 'components/ListItemSeparator';

function ContactsLoadingPlaceholder ({ isFirstFetch, isFetching }) {
  if (isFirstFetch || isFetching) {
    return (
      <>
        {!isFirstFetch && <ListItemSeparator />}
        <Placeholder Animation={Fade} style={{ padding: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <PlaceholderMedia
              style={{ borderRadius: 100 }}
              size={60}
            />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <PlaceholderLine width={70} />
              <PlaceholderLine width={50} />
              <PlaceholderLine width={20} />
            </View>
          </View>
        </Placeholder>
      </>
    );
  }

  return null;
}

export default React.memo(ContactsLoadingPlaceholder);
