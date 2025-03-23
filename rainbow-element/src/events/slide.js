const COMPUTE_INTERVAL = 30;
let currentView = document.createElement("div");
let srcViews = [];
let timer;
export const customEventNameMap = new Map();
const compute = {
  isGetPdownLock: false,
  srcViews: [],
};
export class SlideEvent extends CustomEvent {
  altKey = undefined;
  altitudeAngle = undefined;
  azimuthAngle = undefined;
  button = undefined;
  buttons = undefined;
  clientX = undefined;
  clientY = undefined;
  ctrlKey = undefined;
  currentTime = undefined;
  deltaAng = undefined;
  deltaC = undefined;
  deltaTime = undefined;
  deltaX = undefined;
  deltaY = undefined;
  direction = undefined;
  fromElement = undefined;
  getModifierState = undefined;
  getPredictedEvents = undefined;
  height = undefined;
  initMouseEvent = undefined;
  initUIEvent = undefined;
  isPrimary = undefined;
  layerX = undefined;
  layerY = undefined;
  metaKey = undefined;
  moveX = undefined;
  moveY = undefined;
  movementX = undefined;
  movementY = undefined;
  offsetX = undefined;
  offsetY = undefined;
  orientation = undefined;
  pageX = undefined;
  pageY = undefined;
  persistentDeviceId = undefined;
  pointerId = undefined;
  pointerType = undefined;
  pressure = undefined;
  relatedTarget = undefined;
  screenX = undefined;
  screenY = undefined;
  shiftKey = undefined;
  sourceCapabilities = undefined;
  speedX = undefined;
  speedY = undefined;
  srcViews = undefined;
  tangentialPressure = undefined;
  tiltX = undefined;
  tiltY = undefined;
  toElement = undefined;
  twist = undefined;
  velocityX = undefined;
  velocityY = undefined;
  view = undefined;
  which = undefined;
  width = undefined;
  x = undefined;
  y = undefined;
  constructor(type, eventInitDict = {}) {
    super(type, eventInitDict);
  }
}

(() => {
  // **TODO pointercancel
  document.addEventListener("pointerdown", onPointerdown);
  document.addEventListener("pointermove", onPointermove);
  document.addEventListener("pointerup", onPointerup);
  let isVerdict = false;
  let beginEvent;
  let prveEvent;
  let intervalEvent;
  let direction;
  let orientation;
  let isStart = true;
  let pressures = [];

  function onPointerdown(event) {
    clearTimeout(timer);
    extendedEventArgs(event);
    dispatchEvent("slideDown", event);
    beginEvent = event;
    prveEvent = event;
    intervalEvent = event;
    isVerdict = false;
    isStart = true;
    direction = undefined;
    orientation = undefined;
    pressures = [];
  }

  function onPointermove(event) {
    clearTimeout(timer);
    extendedEventArgs(event);
    prveEvent = event;
    // console.log('onPointermove')
    if (!isVerdict) {
      if (event.deltaC > 8) {
        const ang = event.deltaAng;
        const isRightAng = 315 <= ang || ang < 45;
        const isTopAng = 45 <= ang && ang < 135;
        const isLeftAng = 135 <= ang && ang < 225;
        const isBottomAng = 225 <= ang && ang < 315;
        if (isRightAng) direction = "right";
        if (isTopAng) direction = "top";
        if (isLeftAng) direction = "left";
        if (isBottomAng) direction = "bottom";
        if (isRightAng || isLeftAng) orientation = "horizontal";
        if (isTopAng || isBottomAng) orientation = "vertical";
        isVerdict = true;
        return;
      }
      return;
    }
    if (isStart) {
      dispatchEvent("slideStrat", event);
      if (event.moveX < 0) dispatchEvent("slideRightStrat", event);
      if (event.moveY < 0) dispatchEvent("slideBottomStrat", event);
      if (event.moveX > 0) dispatchEvent("slideLeftStrat", event);
      if (event.moveY > 0) dispatchEvent("slideTopStrat", event);
      if (event.moveX !== 0) dispatchEvent("slideHorizontalStrat", event);
      if (event.moveY !== 0) dispatchEvent("slideVerticalStrat", event);
      isStart = false;
      return;
    }

    dispatchEvent("slideMove", event);
    if (event.moveX < 0) dispatchEvent("slideRight", event);
    if (event.moveY < 0) dispatchEvent("slideBottom", event);
    if (event.moveX > 0) dispatchEvent("slideLeft", event);
    if (event.moveY > 0) dispatchEvent("slideTop", event);
    if (event.moveX !== 0) dispatchEvent("slideHorizontal", event);
    if (event.moveY !== 0) dispatchEvent("slideVertical", event);
    dispatchEvent("slideAfterMove", event);
    timer = setTimeout(() => {
      intervalEvent = event;
    }, COMPUTE_INTERVAL);
  }

  function onPointerup(event) {
    clearTimeout(timer);
    extendedEventArgs(event);
    if (isVerdict) {
      dispatchEvent("slideEnd", event);
      if (event.velocityX < 0) dispatchEvent("slideRightEnd", event);
      if (event.velocityY < 0) dispatchEvent("slideBottomEnd", event);
      if (event.velocityX > 0) dispatchEvent("slideLeftEnd", event);
      if (event.velocityY > 0) dispatchEvent("slideTopEnd", event);
      if (event.velocityX !== 0) dispatchEvent("slideHorizontalEnd", event);
      if (event.velocityY !== 0) dispatchEvent("slideVerticalEnd", event);
      dispatchEvent("slideAfterEnd", event);
    }
    dispatchEvent("slideUp", event);
    currentView = undefined;
  }

  function extendedEventArgs(event) {
    pressures.push(event.pressure);
    event.srcViews = compute.srcViews;
    event.currentTime = Date.now();
    event.direction = direction;
    event.orientation = orientation;
    if (!beginEvent) return;
    event.deltaX = event.pageX - (beginEvent?.pageX ?? 0);
    event.deltaY = event.pageY - (beginEvent?.pageY ?? 0);
    event.deltaC = calcHypotenuse(event.deltaX, event.deltaY);
    event.deltaAng = calculateAngle(event.deltaX, event.deltaY);
    if (!prveEvent) return;
    event.moveX = (prveEvent?.pageX ?? 0) - event.pageX;
    event.moveY = (prveEvent?.pageY ?? 0) - event.pageY;
    event.deltaTime = event.currentTime - (prveEvent?.currentTime ?? 0);
    event.speedX = event.moveX / event.deltaTime;
    event.speedY = event.moveY / event.deltaTime;
    if (!intervalEvent) return;
    event.velocityX = undefinedReturn(intervalEvent.velocityX, event.speedX);
    event.velocityY = undefinedReturn(intervalEvent.velocityY, event.speedY);
    if (event.currentTime - intervalEvent.currentTime >= COMPUTE_INTERVAL) {
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

  function dispatchEvent(name, event) {
    if (!currentView) return;
    const slideEvent = inheritPointerEvent(name, event);
    currentView.dispatchEvent(slideEvent);
    customEventNameMap.forEach((value) => {
      const customEventName = name.replace(/(Slide|slide)/, value);
      const customSlideEven = inheritPointerEvent(customEventName, event);
      currentView.dispatchEvent(customSlideEven);
    });
  }
})();

/**
 *
 * @param {*} view
 */
export function extendedSlideEvents(view = document.createElement("div"), options = {}) {
  function $set(name, value) {
    if (!view.$$) return;
    view.$$[name] = value;
  }

  function onCapturePointerdown(event) {
    $set("parentViews", [...srcViews]);
    srcViews.push(event.currentTarget);
    $set("srcViews", [...srcViews]);
    compute.isGetPdownLock = false;
  }

  function onCapturePointerdownFinsh(event) {
    compute.srcViews = [...srcViews];
    currentView = srcViews.at(-1);
    srcViews = [];
  }

  function onPointerdown(event) {
    if (!compute.isGetPdownLock) {
      onCapturePointerdownFinsh(event);
      compute.isGetPdownLock = true;
    }
    $set("slideEventViews", [...compute.srcViews]);
  }

  function destroy() {
    view.removeEventListener("pointerdown", onCapturePointerdown, {
      passive: false,
      capture: true,
    });
    view.removeEventListener("pointerdown", onPointerdown);
  }

  function bindEvents() {
    view.addEventListener("pointerdown", onCapturePointerdown, { passive: false, capture: true });
    view.addEventListener("pointerdown", onPointerdown);
    let config = { customEventName: "", direction: "", ...options };
    if (config.customEventName) {
      customEventNameMap.set(config.customEventName, config.customEventName);
      $set("slideCustomEventName", config.customEventName);
    }
  }

  return { bindEvents, destroy };
}

function undefinedReturn(params, def) {
  if (isNaN(params)) return def;
  if (params === undefined) return def;
  return params;
}

function inheritPointerEvent(
  name,
  event = {},
  eventInitDict = { bubbles: true, cancelable: true },
) {
  const newEvent = new SlideEvent(name, eventInitDict);
  for (const key in event) {
    try {
      if (newEvent[key] === undefined) newEvent[key] = event[key];
    } catch (error) {
      console.warn(error);
    }
  }
  return newEvent;
}

function calcHypotenuse(a, b) {
  return Math.sqrt(a * a + b * b);
}

function calculateAngle(dx, dy) {
  const angleRadians = Math.atan2(dy, dx);
  const angleDegrees = angleRadians * (180 / Math.PI);
  const angleNormalized = 360 - ((angleDegrees + 360) % 360);
  return angleNormalized;
}

function stringUpperFirstCase(str) {
  const s = str[0].toUpperCase() + str.slice(1);
  return s;
}
