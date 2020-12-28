import React from 'react';
import ChangePersonalInfo from './ChangePersonalInfo';
import ChangeProfilePicture from './ChangeProfilePicture';
import SlideView from 'components/SlideView';

function FirstSetup () {
  const [page, setPage] = React.useState(1);

  const next = React.useCallback(() => {
    setPage(oldPage => oldPage + 1);
  }, []);

  return (
    <SlideView page={page}>
      <ChangePersonalInfo onSave={next} />
      <ChangeProfilePicture />
    </SlideView>
  );
}

export default React.memo(FirstSetup);
