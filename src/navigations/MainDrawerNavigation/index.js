import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import Navigations from './Navigations';

function mapStates ({ authUser }) {
  return { authUser };
}

function MainDrawerNavigation ({ navigation: { replace } }) {
  const { authUser } = useFluxibleStore(mapStates);

  React.useEffect(() => {
    if (!authUser) replace('Login');
  }, [authUser, replace]);

  if (!authUser) return null;
  return <Navigations />;
}

export default React.memo(MainDrawerNavigation);
