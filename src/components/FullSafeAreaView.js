import React from 'react';
import { SafeAreaView } from 'react-native';

const headerStyle = { flex: 0, backgroundColor: '#fff' };
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
