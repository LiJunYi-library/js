const COMPUTE_INTERVAL = 25;
let pointerCount = 0;
class SlideEvent extends CustomEvent {
    constructor(type, eventInitDict = {}) {
        super(type, { bubbles: true, cancelable: true, ...eventInitDict })
    }
}

/**
 * 
 * @param {*} view 
 */
export function extendedSlideEvents(view = document.createElement('div'), options = {}) {
    // **TODO pointercancel
    view.addEventListener('pointerdown', onCapturePointerdown, { passive: false, capture: true });
    view.addEventListener('pointerdown', onPointerdown);
    view.addEventListener('pointermove', onPointermove);
    view.addEventListener('pointerup', onPointerup);
    let beginEvent;
    let isVerdict = false;
    let prveEvent;
    let intervalEvent;
    let direction;
    let recordPointerCount;
    let orientation;
    const config = {
        onCaptureSlideDown: () => undefined,
        onSlideDown: () => undefined,
        onSlideEnd: () => undefined,
        onSlideUp: () => undefined,
        onSlideStrat: () => undefined,
        onSlideMove: () => undefined,
        onSlideRight: () => undefined,
        onSlideTop: () => undefined,
        onSlideLeft: () => undefined,
        onSlideBottom: () => undefined,
        onSlideHorizontal: () => undefined,
        onSlideVertical: () => undefined,
        customEventName: '',
        direction: '',
        ...options,
    }


    function onCapturePointerdown(event) {
        pointerCount++;
        direction = undefined
        orientation = undefined
        onDispatchEvent('captureSlideDown', event)
    }

    function onPointerdown(event) {
        recordPointerCount = pointerCount;
        event.currentTime = Date.now();
        beginEvent = event;
        prveEvent = event;
        intervalEvent = event;
        isVerdict = false;
        console.log('onPointerdown', recordPointerCount);
        onDispatchEvent('slideDown', event)
    }

    function onPointerup(event) {
        pointerCount = 0;
        if (!isVerdict) return;
        extendedEventArgs(event);
        console.log('onPointerup', recordPointerCount);

        triggerEvent(event, () => {
            onDispatchEvent('slideEnd', event)
        })
        onDispatchEvent('slideUp', event)
    }


    function onPointermove(event) {
        pointerCount = 0;
        extendedEventArgs(event);
        prveEvent = event;
        //////////////////
        if (!isVerdict) {
            // console.log('我处于判断阶段');
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
                console.log('我判断结束wei', direction, orientation);
                triggerEvent(event, () => {
                    onDispatchEvent('slideStrat', event);
                })
                return;
            }
            return;
        }
        //////////////// console.log('我判断结束 执行事件', event.movementX, event.moveX);
        triggerEvent(event, () => {
            onDispatchEvent('slideMove', event);
            directions().forEach((eName) => directionDispatch?.[eName]?.(event))
        })
    }

    function triggerEvent(event, callBack) {
        const isRoot = recordPointerCount === 1;
        if (isRoot) return callBack()
        // 如果判定的方向 在 我传入的判定方向里那么我就要去消费我的事件并阻止冒泡
        if (directions().includes(direction) || directions().includes(orientation)) {
            event.stopPropagation();
            callBack()
        }
    }

    function directions() {
        let mList = (config.direction instanceof Array) ? config.direction : [config.direction];
        if (!mList.length) mList = ['default'];
        return mList;
    }

    const directionDispatch = {
        right(event) {
            if (event.moveX < 0) onDispatchEvent('slideRight', event);
        },
        top(event) {
            if (event.moveY < 0) onDispatchEvent('slideTop', event);
        },
        left(event) {
            if (event.moveX > 0) onDispatchEvent('slideLeft', event);
        },
        bottom(event) {
            if (event.moveY > 0) onDispatchEvent('slideBottom', event);
        },
        horizontal(event) {
            if (event.moveX !== 0) onDispatchEvent('slideHorizontal', event);
        },
        vertical(event) {
            if (event.moveY !== 0) onDispatchEvent('slideVertical', event);
        },
        default(event) {
            this.horizontal(event);
            this.vertical(event);
            this.right(event);
            this.top(event);
            this.left(event);
            this.bottom(event);
        }
    }

    function onDispatchEvent(name = '', event) {
        const slideEvent = inheritPointerEvent(name, event);
        config?.['on' + stringUpperFirstCase(name)]?.(slideEvent);
        view.dispatchEvent(slideEvent);
        if (!config.customEventName) return;
        const customEventName = name.replace(/(Slide|slide)/, config.customEventName)
        const customSlideEven = inheritPointerEvent(customEventName, event);
        config?.['on' + stringUpperFirstCase(customEventName)]?.(slideEvent);
        view.dispatchEvent(customSlideEven);
    }

    function extendedVerdictEvent(event) {

    }

    function extendedEventArgs(event) {
        event.currentTime = Date.now();
        event.deltaX = event.pageX - (beginEvent?.pageX ?? 0);
        event.deltaY = event.pageY - (beginEvent?.pageY ?? 0);
        event.deltaC = calcHypotenuse(event.deltaX, event.deltaY);
        event.deltaAng = calculateAngle(event.deltaX, event.deltaY);
        event.moveX = (prveEvent?.pageX ?? 0) - event.pageX;
        event.moveY = (prveEvent?.pageY ?? 0) - event.pageY;
        event.deltaTime = event.currentTime - (prveEvent?.currentTime ?? 0);
        event.speedX = (event.moveX / event.deltaTime);
        event.speedY = (event.moveY / event.deltaTime);
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