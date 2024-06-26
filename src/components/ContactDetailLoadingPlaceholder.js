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
            <PlaceholderLine width={30} height={6} />
            <View
              style={{
                marginLeft: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <View style={{ flex: 1 }}>
                <PlaceholderLine width={80} />
                <PlaceholderLine width={40} height={6} />
              </View>
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
