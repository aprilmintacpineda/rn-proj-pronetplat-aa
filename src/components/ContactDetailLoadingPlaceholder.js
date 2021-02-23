import React from 'react';
import { View } from 'react-native';
import {
  Fade,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia
} from 'rn-placeholder';
import ListItemSeparator from './ListItemSeparator';

function ContactDetailLoadingPlaceholder ({
  isFirstFetch,
  isFetching
}) {
  if (isFirstFetch || isFetching) {
    return (
      <>
        {!isFirstFetch && <ListItemSeparator />}
        <Placeholder Animation={Fade}>
          <View style={{ margin: 15 }}>
            <PlaceholderLine width={30} height={8} />
            <View
              style={{
                marginLeft: 15,
                marginBottom: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <PlaceholderLine width={50} />
              <PlaceholderMedia
                style={{ borderRadius: 100 }}
                size={50}
              />
            </View>
            <View
              style={{
                marginLeft: 15,
                marginBottom: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <PlaceholderLine width={50} />
              <PlaceholderMedia
                style={{ borderRadius: 100 }}
                size={50}
              />
            </View>
          </View>
        </Placeholder>
      </>
    );
  }

  return null;
}

export default React.memo(ContactDetailLoadingPlaceholder);
