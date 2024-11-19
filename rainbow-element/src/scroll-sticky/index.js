import './index.css';
import { RainbowElement } from '../base/index.js'

export class RScrollSticky extends RainbowElement {
    static observedAttributes = this.$initProps({
        top: Number,
        bottom: Number,
        'active-top': Number, // r-scroll-sticky-act 的高度
        'opacity-ani': Boolean,
        'opacity-top': Number,
        'visible-ani': Boolean,
        'visible-top': Number,
        'opacity-delay': { type: Number, default: 0 }
    });

    $isSticky = false;
    $isStickyTop = false;
    $isStickyBottom = false;
    $isStickyAct = false;
    $scrollParent;
    $opacity;
    $display;


    $renderEvents = ['$onConnected', '$onAttrsChange'];
    $onRender() {
        this.$bindStyle();
        this.$bindClass();
    }

    $bindClass() {
        this.$setClass((props) => [
            "r-scroll-sticky",
            this.$isSticky && "r-scroll-sticky-sticky",
            !this.$isSticky && "r-scroll-sticky-un-sticky",
            this.$isStickyTop && "r-scroll-sticky-sticky-top",
            !this.$isStickyTop && "r-scroll-sticky-un-sticky-top",
            !this.$isStickyBottom && "r-scroll-sticky-un-sticky-bottom",
            this.$isStickyAct && "r-scroll-sticky-act",
        ])
    }

    $bindStyle() {
        this.$setStyle((props) => ({
            top: (props.top) + 'px',
            bottom: (props.bottom) + 'px',
            opacity: this.$opacity,
            display: this.$display,
        }))
    }

    $onConnected() {
        this.$scrollParent = this.$getParentByType('RScroll')
        this.$initTop = this.$getOffsetTop(this.$scrollParent);
        this.$onScroll();
        this.$scrollParent.addEventListener('scroll', this.$onScroll.bind(this))
    }

    $onDisconnected() {
        this.$scrollParent.removeEventListener('scroll', this.$onScroll.bind(this));
    }

    get $opacityTop() {
        if (this.$attrs['opacity-top'] !== undefined) return this.$attrs['opacity-top']
        return this.$initTop
    }

    get $visibleTop() {
        if (this.$attrs['visible-top'] !== undefined) return this.$attrs['visible-top']
        return this.$opacityTop
    }

    $onScroll(event) {
        // console.log(this.$attrs);
        if (this.$attrs.top === undefined) return;
        const { scrollTop, } = this.$scrollParent;
        const { top, opacityDelay } = this.$attrs;
        let oTop = Math.round(this.$getOffsetTop(this.$scrollParent) - scrollTop);
        this.$isSticky = top === oTop;
        this.$isStickyTop = top >= oTop;
        this.$isStickyBottom = top <= oTop;
        if (this.$attrs['active-top'] !== undefined) this.$isStickyAct = scrollTop >= this.$attrs['active-top'];

        const opacity = ((scrollTop - opacityDelay) / (this.$opacityTop - top)).toFixed(3)
        if (this.$attrs['opacity-ani'] === true) this.$opacity = opacity
        if (this.$attrs['opacity-ani'] === false) this.$opacity = 1 - opacity

        const visible = ((scrollTop) / (this.$visibleTop - top))
        if (this.$attrs['visible-ani'] === true) this.$display = visible > 1 ? 'block' : 'none';
        if (this.$attrs['visible-ani'] === false) this.$display = (1 - visible) < 0 ? 'none' : 'block';

        this.$bindClass();
        this.$bindStyle();
    }


}

customElements.define('r-scroll-sticky', RScrollSticky);

export class RScrollFixed extends RScrollSticky {
    $bindClass() {
        this.$setClass((props) => [
            "r-scroll-fixed",
            this.$isSticky && "r-scroll-fixed-fixed",
            !this.$isSticky && "r-scroll-fixed-un-fixed",
            this.$isStickyTop && "r-scroll-fixed-fixed-top",
            !this.$isStickyTop && "r-scroll-fixed-un-fixed-top",
            !this.$isStickyBottom && "r-scroll-fixed-un-fixed-bottom",
            this.$isStickyAct && "r-scroll-fixed-act",
        ])
    }
}

customElements.define('r-scroll-fixed', RScrollFixed);

