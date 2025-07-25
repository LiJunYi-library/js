function Animation(config = {}) {
  let timer;
  let stopAction = false;
  const opt = {
    from: 0,
    to: 300,
    avg: 10,
    duration: 500,
    onanimationend: () => undefined,
    onanimation: () => undefined,
    ...config,
  };
  let value = opt.from;

  function flash() {
    if (opt.from < opt.to) {
      value = value + opt.avg;
      if (value >= opt.to) value = opt.to;
      opt.onanimation(value);
      if (value >= opt.to) {
        opt.onanimationend(value);
        stop();
        return;
      }
    }

    if (opt.from > opt.to) {
      value = value - opt.avg;
      if (value <= opt.to) value = opt.to;
      opt.onanimation(value);
      if (value <= opt.to) {
        opt.onanimationend(value);
        stop();
        return;
      }
    }
  }

  function start() {
    if (stopAction) return cancelAnimationFrame(timer);
    timer = requestAnimationFrame(() => {
      if (stopAction) return cancelAnimationFrame(timer);
      flash();
      start();
    });
  }

  function stop() {
    stopAction = true;
    cancelAnimationFrame(timer);
  }

  return { start, stop };
}
