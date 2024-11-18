import './index.css';
import { RainbowElement } from '../base/index.js'

export class RScrollSticky extends RainbowElement {
    static observedAttributes = this.$initProps({
        top: Number,
        bottom: Number,
        'active-top': Number, // r-scroll-sticky-act 的高度
        'opacity-ani': Boolean,
        'opacity-top': Number,
    });

    $isSticky = false;
    $isStickyTop = false;
    $isStickyBottom = false;
    $isStickyAct = false;
    $scrollParent;
    $opacity;


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

    $onScroll(event) {
        if (this.$attrs.top === undefined) return;
        const { scrollTop } = this.$scrollParent;
        const { top } = this.$attrs;
        let oTop = Math.round(this.$getOffsetTop(this.$scrollParent) - scrollTop);
        this.$isSticky = top === oTop;
        this.$isStickyTop = top >= oTop;
        this.$isStickyBottom = top <= oTop;
        if (this.$attrs['active-top'] !== undefined) this.$isStickyAct = scrollTop >= this.$attrs['active-top'];
        const opacity = ((scrollTop) / (this.$opacityTop - top)).toFixed(3)
        if (this.$attrs['opacity-ani'] === true) this.$opacity = opacity
        if (this.$attrs['opacity-ani'] === false) this.$opacity = 1 - opacity

        this.$bindClass();
        this.$bindStyle();
    }


}

customElements.define('r-scroll-sticky', RScrollSticky);