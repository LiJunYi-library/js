import { RainbowElement } from '../../base/index.js'
import './index.css'

export class RAbsolute extends RainbowElement {
    static observedAttributes = this.$registerProps({
        'r-position': [Boolean, String],
    });
}

