import React from 'react';

import useForm from 'hooks/useForm';

export const FormContext = React.createContext();

function FormWithContext ({ formOptions, children }) {
  const form = useForm(formOptions);
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

export default React.memo(FormWithContext);
