import React from 'react';
import useFluxibleStore from 'react-fluxible/lib/useFluxibleStore';
import { FormContext } from 'components/FormWithContext';
import SubmitButton from 'components/FormWithContext/SubmitButton';
import TextInput from 'components/FormWithContext/TextInput';

function mapStates ({ authUser }) {
  return { authUser };
}

function ChangeUsernameForm () {
  const { authUser } = useFluxibleStore(mapStates);
  const { setUpdateMode } = React.useContext(FormContext);

  React.useEffect(() => {
    setUpdateMode({
      formValues: {
        username: authUser.username
      }
    });
  }, [setUpdateMode, authUser.username]);

  return (
    <>
      <TextInput
        label="Desired username (optional)"
        field="username"
        helperText="This is optional and can be removed"
      />
      <SubmitButton>Save</SubmitButton>
    </>
  );
}

export default React.memo(ChangeUsernameForm);
