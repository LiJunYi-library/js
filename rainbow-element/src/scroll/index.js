import './index.css';
import { RainbowElement } from '../base/index.js'

export class RScroll extends RainbowElement {
    $elementName = 'RScroll'
    $scrollEl;

    get scrollTop() {
        return this.$scrollEl.scrollTop;
    }

    set scrollTop(v) {
        this.$scrollEl.scrollTop = v;
    }

    scrollBy(...arg) {
        this.$scrollEl.scrollBy(...arg)
    }

    scrollTo(...arg) {
        this.$scrollEl.scrollTo(...arg)
    }

    constructor(...arg) {
        super(...arg);
        this.attachShadow({ mode: 'open' });

        this.$scrollEl = document.createElement('div');
        this.$scrollEl.className = 'r-scroll-element';
        this.$scrollEl.setAttribute('part', 'r-scroll-element  sdt');

        const content = document.createElement('div');
        content.className = 'r-scroll-content';
        content.setAttribute('part', 'r-scroll-content  sdt');

        const topSlot = document.createElement('slot');
        topSlot.setAttribute('name', 'top');
        topSlot.className = 'top';
        const contentSlot = document.createElement('slot');
        contentSlot.className = 'content';
        const bottomSlot = document.createElement('slot');
        bottomSlot.setAttribute('name', 'bottom');
        bottomSlot.className = 'bottom';

        content.appendChild(contentSlot);
        this.$scrollEl.appendChild(topSlot);
        this.$scrollEl.appendChild(content);
        this.$scrollEl.appendChild(bottomSlot);
        this.shadowRoot.appendChild(this.$scrollEl);

        this.$scrollEl.addEventListener('scroll', this.$onScroll.bind(this));
    }

    $onScroll(event) {
        const sEl = this.$scrollEl;
        event.scrollTop = sEl.scrollTop;
        event.moveY = sEl.$prveScrollTop - sEl.scrollTop;
        if (event.moveY < 0) this.dispatchEvent(this.$createCustomEvent('scrollUp', event));
        if (this.onscroll) this.onscroll(event)
        this.dispatchEvent(this.$createCustomEvent('scroll', event))
        if (event.moveY > 0) this.dispatchEvent(this.$createCustomEvent('scrollDown', event));
        sEl.$prveScrollTop = sEl.scrollTop;
    }

    $onConnected() {
        this.$scrollEl.$prveScrollTop = this.$scrollEl.scrollTop
        this.classList.add('r-scroll')
    }

    $onDisconnected() {
        this.$scrollEl.removeEventListener('scroll', this.$onScroll.bind(this));
    }
}

customElements.define('r-scroll', RScroll);