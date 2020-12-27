import React from 'react';
import App from 'App';

function Main ({ isHeadless }) {
  if (isHeadless) return null;
  return <App />;
}

export default Main;
