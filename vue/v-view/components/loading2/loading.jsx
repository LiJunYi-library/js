import { defineComponent, renderSlot, onMounted, onBeforeMount } from "vue";
import { useLoading } from "@rainbow_ljy/v-hooks";
import { RILoading } from "../icon";
import { RGlobal } from '../../global'
import "./loading.scss";

const loadingProps = {
    errorText: {
        type: [Number, String],
        default: "出错了",
    },
    errorSrc: {
        type: [Number, String],
        default: RGlobal.loadingProps.errorSrc,
    },
    loadErrorText: {
        type: [Number, String],
        default: "加载出错了 请点击继续",
    },
    beginText: {
        type: [Number, String],
        default: "正在加载中...",
    },
    beginSrc: {
        type: [Number, String],
        default: RGlobal.loadingProps.beginSrc,
    },
    loadingText: {
        type: [Number, String],
        default: "正在加载中",
    },
    finishedText: {
        type: [Number, String],
        default: "没有更多了",
    },
    emptySrc: {
        type: [Number, String],
        default: RGlobal.loadingProps.emptySrc,
    },
    emptyText: {
        type: [Number, String],
        default: "暂无相关数据，试试其他条件吧",
    },
    loadText: {
        type: [Boolean, String, Number],
        default: false,
    },
    skelectonCount: {
        type: Number,
        default: 5,
    },
    listHook: Object,
    promiseHook: [Object, Array],
    loadingHook: [Object, Array],
};

function extendsHoc(params, config = {}) {
    let arg = params;
    if (params instanceof Function) arg = params(config);
    Object.assign(config, arg)
    return config;
}

export function RLoadingHoc(params) {
    const config = extendsHoc(params, {
        props: {},
        emits: [],
        classType: '',
        createClass(name) {
            return [`r-global-${name} r-${name}`, this.classType && `r-${this.classType}-${name}`];
        },
        onErrorClick({ props, context, states }) {
            if (context?.attrs?.onErrorClick) return context.attrs.onErrorClick(states);
            props.promiseHook?.nextBeginSend?.();
        },
        renderError({ props, context, states }) {
            if (!props.errorText && !props.errorSrc) return null
            return renderSlot(context.slots, "error", states, () => [
                <div class={config.createClass('error')} onClick={() => config.onErrorClick({ props, context, states })}>
                    {props.errorSrc && <img class={config.createClass('error-img')} src={props.errorSrc} />}
                    <div class={config.createClass('error-text')} >{props.errorText}</div>
                </div>,
            ]);
        },
        onLoadErrorClick({ props, context, states }) {
            if (context?.attrs?.onLoadErrorClick) return context.attrs.onLoadErrorClick(states);
            props.promiseHook?.awaitConcatSend?.();
        },
        renderLoadError({ props, context, states }) {
            if (!props.loadErrorText) return null
            return renderSlot(context.slots, "load-error", states, () => [
                <div class={config.createClass('load-error')} onClick={() => config.onLoadErrorClick({ props, context, states })}>
                    <div class={config.createClass('load-error-text')} >{props.loadErrorText}</div>
                </div>,
            ]);
        },
        renderBegin({ props, context, states }) {
            if (!props.beginText) return null
            return renderSlot(context.slots, "begin", states, () => [
                <div class={config.createClass('begin')}>
                    <div class={config.createClass('begin-loading')}>
                        <RILoading class={config.createClass('loading-icon')} />
                        <div class={config.createClass('begin-text')} >{props.beginText}</div>
                    </div>
                    {props.beginSrc && <img class={config.createClass('begin-img')} src={props.beginSrc} />}
                    {renderSlot(context.slots, "beginning",)}
                </div>,
            ]);
        },
        onLoadClick({ props, context, states }) {
            if (context?.attrs?.onLoadClick) return context.attrs.onLoadClick(states);
            props.promiseHook?.awaitConcatSend?.();
        },
        renderLoad({ props, context, states }) {
            if (!props.loadText) return null
            return renderSlot(context.slots, "load", states, () => [
                <div class={config.createClass('load')}>
                    <div onClick={() => config.onLoadClick({ props, context, states })} class={config.createClass('load-text')}>
                        {props.loadText}
                    </div>
                </div>,
            ]);
        },
        renderLoading({ props, context, states }) {
            if (!props.loadingText) return null
            return renderSlot(context.slots, "loading", states, () => [
                <div class={config.createClass('loading')} >
                    <RILoading class={config.createClass('loading-icon')} />
                    <div class={config.createClass('loading-text')} >{props.loadingText}</div>
                </div>,
            ]);
        },
        renderfinished({ props, context, states }) {
            if (!props.finishedText) return null
            return renderSlot(context.slots, "finished", states, () => [
                <div class={config.createClass('finished')} >
                    <div class={config.createClass('finished-text')} >{props.finishedText}</div>
                </div>,
            ]);
        },
        renderEmpty({ props, context, states }) {
            if (!props.emptySrc && !props.emptyText) return null;
            return renderSlot(context.slots, "empty", states, () => [
                <div class={config.createClass('empty')} >
                    {renderSlot(context.slots, "emptyImg", states, () => [
                        props.emptySrc && <img class={config.createClass('empty-img')} fit="contain" src={props.emptySrc} />,
                    ])}
                    {props.emptyText && <div class={config.createClass('empty-text')}  >{props.emptyText}</div>}
                </div>,
            ]);
        },
        renderState({ props, context, states }) {
            if (states.error) return this.renderError({ props, context, states });
            if (states.begin) return this.renderBegin({ props, context, states });
            if (states.loading) return this.renderLoading({ props, context, states });
            if (states.empty) return this.renderEmpty({ props, context, states });
            return renderSlot(context.slots, "default")
        },
        render({ props, context, states }) {
            return this.renderState({ props, context, states })
        },
    });


    return defineComponent({
        props: {
            ...loadingProps,
            ...config.props,
        },
        emits: ["intersectBottom", "intersectionBottom", "firstIntersectionBottom", ...config.emits],
        setup(props, context) {
            let isobserver = false;
            let intersectionHtml;
            const observe = new IntersectionObserver(([entries]) => {
                if (!entries.isIntersecting) return;
                context.emit("intersectBottom");
                if (!isobserver) context.emit("firstIntersectionBottom");
                if (isobserver) context.emit("intersectionBottom");
                isobserver = true;
            });
            function setIntersectionHtml(el) {
                intersectionHtml = el;
            }
            onMounted(() => {
                if (intersectionHtml) observe.observe(intersectionHtml);
            });
            onBeforeMount(() => {
                observe.disconnect();
            });
            const ctx = { setIntersectionHtml };
            const states = useLoading(props);
            const args = { props, context, states, ctx };
            return () => config.render(args);
        },
    });
}

export const RLoading = RLoadingHoc((mSuper) => ({ classType: 'default' }));

export const RLoadingMask = RLoadingHoc((mSuper) => ({
    classType: 'mask',
    // renderError(props, context, states) {
    //     return (<div class="r-c-error r-error" onClick={() => context.emit("errorClick")}>
    //         {renderSlot(context.slots, "error", states, () => [<div class="r-c-error-text r-error-text">{props.errorText}</div>])}
    //     </div>);
    // },
    // renderBegin(props, context, states) {
    //     return (<div class="r-c-begin r-begin">
    //         {renderSlot(context.slots, "begin", states, () => [
    //             <RILoading class="r-c-loading-icon r-loading-icon" />,
    //             <div class={["r-c-begin-text r-begin-text"]}>{props.beginText}</div>
    //         ])}
    //     </div>);
    // },
    // renderLoading(props, context, states) {
    //     return (<div class={["r-c-loading r-loading"]}>
    //         {renderSlot(context.slots, "loading", states, () => [
    //             <RILoading class="r-c-loading-icon r-loading-icon" />,
    //             <div class={["r-c-loading-text r-loading-text"]}>{props.loadingText}</div>
    //         ])}
    //     </div>);
    // },
    // renderEmpty(props, context, states) {
    //     if (!props.emptySrc && !props.emptyText) return null;
    //     return <div class="r-c-empty r-empty">
    //         {renderSlot(context.slots, "empty", states, () => [
    //             renderSlot(context.slots, "emptyImg", states, () => [
    //                 props.emptySrc && (
    //                     <img class={"r-c-empty-img r-empty-img"} fit="contain" src={props.emptySrc} />
    //                 ),
    //             ]),
    //             props.emptyText && <div class={"r-c-empty-text r-empty-text"}>{props.emptyText}</div>
    //         ])}
    //     </div>
    // },
    renderState({ props, context, states }) {
        if (states.error) return mSuper.renderError({ props, context, states });
        if (states.begin) return mSuper.renderBegin({ props, context, states });
        if (states.loading) return mSuper.renderLoading({ props, context, states });
        if (states.empty) return mSuper.renderEmpty({ props, context, states });
    },
    render({ props, context, states }) {
        return <div class='r-loading-mask'>
            {renderSlot(context.slots, "default")}
            <div class='r-loading-mask-states'>
                {this.renderState({ props, context, states })}
            </div>
        </div>
    },
}));

export const RLoadingLoad = RLoadingHoc((mSuper) => ({
    classType: 'list-load',
    renderState({ props, context, states }) {
        if (states.begin && states.error) return mSuper.renderError({ props, context, states });
        if (!states.begin && states.error) return mSuper.renderLoadError({ props, context, states });
        if (states.begin) return mSuper.renderBegin({ props, context, states });
        if (states.finished && states.empty) return mSuper.renderEmpty({ props, context, states });
        if (states.finished) return mSuper.renderfinished({ props, context, states });
        if (states.finished === false && !props.loadText) return mSuper.renderLoading({ props, context, states });
        if (states.finished === false && props.loadText && states.loading) return mSuper.renderLoading({ props, context, states });
        if (states.finished === false && props.loadText) return mSuper.renderLoad({ props, context, states });
        return null;
    },
    render({ props, context, states, ctx }) {
        return [
            !states.begin && renderSlot(context.slots, "default"),
            <div class={["r-loading-load", props.className]} >
                <div ref={ctx.setIntersectionHtml} class="intersection"></div>
                {this.renderState({ props, context, states })}
            </div>,
        ]
    },
}));


