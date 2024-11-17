import './index.css';
import { RainbowElement } from '../base/index.js'

export class RScroll extends RainbowElement {
    constructor(...arg) {
        super(...arg);

        this.attachShadow({ mode: 'open' });
        const box = document.createElement('div');
        box.className = 'r-scroll-content';
        box.setAttribute('part', 'r-scroll-content  sdt');
        const topSlot = document.createElement('slot');
        topSlot.setAttribute('name', 'top');
        topSlot.className = 'top';
        const contentSlot = document.createElement('slot');
        contentSlot.className = 'content';
        const bottomSlot = document.createElement('slot');
        bottomSlot.setAttribute('name', 'bottom');
        bottomSlot.className = 'bottom';
        box.appendChild(contentSlot);
        this.shadowRoot.appendChild(topSlot);
        this.shadowRoot.appendChild(box);
        this.shadowRoot.appendChild(bottomSlot);

        this.addEventListener('scroll', this.$onScroll.bind(this));
    }
    
    $elementName = 'RScroll'
    $prveScrollTop = this.scrollTop;

    $onScroll(event) {
        event.scrollTop = this.scrollTop;
        event.moveY = this.$prveScrollTop - this.scrollTop;
        if (event.moveY < 0) this.dispatchEvent(this.$createCustomEvent('scrollUp', event));
        if (event.moveY > 0) this.dispatchEvent(this.$createCustomEvent('scrollDown', event));
        this.$prveScrollTop = this.scrollTop;
    }

    $onConnected() {
        this.classList.add('r-scroll')
    }

    $onDisconnected() {
        this.removeEventListener('scroll', this.$onScroll.bind(this));
    }
}

customElements.define('r-scroll', RScroll);