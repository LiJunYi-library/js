export function createSpeedAnimation(config = {}) {
  const opt = {
    velocity: 0,
    deceleration: 0.04,
    onanimation: () => undefined,
    onanimationEnd: () => undefined,
    ...config,
  };

  let time;
  let stopAction = false;

  function animateStep(delta) {
    if (stopAction) return cancelAnimationFrame(time);
    time = requestAnimationFrame(() => {
      if (stopAction) return cancelAnimationFrame(time);
      opt.velocity = Number((opt.velocity + delta).toFixed(3));
      const dir = Math.sign(delta);
      if ((dir > 0 && opt.velocity >= 0) || (dir < 0 && opt.velocity <= 0)) {
        opt.velocity = 0;
        stop();
        opt.onanimationEnd(opt.velocity);
        return;
      }
      opt.onanimation(opt.velocity);
      animateStep(delta);
    });
  }

  function start() {
    stopAction = false;
    const dir = Math.sign(opt.velocity);
    animateStep(-dir * opt.deceleration);
  }

  function stop() {
    stopAction = true;
    cancelAnimationFrame(time);
  }

  return { start, stop };
}
