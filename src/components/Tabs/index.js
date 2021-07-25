import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import SlideView from 'components/SlideView';
import { paperTheme } from 'theme';

export const TabContext = React.createContext();

function Tabs ({ children }) {
  const [activeTab, setActiveTab] = React.useState(0);

  const tabMenu = React.useMemo(
    () => (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#DCE0E5'
        }}
      >
        {children.map(({ props }, index) => (
          <TouchableOpacity
            style={{
              flex: 1,
              borderBottomWidth: 3,
              borderBottomColor:
                activeTab === index
                  ? paperTheme.colors.primary
                  : 'transparent',
              padding: 15
            }}
            key={index}
            onPress={() => {
              if (activeTab !== index) setActiveTab(index);
            }}
          >
            <Text
              style={{
                color:
                  activeTab === index
                    ? paperTheme.colors.primary
                    : paperTheme.colors.accent,
                textAlign: 'center'
              }}
            >
              {props.label || `Index ${index}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
    [activeTab, children]
  );

  return (
    <>
      {tabMenu}
      <TabContext.Provider value={{ activeTab }}>
        <SlideView page={activeTab + 1}>{children}</SlideView>
      </TabContext.Provider>
    </>
  );
}

export default React.memo(Tabs);
