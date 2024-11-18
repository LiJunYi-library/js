import './index.css';
import { RainbowElement } from '../base/index.js'

export class RScrollSticky extends RainbowElement {
    static observedAttributes = this.$initProps({
        top: Number,
        bottom: Number,
        activetop: Number, // r-scroll-sticky-act 的高度
        opacityani: Boolean
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

    $onScroll(event) {
        if (this.$attrs.top === undefined) return;
        const { scrollTop } = this.$scrollParent;
        let oTop = Math.round(this.$getOffsetTop(this.$scrollParent) - scrollTop);
        this.$isSticky = this.$attrs.top === oTop;
        this.$isStickyTop = this.$attrs.top >= oTop;
        this.$isStickyBottom = this.$attrs.top <= oTop;
        if (this.$attrs.activetop !== undefined) this.$isStickyAct = scrollTop >= this.$attrs.activetop;
        console.log(this.$attrs)
        if (this.$attrs.opacityani === true) this.$opacity = ((this.$initTop - oTop) / (this.$initTop - this.$attrs.top)).toFixed(3)
        if (this.$attrs.opacityani === false) this.$opacity = (1 - (this.$initTop - oTop) / (this.$initTop - this.$attrs.top)).toFixed(3)

        this.$bindClass();
        this.$bindStyle();
        console.log('r-scroll-sticky onScroll', this.$opacity);

    }


}

customElements.define('r-scroll-sticky', RScrollSticky);