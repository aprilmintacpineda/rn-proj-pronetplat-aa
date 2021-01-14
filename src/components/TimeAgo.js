import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import React from 'react';

function TimeAgo ({ dateFrom }) {
  const [timeAgo, setTimeAgo] = React.useState(() => {
    return formatDistanceToNow(new Date(dateFrom), {
      addSuffix: true
    });
  });

  const count = React.useCallback(() => {
    setTimeAgo(
      formatDistanceToNow(new Date(dateFrom), { addSuffix: true })
    );
  }, [dateFrom]);

  React.useEffect(() => {
    const timer = setInterval(count, 30000);

    return () => {
      clearInterval(timer);
    };
  }, [count]);

  return timeAgo;
}

export default TimeAgo;
