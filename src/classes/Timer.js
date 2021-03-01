class Timer {
  constructor () {
    this.timeStartMs = 0;
  }

  reset () {
    this.timeStartMs = performance.now();
  }

  lap () {
    return (
      Math.abs(Math.ceil(performance.now() - this.timeStartMs)) /
      1000
    );
  }
}

export default Timer;
