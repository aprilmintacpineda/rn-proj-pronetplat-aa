import React from 'react';
import RefreshableView from './RefreshableView';

function UnknownErrorView (refreshableViewProps) {
  return (
    <RefreshableView {...refreshableViewProps}>
      An unknown error occured, Please try again.
    </RefreshableView>
  );
}

export default React.memo(UnknownErrorView);
