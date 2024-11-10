const COMPUTE_INTERVAL = 20;
let currentView = document.createElement('div');
let srcViews = [];
let timer;
export const customEventNameMap = new Map();
const compute = {
    isGetPdownLock: false,
    srcViews: [],
}
class SlideEvent extends CustomEvent {
    constructor(type, eventInitDict = {}) {
        super(type, { bubbles: true, cancelable: true, ...eventInitDict })
    }
}

(() => {
    // **TODO pointercancel
    document.addEventListener('pointerdown', onPointerdown);
    document.addEventListener('pointermove', onPointermove);
    document.addEventListener('pointerup', onPointerup);
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
        dispatchEvent('slideDown', event);
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
        if (!isVerdict) {
            if (event.deltaC > 8) {
                const ang = event.deltaAng;
                const isRightAng = 315 <= ang || ang < 45;
                const isTopAng = (45 <= ang && ang < 135);
                const isLeftAng = 135 <= ang && ang < 225;
                const isBottomAng = (225 <= ang && ang < 315);
                if (isRightAng) direction = 'right';
                if (isTopAng) direction = 'top';
                if (isLeftAng) direction = 'left';
                if (isBottomAng) direction = 'bottom';
                if (isRightAng || isLeftAng) orientation = 'horizontal'
                if (isTopAng || isBottomAng) orientation = 'vertical'
                isVerdict = true;
                return;
            }
            return;
        }
        if (isStart) {
            dispatchEvent('slideStrat', event);
            if (event.moveX < 0) dispatchEvent('slideRightStrat', event);
            if (event.moveY < 0) dispatchEvent('slideBottomStrat', event);
            if (event.moveX > 0) dispatchEvent('slideLeftStrat', event);
            if (event.moveY > 0) dispatchEvent('slideTopStrat', event);
            if (event.moveX !== 0) dispatchEvent('slideHorizontalStrat', event);
            if (event.moveY !== 0) dispatchEvent('slideVerticalStrat', event);
            isStart = false;
            return;
        }

        dispatchEvent('slideMove', event);
        if (event.moveX < 0) dispatchEvent('slideRight', event);
        if (event.moveY < 0) dispatchEvent('slideBottom', event);
        if (event.moveX > 0) dispatchEvent('slideLeft', event);
        if (event.moveY > 0) dispatchEvent('slideTop', event);
        if (event.moveX !== 0) dispatchEvent('slideHorizontal', event);
        if (event.moveY !== 0) dispatchEvent('slideVertical', event);
        timer = setTimeout(() => { intervalEvent = event }, COMPUTE_INTERVAL);
    }

    function onPointerup(event) {
        clearTimeout(timer);
        extendedEventArgs(event);
        if (isVerdict) {
            dispatchEvent('slideEnd', event);
            if (event.velocityX < 0) dispatchEvent('slideRightEnd', event);
            if (event.velocityY < 0) dispatchEvent('slideBottomEnd', event);
            if (event.velocityX > 0) dispatchEvent('slideLeftEnd', event);
            if (event.velocityY > 0) dispatchEvent('slideTopEnd', event);
            if (event.velocityX !== 0) dispatchEvent('slideHorizontalEnd', event);
            if (event.velocityY !== 0) dispatchEvent('slideVerticalEnd', event);
        }
        dispatchEvent('slideUp', event)
        currentView = undefined
    }

    function extendedEventArgs(event) {
        pressures.push(event.pressure);
        event.srcViews = compute.srcViews;
        event.currentTime = Date.now();
        event.direction = direction
        event.orientation = orientation
        if (!beginEvent) return
        event.deltaX = event.pageX - (beginEvent?.pageX ?? 0);
        event.deltaY = event.pageY - (beginEvent?.pageY ?? 0);
        event.deltaC = calcHypotenuse(event.deltaX, event.deltaY);
        event.deltaAng = calculateAngle(event.deltaX, event.deltaY);
        if (!prveEvent) return
        event.moveX = (prveEvent?.pageX ?? 0) - event.pageX;
        event.moveY = (prveEvent?.pageY ?? 0) - event.pageY;
        event.deltaTime = event.currentTime - (prveEvent?.currentTime ?? 0);
        event.speedX = (event.moveX / event.deltaTime);
        event.speedY = (event.moveY / event.deltaTime);
        if (!intervalEvent) return
        event.velocityX = undefinedReturn(intervalEvent.velocityX, event.speedX)
        event.velocityY = undefinedReturn(intervalEvent.velocityY, event.speedY)
        if ((event.currentTime - intervalEvent.currentTime) >= COMPUTE_INTERVAL) {
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
            event.velocityX = Number((moveX / deltaTime * avgPressure).toFixed(2))
            event.velocityY = Number((moveY / deltaTime * avgPressure).toFixed(2))
            intervalEvent = event;
            pressures = []
        }
    }

    function dispatchEvent(name, event) {
        if (!currentView) return
        const slideEvent = inheritPointerEvent(name, event);
        currentView.dispatchEvent(slideEvent);
        customEventNameMap.forEach(value => {
            const customEventName = name.replace(/(Slide|slide)/, value);
            const customSlideEven = inheritPointerEvent(customEventName, event);
            currentView.dispatchEvent(customSlideEven);
        })
    }

})()

/**
 * 
 * @param {*} view 
 */
export function extendedSlideEvents(view = document.createElement('div'), options = {}) {
    view.addEventListener('pointerdown', onCapturePointerdown, { passive: false, capture: true });
    view.addEventListener('pointerdown', onPointerdown);
    if (!view.__r_slide__) view.__r_slide__ = {};
    const _r_slide_ = view.__r_slide__;
    const config = { customEventName: '', direction: '', ...options }
    if (config.customEventName) customEventNameMap.set(config.customEventName, config.customEventName)
    _r_slide_.customEventName = config.customEventName;

    function onCapturePointerdown(event) {
        srcViews.push(event.currentTarget)
        _r_slide_.parentViews = [...srcViews];
        compute.isGetPdownLock = false;
    }

    function onPointerdown() {
        if (!compute.isGetPdownLock) {
            compute.srcViews = [...srcViews];
            _r_slide_.srcViews = [...srcViews];
            currentView = srcViews.at(-1);
            srcViews = [];
            compute.isGetPdownLock = true;
        }
    }

    function destroy() {
        view.removeEventListener('pointerdown', onCapturePointerdown, { passive: false, capture: true });
        view.removeEventListener('pointerdown', onPointerdown);
    }

    return { destroy }
}

function undefinedReturn(params, def) {
    if (isNaN(params)) return def
    if (params === undefined) return def
    return params
}

function inheritPointerEvent(name, event = {}, eventInitDict = {}) {
    const newEvent = new SlideEvent(name, eventInitDict);
    for (const key in event) {
        try {
            if (newEvent[key] === undefined) newEvent[key] = event[key];
        } catch (error) {
            console.warn(error);
        }
    }
    return newEvent
}

function calcHypotenuse(a, b) {
    return Math.sqrt(a * a + b * b);
}

function calculateAngle(dx, dy) {
    const angleRadians = Math.atan2(dy, dx);
    const angleDegrees = angleRadians * (180 / Math.PI);
    const angleNormalized = 360 - (angleDegrees + 360) % 360;
    return angleNormalized;

}

function stringUpperFirstCase(str) {
    const s = str[0].toUpperCase() + str.slice(1);
    return s
}