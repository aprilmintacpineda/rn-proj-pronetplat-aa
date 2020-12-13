import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import GuestStackNavigation from 'navigations/GuestStackNavigation';
import MainDrawerNavigation from 'navigations/MainDrawerNavigation';

function mapStates ({ authUser }) {
  return { authUser };
}

function Screens () {
  const { authUser } = useFluxibleStore(mapStates);
  if (authUser) return <MainDrawerNavigation />;
  return <GuestStackNavigation />;
}

export default React.memo(Screens);
