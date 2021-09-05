import React from 'react';
import { View, ScrollView } from 'react-native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';

function SlideView ({ scrollEnabled = false, children, page = 1 }) {
  const { width } = useWindowDimensions();
  const scrollViewRef = React.useRef();
  const contentOffset = React.useRef((page - 1) * width);

  React.useEffect(() => {
    const newOffset = (page - 1) * width;

    if (contentOffset.current !== newOffset) {
      contentOffset.current = newOffset;
      scrollViewRef.current.scrollTo({
        x: newOffset,
        animated: true
      });
    }
  }, [page, width]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      scrollEnabled={scrollEnabled}
      contentOffset={{ x: contentOffset.current }}
      bounces={false}
      overScrollMode="never"
    >
      <View style={{ flexDirection: 'row' }}>
        {children.map((child, i) => (
          <View key={i} style={{ width }}>
            {child}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default React.memo(SlideView);
