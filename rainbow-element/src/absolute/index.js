import { RainbowElement } from '../base/index.js'
import './index.css'

export class RAbsolute extends RainbowElement {
    static observedAttributes = this.$initProps({
        position: [Boolean, String],
        left: [Number, String],
        right: [Number, String],
        bottom: [Number, String],
        top: [Number, String],
    });

    $renderEvents = ['$onConnected', '$onAttrsChange']

    $onRender() {
        let props = this.$attrs
        this.classList.add(...[
            "r-absolute",
            props.position && 'r-absolute-' + props.position,
        ].filter(Boolean))
    }

}

customElements.define("r-absolute", RAbsolute);