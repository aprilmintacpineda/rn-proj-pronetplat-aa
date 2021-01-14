import add from 'date-fns/add';
import intervalToDuration from 'date-fns/intervalToDuration';
import isPast from 'date-fns/isPast';
import React from 'react';

function useCountDown ({
  start = null,
  duration = null,
  toTime = null
}) {
  const timer = React.useRef(null);

  const [state, setState] = React.useState({
    isDone: false,
    timeLeftStr: ''
  });

  const count = React.useCallback(() => {
    let isDone = true;
    let countDownEnd = null;
    let minutes = '00';
    let seconds = '00';

    if (start || duration || toTime) {
      countDownEnd = toTime
        ? new Date(toTime)
        : add(new Date(start), duration);
      isDone = isPast(countDownEnd);
    }

    if (!isDone) {
      const interval = intervalToDuration({
        start: new Date(),
        end: countDownEnd
      });

      minutes = interval.minutes.toString().padStart(2, '0');
      seconds = interval.seconds.toString().padStart(2, 0);
    } else {
      clearInterval(timer.current);
    }

    setState({
      isDone,
      timeLeftStr: isDone ? '' : `${minutes}:${seconds}`
    });
  }, [start, duration, toTime]);

  React.useEffect(() => {
    count();
    timer.current = setInterval(count, 1000);

    return () => {
      clearInterval(timer.current);
    };
  }, [count]);

  return state;
}

export default useCountDown;
