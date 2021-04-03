import React from 'react';
import RefreshableView from './RefreshableView';

function ListEmpty (refreshableViewProps) {
  return (
    <RefreshableView {...refreshableViewProps} hideIndicator>
      List appears to be empty.
    </RefreshableView>
  );
}

export default React.memo(ListEmpty);
