import add from 'date-fns/add';
import intervalToDuration from 'date-fns/intervalToDuration';
import isPast from 'date-fns/isPast';
import React from 'react';

function calcTime ({ start = null, duration = null, toTime = null }) {
  let isDone = true;
  let countDownEnd = null;
  let hours = '00';
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

    hours = interval.hours.toString().padStart(2, '0');
    minutes = interval.minutes.toString().padStart(2, '0');
    seconds = interval.seconds.toString().padStart(2, '0');
  }

  return {
    isDone,
    timeLeftStr: isDone ? '' : `${hours}:${minutes}:${seconds}`
  };
}

function useCountDown (props) {
  const timer = React.useRef(null);
  const [state, setState] = React.useState(() => calcTime(props));

  const count = React.useCallback(() => {
    const timerState = calcTime(props);
    if (!timerState.isDone) timer.current = setTimeout(count, 500);
    setState(timerState);
  }, [props]);

  const { isDone } = state;

  React.useEffect(() => {
    if (isDone) return;

    timer.current = setTimeout(count, 500);

    return () => {
      clearTimeout(timer.current);
    };
  }, [isDone, count]);

  return state;
}

export default useCountDown;
