import React from 'react';
import { SafeAreaView } from 'react-native';
import { paperTheme } from 'theme';

const headerStyle = {
  flex: 0,
  backgroundColor: paperTheme.colors.accent
};
const wrapperStyle = { flex: 1 };

function FullSafeArea ({ children }) {
  return (
    <>
      <SafeAreaView style={headerStyle} />
      <SafeAreaView style={wrapperStyle}>{children}</SafeAreaView>
    </>
  );
}

export default React.memo(FullSafeArea);
