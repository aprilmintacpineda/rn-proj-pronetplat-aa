import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import RNVectorIcon from 'components/RNVectorIcon';

function mapStates ({ authUser }) {
  return { authUser };
}

function ToggleDrawerIcon (props) {
  const { authUser } = useFluxibleStore(mapStates);

  const badge =
    authUser.receivedContactRequestsCount +
    authUser.notificationsCount +
    authUser.eventInvitationsCount;

  return (
    <RNVectorIcon
      provider="Feather"
      name="menu"
      badge={badge}
      {...props}
    />
  );
}

export default React.memo(ToggleDrawerIcon);
