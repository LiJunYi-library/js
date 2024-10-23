import { defineComponent } from "vue";

export const RFlexHoc = (optinos = {}) => {
    const config = {
        className: "r-row",
        reverseClassName: "r-row-reverse",
        props: {},
        ...optinos
    }

    return defineComponent({
        props: {
            reverse: Boolean,
            wrap: Boolean,
            justify: { type: String, default: "" },
            align: { type: String, default: "" },
            alignSelf: { type: String, default: "" },
            auto: { type: [String, Boolean], default: "" },
            fill: [Boolean, String],
            gap: { type: [Number, String], default: "" },
            ...config.props,
        },

        setup(props, context) {
            function px(v) {
                v = v + '';
                if (v.includes('px')) return v
                return v + 'px'
            }
            return () => {
                return (
                    <div
                        style={{ 'grid-gap': px(props.gap) }}
                        class={[
                            config.className,
                            props.reverse && config.reverseClassName,
                            props.wrap && "r-flex-wrap",
                            props.justify && `r-flex-justify-${props.justify}`,
                            props.align && `r-flex-align-${props.align}`,
                            props.auto && `r-flex-justify-auto-${props.auto}`,
                            props.alignSelf && `r-flex-align-self-${props.alignSelf}`,
                            props.fill && `r-flex-fill-${props.fill}`,
                        ]}
                    >
                        {context.slots?.default?.()}
                    </div>
                );
            };
        },
    });
}  
