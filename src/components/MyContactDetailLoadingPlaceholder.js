import React from 'react';
import { View } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <View style={{ flex: 1 }}>
                <PlaceholderLine
                  width={80}
                  height={20}
                  style={{ marginBottom: 10 }}
                />
                <PlaceholderLine width={60} height={10} />
                <PlaceholderLine width={40} height={6} />
              </View>
              <PlaceholderLine width={10} height={10} />
            </View>
          </View>
        </Placeholder>
      </>
    );
  }

  return null;
}

export default React.memo(ContactDetailLoadingPlaceholder);
