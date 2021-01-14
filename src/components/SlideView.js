import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';

function SlideView ({ scrollEnabled = false, children, page = 1 }) {
  const { width } = useWindowDimensions();
  const scrollViewRef = React.useRef();
  const contentOffset = React.useRef((page - 1) * width).current;
  const prevPageRef = React.useRef(page);

  React.useEffect(() => {
    const prevPage = prevPageRef.current;

    if (page !== prevPage) {
      prevPageRef.current = page;
      scrollViewRef.current.scrollTo({
        x: (page - 1) * width,
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
      decelerationRate="normal"
      scrollEnabled={scrollEnabled}
      contentOffset={{ x: contentOffset }}
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
