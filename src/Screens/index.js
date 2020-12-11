import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import GuestStackNavigation from 'navigations/GuestStackNavigation';
import MainStackNavigation from 'navigations/MainStackNavigation';

function mapStates ({ authUser }) {
  return { authUser };
}

function Screens () {
  const { authUser } = useFluxibleStore(mapStates);
  if (authUser) return <MainStackNavigation />;
  return <GuestStackNavigation />;
}

export default React.memo(Screens);
