const COMPUTE_INTERVAL = 25;
let currentView = document.createElement('div');
let srcViews = [];
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

    function onPointerdown(event) {
        extendedEventArgs(event);
        dispatchEvent('slideDown', event);

        beginEvent = event;
        prveEvent = event;
        intervalEvent = event;
        isVerdict = false;
        isStart = true;
        direction = undefined;
        orientation = undefined;
    }

    function onPointermove(event) {
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
            isStart = false;
            return;
        }

        dispatchEvent('slideMove', event);
    }

    function onPointerup(event) {
        extendedEventArgs(event);
        if (isVerdict) dispatchEvent('slideEnd', event)
        dispatchEvent('slideUp', event)
    }

    function extendedEventArgs(event) {
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
            const moveX = (intervalEvent?.pageX ?? 0) - event.pageX;
            const moveY = (intervalEvent?.pageY ?? 0) - event.pageY;
            const deltaTime = event.currentTime - (intervalEvent?.currentTime ?? 0);
            event.velocityX = moveX / deltaTime
            event.velocityY = moveY / deltaTime
            intervalEvent = event;
        }
    }

    function dispatchEvent(name, event) {
        const slideEvent = inheritPointerEvent(name, event)
        currentView.dispatchEvent(slideEvent)
    }

})()



/**
 * 
 * @param {*} view 
 */
export function extendedSlideEvents(view = document.createElement('div'), options = {}) {
    // **TODO pointercancel
    view.addEventListener('pointerdown', onCapturePointerdown, { passive: false, capture: true });
    view.addEventListener('pointerdown', onPointerdown);
    // view.addEventListener('pointermove', onCapturePointermove, { passive: false, capture: true });
    // view.addEventListener('pointerup', onCapturePointerup, { passive: false, capture: true });
    if (!view.__r_slide__) view.__r_slide__ = {};
    const _r_slide_ = view.__r_slide__;

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

    // function onCapturePointerup(event) {
    //     srcViews = [];
    // }

    // function onCapturePointermove(event) {
    //     srcViews = [];
    // }

    function destroy() {
        view.removeEventListener('pointerdown', onCapturePointerdown, { passive: false, capture: true });
        view.removeEventListener('pointerdown', onPointerdown);
        // view.removeEventListener('pointermove', onCapturePointermove);
        // view.removeEventListener('pointerup', onCapturePointerup);
    }

    return { destroy }
}



function undefinedReturn(params, def) {
    if (isNaN(params)) return def
    if (params === undefined) return def
    return params
}

function fixedFloat(num) {
    return parseFloat(num.toFixed(2));
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