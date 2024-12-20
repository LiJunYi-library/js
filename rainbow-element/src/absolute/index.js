import { RainbowElement } from '../base/index.js'
import './index.css'

export class RAbsolute extends RainbowElement {
    static observedAttributes = this.$registerProps({
        'r-position': [Boolean, String],
        // left: [Number, String],
        // right: [Number, String],
        // bottom: [Number, String],
        // top: [Number, String],
    });




    // $renderEvents = ['$onConnected', '$onAttrsChange']

    // $onRender() {
    //     this.$setClass((props)=>[
    //         "r-absolute",
    //         props.position && 'r-absolute-' + props.position,
    //     ])
    // }

}

customElements.define("r-absolute", RAbsolute);