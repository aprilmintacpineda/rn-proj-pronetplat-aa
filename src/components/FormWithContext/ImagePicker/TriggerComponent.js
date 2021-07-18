import React from 'react';
import Button from 'components/Button';
import { paperTheme } from 'theme';

function TriggerComponent ({ hasError, ...btnProps }) {
  return (
    <Button
      {...btnProps}
      mode="outlined"
      style={{ marginTop: 20 }}
      color={hasError ? paperTheme.colors.error : undefined}
    >
      Select cover picture
    </Button>
  );
}

export default React.memo(TriggerComponent);
