import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import ChangePersonalInfo from './ChangePersonalInfo';
import ChangeProfilePicture from './ChangeProfilePicture';
import SlideView from 'components/SlideView';

function mapStates ({ authUser }) {
  return { authUser };
}

function FirstSetup ({ navigation: { navigate } }) {
  const { authUser } = useFluxibleStore(mapStates);

  const hasBasicInfo =
    authUser.firstName &&
    authUser.surname &&
    authUser.gender &&
    authUser.jobTitle;

  const [page, setPage] = React.useState(hasBasicInfo ? 2 : 1);

  const next = React.useCallback(() => {
    setPage(oldPage => oldPage + 1);
  }, []);

  const onDone = React.useCallback(() => {
    navigate('LoggedInStackNavigation');
  }, [navigate]);

  return (
    <SlideView page={page}>
      <ChangePersonalInfo onNext={next} />
      <ChangeProfilePicture onNext={onDone} />
    </SlideView>
  );
}

export default React.memo(FirstSetup);
