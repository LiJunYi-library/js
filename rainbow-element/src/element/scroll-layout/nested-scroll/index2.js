import { extendedSlideEvents } from "../../../events/slide.js";
import { findParentByLocalName } from "../../../utils/index.js";

class NestedScrollLayout extends HTMLElement {
    static get observedAttributes() {
        return ['scroll-direction'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._initializeDOM();
        this._setupState();
        this._setupEventListeners();
    }

    _setupState() {
        this.$$ = {
            nestedChild: undefined,
            nestedChildren: [],
            nestedParent: undefined,
            setNestedChild: () => {
                if (this.$$.nestedChildren.length === 1) {
                    this.$$.nestedChild = this.$$.nestedChildren[0];
                    return;
                }
                if (!this.$$.nestedChildren.length) return;
                const mOffset = this.getBoundingClientRect();
                this.$$.nestedChild = this.$$.nestedChildren.find((ele) => {
                    const offset = ele.getBoundingClientRect();
                    return offset.left - mOffset.left >= -1 && offset.right <= mOffset.right + 1;
                });
            },
            slideEvent: extendedSlideEvents(this),
        };
    }

    _initializeDOM() {
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                width: 100%;
                height: 100%;
                overflow: hidden;
                position: relative;
            }

            .nested-scroll-container {
                width: 100%;
                height: 100%;
                overflow: auto;
                -webkit-overflow-scrolling: touch;
            }

            .nested-scroll-content {
                min-height: 100%;
                position: relative;
            }

            /* 隐藏滚动条但保持功能 */
            .nested-scroll-container::-webkit-scrollbar {
                width: 0;
                background: transparent;
            }
        `;

        const container = document.createElement('div');
        container.className = 'nested-scroll-container';

        const content = document.createElement('div');
        content.className = 'nested-scroll-content';

        container.appendChild(content);
        this.shadowRoot.append(style, container);

        this._container = container;
        this._content = content;
    }

    _setupEventListeners() {
        this._setupSlideEvents();
        this._setupScrollEvents();
        this._setupResizeObserver();
    }

    _setupSlideEvents() {
        const direction = this.getAttribute('scroll-direction') || 'vertical';
        this.$$.slideEvent.bindEvents();

        if (direction === 'vertical') {
            this.addEventListener('slideTop', this._handleSlideTop.bind(this), { capture: true });
            this.addEventListener('slideBottom', this._handleSlideBottom.bind(this));
            this.addEventListener('slideTopEnd', this._handleSlideTopEnd.bind(this), { capture: true });
            this.addEventListener('slideBottomEnd', this._handleSlideBottomEnd.bind(this));
        } else {
            this.addEventListener('slideLeft', this._handleSlideLeft.bind(this));
            this.addEventListener('slideRight', this._handleSlideRight.bind(this));
            this.addEventListener('slideLeftEnd', this._handleSlideLeftEnd.bind(this));
            this.addEventListener('slideRightEnd', this._handleSlideRightEnd.bind(this));
        }
    }

    _setupScrollEvents() {
        this._container.addEventListener('scroll', () => {
            this._dispatchScrollEvent();
            this.$$.setNestedChild();
        }, { passive: true });
    }

    _setupResizeObserver() {
        this._resizeObserver = new ResizeObserver(() => {
            this.$$.setNestedChild();
        });
        this._resizeObserver.observe(this);
    }

    _handleSlideTop(event) {
        if (this._isScrollConflict(event, 'vertical')) return;
        if (this._isAtBottom()) return;
        event.stopPropagation();
        this._scrollBy(-event.moveY);
    }

    _handleSlideBottom(event) {
        if (this._isScrollConflict(event, 'vertical')) return;
        if (this._isAtTop()) return;
        event.stopPropagation();
        this._scrollBy(-event.moveY);
    }

    _handleSlideTopEnd(event) {
        if (this._isScrollConflict(event, 'vertical')) return;
        if (this._isAtBottom()) return;
        event.stopPropagation();
        this._startInertialScroll(-event.velocityY);
    }

    _handleSlideBottomEnd(event) {
        if (this._isScrollConflict(event, 'vertical')) return;
        if (this._isAtTop()) return;
        event.stopPropagation();
        this._startInertialScroll(-event.velocityY);
    }

    _handleSlideLeft(event) {
        if (event.orientation !== 'horizontal') return;
        if (this._isAtRight()) return;
        event.stopPropagation();
        this._scrollByX(-event.moveX);
        this.$$.setNestedChild();
    }

    _handleSlideRight(event) {
        if (event.orientation !== 'horizontal') return;
        if (this._isAtLeft()) return;
        event.stopPropagation();
        this._scrollByX(-event.moveX);
        this.$$.setNestedChild();
    }

    _handleSlideLeftEnd(event) {
        this._handleSlideHorizontalEnd(event);
    }

    _handleSlideRightEnd(event) {
        this._handleSlideHorizontalEnd(event);
    }

    _handleSlideHorizontalEnd(event) {
        if (event.orientation !== 'horizontal') return;
        if (this._isAtRight() || this._isAtLeft()) return;
        event.stopPropagation();

        const currentScroll = this._container.scrollLeft;
        const pageWidth = this._container.offsetWidth;
        const targetPage = Math.round(currentScroll / pageWidth);

        this._smoothScrollToX(targetPage * pageWidth);
    }

    _isScrollConflict(event, orientation) {
        return event.srcViews.every(el =>
            el.getAttribute('scroll-direction') === orientation) ? false :
            event.orientation !== orientation;
    }

    _isAtTop() {
        return this._container.scrollTop <= 0;
    }

    _isAtBottom() {
        return Math.ceil(this._container.scrollTop + this._container.offsetHeight) >=
               this._container.scrollHeight;
    }

    _isAtLeft() {
        return this._container.scrollLeft <= 0;
    }

    _isAtRight() {
        return this._container.scrollLeft + this._container.offsetWidth >=
               this._container.scrollWidth;
    }

    _scrollBy(delta) {
        this._container.scrollTop += delta;
    }

    _scrollByX(delta) {
        this._container.scrollLeft += delta;
    }

    _startInertialScroll(velocity) {
        if (this._scrollAnimation) {
            cancelAnimationFrame(this._scrollAnimation);
        }

        const startTime = performance.now();
        const startPosition = this._container.scrollTop;
        const deceleration = 0.004;
        const initialVelocity = velocity;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const newVelocity = initialVelocity * Math.exp(-deceleration * elapsed);

            if (Math.abs(newVelocity) < 0.1) {
                return;
            }

            const delta = newVelocity * 16; // 假设 60fps
            this._scrollBy(delta);

            if (this._isAtTop() || this._isAtBottom()) {
                return;
            }

            this._scrollAnimation = requestAnimationFrame(animate);
        };

        this._scrollAnimation = requestAnimationFrame(animate);
    }

    _smoothScrollToX(targetX) {
        if (this._horizontalScrollAnimation) {
            cancelAnimationFrame(this._horizontalScrollAnimation);
        }

        const startPosition = this._container.scrollLeft;
        const distance = targetX - startPosition;
        const duration = 300;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeProgress = this._easeInOutCubic(progress);
            this._container.scrollLeft = startPosition + distance * easeProgress;

            if (progress < 1) {
                this._horizontalScrollAnimation = requestAnimationFrame(animate);
            }
        };

        this._horizontalScrollAnimation = requestAnimationFrame(animate);
    }

    _easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    _dispatchScrollEvent() {
        this.dispatchEvent(new CustomEvent('scroll', {
            detail: {
                scrollTop: this._container.scrollTop,
                scrollLeft: this._container.scrollLeft,
                scrollHeight: this._container.scrollHeight,
                scrollWidth: this._container.scrollWidth,
                clientHeight: this._container.clientHeight,
                clientWidth: this._container.clientWidth,
                isAtTop: this._isAtTop(),
                isAtBottom: this._isAtBottom(),
                isAtLeft: this._isAtLeft(),
                isAtRight: this._isAtRight()
            },
            bubbles: true,
            composed: true
        }));
    }

    connectedCallback() {
        this.$$.nestedParent = findParentByLocalName(['nested-scroll-layout'], this);
        if (this.$$.nestedParent) {
            this.$$.nestedParent.$$.nestedChildren.push(this);
        }
        this.$$.setNestedChild();
        this.$$.slideEvent.bindEvents();
    }

    disconnectedCallback() {
        if (this.$$.nestedParent) {
            const index = this.$$.nestedParent.$$.nestedChildren.indexOf(this);
            if (index > -1) {
                this.$$.nestedParent.$$.nestedChildren.splice(index, 1);
            }
        }
        this.$$.slideEvent.destroy();
        this._resizeObserver.disconnect();

        if (this._scrollAnimation) {
            cancelAnimationFrame(this._scrollAnimation);
        }
        if (this._horizontalScrollAnimation) {
            cancelAnimationFrame(this._horizontalScrollAnimation);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'scroll-direction' && oldValue !== newValue) {
            this._setupSlideEvents();
        }
    }
}

// 注册自定义元素
customElements.define('nested-scroll-layout', NestedScrollLayout);

export default NestedScrollLayout;
