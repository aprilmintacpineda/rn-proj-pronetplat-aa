import React from 'react';
import RefreshableView from './RefreshableView';

function ListEmpty ({
  message = 'List appears to be empty.',
  ...refreshableViewProps
}) {
  return (
    <RefreshableView {...refreshableViewProps} hideIndicator>
      {message}
    </RefreshableView>
  );
}

export default React.memo(ListEmpty);
