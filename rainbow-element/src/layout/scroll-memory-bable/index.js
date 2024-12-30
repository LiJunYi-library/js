import './index.css';
import { RainbowElement } from '../../base/index.js'

export class RScrollMemoryBubble extends RainbowElement {
    static observedAttributes = this.$registerProps({
        'r-orientation': { type: String, default: "right" },  // "left" "right" "top" "bottom"
        'r-init-visibility': { type: String, default: 'visible' }, // 'hidden' 'visible'
        'r-visible-distance': { type: String, default: '100px' }, // px
        'r-visible-reversal': String // 'noReversal' 'reversal'
    });

    $$visible = true;
    $$cacheMoveY = 0;
    $$scrollParent;

    connectedCallback(...arg) {
        super.connectedCallback(...arg);
        this.$$visible = this.$.DATA.rInitVisibility === 'visible'
        this.$$scrollParent = this.$.findParentByType('RScroll');

        this.$$scrollParent.addEventListener('scrollUp', this.$$setVisibleFalse.bind(this))
        this.$$scrollParent.addEventListener('scrollDown', this.$$setVisibleTrue.bind(this))
    }

    disconnectedCallback(...arg) {
        super.connectedCallback(...arg);

        this.$$scrollParent.removeEventListener('scrollUp', this.$$setVisibleFalse.bind(this));
        this.$$scrollParent.removeEventListener('scrollDown', this.$$setVisibleTrue.bind(this));
    }

    $$setClass() {
        const { rOrientation } = this.$.DATA
        this.$.setClass(() => ([
            "r-scroll-memory-bubble-" + rOrientation,
            this.$$visible ? `r-scroll-memory-bubble-visible` : `r-scroll-memory-bubble-hide`,
            this.$$visible ? `r-scroll-memory-bubble-visible-${rOrientation}` : `r-scroll-memory-bubble-hide-${rOrientation}`,
        ]))
    }

    $$setVisibleTrue(event) {
        if (this.$$visible === true) return this.$$cacheMoveY = 0;
        this.$$cacheMoveY = this.$$cacheMoveY + Math.abs(event.moveY);
        if (this.$$cacheMoveY >= this.$.DATA.rVisibleDistance) {
            this.$$cacheMoveY = 0;
            this.$$visible = true;
            this.$$setClass();
        }
    }

    $$setVisibleFalse(event) {
        if (this.$$visible === false) return this.$$cacheMoveY = 0;
        this.$$cacheMoveY = this.$$cacheMoveY + Math.abs(event.moveY);
        if (this.$$cacheMoveY >= this.$.DATA.rVisibleDistance) {
            this.$$cacheMoveY = 0;
            this.$$visible = false;
            this.$$setClass();
        }
    }

    $render() {
        this.$$setClass();
    }
}

customElements.define('r-scroll-memory-bable', RScrollMemoryBubble);
