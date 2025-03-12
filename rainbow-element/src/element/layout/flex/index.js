import { RainbowElement } from '../../base/index.js'
import './index.css'

export class RFlex extends RainbowElement {
    static observedAttributes = this.$initProps({
        direction: { type: String, default: "row" },
        inline: Boolean,
        reverse: Boolean,
        wrap: Boolean,
        justify: { type: String, default: "" },
        align: { type: String, default: "" },
        'align-self': { type: String, default: "" },
        auto: { type: [String, Boolean], default: "" },
        fill: { type: [String, Boolean], default: "" },
        gap: { type: [Number, String], default: "" },
        'row-gap': [Number, String],
        'column-gap': [Number, String],
    });

    $renderEvents = ['$onConnected', '$onAttrsChange']

    $onRender() {
        this.$setClass((props) => [
            "r-flex",
            props.inline && "r-inline-flex",
            props.direction && `r-flex-direction-${props.direction}`,
            props.reverse && `r-flex-direction-${props.direction}-reverse`,
            props.wrap && "r-flex-wrap",
            props.justify && `r-flex-justify-${props.justify}`,
            props.auto && `r-flex-justify-auto-${props.auto}`,
            props.align && `r-flex-align-${props.align}`,
            props['align-self'] && `r-flex-align-self-${props['align-self']}`,
            props.fill && `r-flex-fill-${props.fill}`,
        ])
        this.$setStyle((props) => ({
            "grid-gap": props.gap + "px",
            "row-gap": (props['row-gap'] || props.gap) + "px",
            "column-gap": (props['column-gap'] || props.gap) + "px",
        }))
    }




}


