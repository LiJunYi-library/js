import { SlideEvent } from "./slide.js";

export class ScrollEvent extends SlideEvent {
  scrollTop = undefined;
}

// export function inheritSlideEvent(
//   name,
//   event = {},
//   eventInitDict = { bubbles: true, cancelable: true },
// ) {
//   const newEvent = new ScrollEvent(name, eventInitDict);
//   for (const key in event) {
//     try {
//       if (newEvent[key] === undefined) newEvent[key] = event[key];
//     } catch (error) {
//       console.warn(error);
//     }
//   }
//   return newEvent;
// }

export function usePointerScroll(props = {}) {
  const fn = () => () => undefined;
  const config = {
    maxOrientation: 10,
    COMPUTE_INTERVAL: 30,
    onMove: fn(),
    onMoveLeft: fn(),
    onMoveRight: fn(),
    onMoveTop: fn(),
    onMoveBottom: fn(),
    onMoveVertical: fn(),
    onMoveHorizontal: fn(),
    onAfterMove: fn(),
    onEnd: fn(),
    onEndLeft: fn(),
    onEndRight: fn(),
    onEndTop: fn(),
    onEndBottom: fn(),
    onEndVertical: fn(),
    onEndHorizontal: fn(),
    onAfterEnd: fn(),
    ...props,
  };

  let startE = {};
  let prevEvent = {};
  let intervalEvent;
  let timer;
  let pressures = [];
  let args = { direction: "", orientation: "", move, start, reset, isVertical, isHorizontal, end };

  function isVertical() {
    return args.orientation === "vertical";
  }

  function isHorizontal() {
    return args.orientation === "horizontal";
  }

  function getOrientation(x, y) {
    if (x > y && x > config.maxOrientation) {
      return "horizontal";
    }
    if (y > x && y > config.maxOrientation) {
      return "vertical";
    }
    return "";
  }

  function reset() {
    startE = {};
    args.orientation = "";
    clearTimeout(timer);
    pressures = [];
  }

  function start(event) {
    reset();
    startE = event;
    prevEvent = event;
    extendEvent(event);
  }

  function move(event) {
    extendEvent(event);
    prevEvent = event;
    (() => {
      if (args.orientation) return;
      args.orientation = getOrientation(Math.abs(event.deltaX), Math.abs(event.deltaY));
      event.orientation = args.orientation;
      if (event.orientation === "vertical") {
        if (event.moveY < 0) args.direction = "bottom";
        if (event.moveY > 0) args.direction = "top";
        event.direction = args.direction;
      }
      if (event.orientation === "horizontal") {
        if (event.moveX < 0) args.direction = "right";
        if (event.moveX > 0) args.direction = "left";
        event.direction = args.direction;
      }
    })();

    (() => {
      if (!args.orientation) return;
      config.onMove(event);
      if (event.orientation === "horizontal") {
        if (event.moveX > 0) config.onMoveLeft(event);
        if (event.moveX < 0) config.onMoveRight(event);
        if (event.moveX !== 0) config.onMoveHorizontal(event);
      }
      if (event.orientation === "vertical") {
        if (event.moveY > 0) config.onMoveTop(event);
        if (event.moveY < 0) config.onMoveBottom(event);
        if (event.moveY !== 0) config.onMoveVertical(event);
      }
      config.onAfterMove(event);

      timer = setTimeout(() => {
        intervalEvent = event;
      }, config.COMPUTE_INTERVAL);
    })();
  }

  function end(event) {
    console.log("onMoveend", event.pageX, event.pageY);
    clearTimeout(timer);
    extendEvent(event);
    (() => {
      if (!args.orientation) return;
      config.onEnd(event);
      if (event.velocityX > 0) config.onEndLeft(event);
      if (event.velocityX < 0) config.onEndRight(event);
      if (event.velocityY > 0) config.onEndTop(event);
      if (event.velocityY < 0) config.onEndBottom(event);
      if (event.velocityX !== 0) config.onEndHorizontal(event);
      if (event.velocityY !== 0) config.onEndVertical(event);
      config.onAfterEnd(event);
    })();
    reset();
  }

  function extendEvent(event) {
    event.orientation = args.orientation;
    event.direction = args.direction;
    event.currentTime = Date.now();

    event.deltaX = event.pageX - (startE?.pageX ?? 0);
    event.deltaY = event.pageY - (startE?.pageY ?? 0);
    event.deltaTime = event.currentTime - (prevEvent?.currentTime ?? 0);

    event.moveX = (prevEvent?.pageX ?? 0) - event.pageX;
    event.moveY = (prevEvent?.pageY ?? 0) - event.pageY;
    event.speedX = event.moveX / event.deltaTime;
    event.speedY = event.moveY / event.deltaTime;

    if (!intervalEvent) return;
    event.velocityX = undefinedReturn(intervalEvent.velocityX, event.speedX);
    event.velocityY = undefinedReturn(intervalEvent.velocityY, event.speedY);

    if (event.currentTime - intervalEvent.currentTime >= config.COMPUTE_INTERVAL) {
      let avgPressure = 1;
      // let avgPressure = pressures.reduce((add, v) => { add = v + add; return add }, 0) / pressures.length;
      // // TODO 兼容性需处理
      // if (avgPressure < 0.8) avgPressure = 0.8
      // if (avgPressure > 1.8) avgPressure = avgPressure - 1
      // if (avgPressure > 2.8) avgPressure = avgPressure - 2
      // if (avgPressure > 3.8) avgPressure = avgPressure - 3
      // if (avgPressure > 4.8) avgPressure = 1.8;
      // console.log('avgPressure', avgPressure);
      // console.log('avgPressure', intervalEvent?.pageY, event.pageY);
      const moveX = (intervalEvent?.pageX ?? 0) - event.pageX;
      const moveY = (intervalEvent?.pageY ?? 0) - event.pageY;
      const deltaTime = event.currentTime - (intervalEvent?.currentTime ?? 0);
      event.velocityX = Number(((moveX / deltaTime) * avgPressure).toFixed(2));
      event.velocityY = Number(((moveY / deltaTime) * avgPressure).toFixed(2));
      intervalEvent = event;
      pressures = [];
    }
  }

  return args;
}

function undefinedReturn(params, def) {
  if (isNaN(params)) return def;
  if (params === undefined) return def;
  return params;
}
