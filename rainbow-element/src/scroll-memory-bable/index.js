import './index.css';
import { RainbowElement } from '../base/index.js'

export class RScrollMemoryBubble extends RainbowElement {
    static observedAttributes = this.$initProps({
        top: String,
        left: String,
        right: String,
        bottom: String,
        position: { type: String, default: "right" },
        visible: { type: Boolean, default: true },
        'visible-distance': { type: Number, default: 100 },
        'visible-reversal': Boolean
    });

    $visible = true;
    $cacheMoveY = 0;
    $scrollParent;
    $renderEvents = ['$onConnected', '$onAttrsChange'];

    $onRender() {
        this.$bindStyle();
        this.$bindClass();
    }

    $bindClass() {
        this.$setClass((props) => [
            "r-scroll-memory-bubble",
            "r-scroll-memory-bubble-" + props.position,
            this.$visible ? `r-scroll-memory-bubble-visible` : `r-scroll-memory-bubble-hide`,
            this.$visible ? `r-scroll-memory-bubble-visible-${props.position}` : `r-scroll-memory-bubble-hide-${props.position}`,
        ])
    }

    $bindStyle() {
        this.$setStyle((props) => ({ top: props.top, right: props.right, bottom: props.bottom, left: props.left }))
    }

    $onConnected() {
        this.$visible = this.$attrs.visible;
        this.$scrollParent = this.$getParentByType('RScroll')
        this.$scrollParent.addEventListener('scrollUp', this.$setVisibleFalse.bind(this))
        this.$scrollParent.addEventListener('scrollDown', this.$setVisibleTrue.bind(this))
    }

    $onDisconnected() {
        this.$scrollParent.removeEventListener('scrollUp', this.$setVisibleFalse.bind(this));
        this.$scrollParent.removeEventListener('scrollDown', this.$setVisibleTrue.bind(this));
    }

    $setVisibleTrue(event) {
        if (this.$visible === true) return this.$cacheMoveY = 0;
        this.$cacheMoveY = this.$cacheMoveY + Math.abs(event.moveY);
        if (this.$cacheMoveY >= this.$attrs['visible-distance']) {
            this.$cacheMoveY = 0;
            this.$visible = true;
            this.$bindClass();
        }
    }

    $setVisibleFalse(event) {
        if (this.$visible === false) return this.$cacheMoveY = 0;
        this.$cacheMoveY = this.$cacheMoveY + Math.abs(event.moveY);
        if (this.$cacheMoveY >= this.$attrs['visible-distance']) {
            this.$cacheMoveY = 0;
            this.$visible = false;
            this.$bindClass();
        }
    }
}

customElements.define('r-scroll-memory-bable', RScrollMemoryBubble);