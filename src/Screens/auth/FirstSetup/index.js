import React from 'react';
import ChangePersonalInfo from './ChangePersonalInfo';
import ChangeProfilePicture from './ChangeProfilePicture';
import SlideView from 'components/SlideView';

function FirstSetup ({ navigation: { navigate } }) {
  const [page, setPage] = React.useState(1);

  const next = React.useCallback(() => {
    setPage(oldPage => oldPage + 1);
  }, []);

  const onDone = React.useCallback(() => {
    navigate('MainStackNavigation');
  }, [navigate]);

  return (
    <SlideView page={page}>
      <ChangePersonalInfo onSave={next} />
      <ChangeProfilePicture onDone={onDone} />
    </SlideView>
  );
}

export default React.memo(FirstSetup);
