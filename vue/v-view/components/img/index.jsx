import {
  defineComponent,
  renderList,
  renderSlot,
  computed,
  reactive,
  onMounted,
  provide,
  inject,
  render,
  watch,
  onBeforeUnmount,
  ref,
} from "vue";
import "./index.scss";
import { useIntersectionObserver } from "@rainbow_ljy/v-hooks";


export const RImageHoc = (options = {}) => {
  const config = {
    props: {},
    renderError: (props, context, expose) => (
      <img class={expose.createClass('r-picture-error')} src={props.errorSrc}></img>
    ),
    renderLoading: (props, context, expose) => (
      <img class={expose.createClass('r-picture-loading')} src={props.loadingSrc}></img>
    ),

    ...options,
  };

  return defineComponent({
    props: {
      lazy: Boolean, // 是否懒加载
      recycle: Boolean,// 是否回收
      zoom: Number, // 按比例缩放
      src: String,
      width: [String, Number],
      height: [String, Number],
      position: String,
      fit: { type: String, default: "contain" },
      errorSrc: { type: String, default: require("./error.png") },
      errorClass: String,
      loadingSrc: { type: String, default: require("./loading.png") },
      loadingClass: String,
      ...config.props,
    },
    setup(props, context) {
      let html, imgHtml;
      const isVisible = ref(false);
      const error = ref(false);
      const loading = ref(false);
      const cache = reactive({ width: undefined, height: undefined });
      const src = ref();
      const isSrcChange = ref(true);
      watch(() => props.src, onChange);
      watch(isVisible, onRecycle, { flush: 'post' });
      const expose = reactive({ createClass });
      context.expose(expose)
      const CStyle = reactive({ width: undefined, height: undefined });



      function obser() {
        const intersectionObserver = new IntersectionObserver((entries) => {
          isVisible.value = entries[0].isIntersecting;
          console.log('intersectionObserver', isVisible.value);
          if( props.lazy && !props.recycle) loadImg();
        });
        intersectionObserver.observe(html);
      }

      function createClass(name) {
        return [name, loading.value && name + '-loading', error.value && name + '-error'].filter(Boolean)
      }

      console.log(context.attrs);


      function loadImg() {
        if (!isSrcChange.value) return;
        if ((props.lazy || props.recycle) && !isVisible.value) return;
        console.log('loadImg');
        loading.value = true;
        error.value = false;
        src.value = props.src;
        if (!imgHtml) return
        imgHtml.style.width = 0;
        imgHtml.style.height = 0;
      }

      //
      onMounted(obser);

      function onload(event) {
        imgHtml.style.width = '';
        imgHtml.style.height = '';
        const el = event.target;
        if (props.zoom) {
          imgHtml.style.width = el.naturalWidth * props.zoom + 'px';
          imgHtml.style.height = el.naturalHeight * props.zoom + 'px';
        }
        cache.width = el.width;
        cache.height = el.height;
        cache.naturalWidth = el.naturalWidth;
        cache.naturalHeight = el.naturalHeight;
        console.log('onload', cache);
        error.value = false;
        loading.value = false;
        isSrcChange.value = false;

        CStyle.width = '';
        CStyle.height = '';
      }

      function onerror() {
        cache.width = 0;
        cache.height = 0;
        cache.naturalWidth = 0;
        cache.naturalHeight = 0;
        imgHtml.style.width = 0;
        imgHtml.style.height = 0;

        error.value = true;
        loading.value = false;
        isSrcChange.value = false;

        CStyle.width = '';
        CStyle.height = '';
      }

      function onChange() {
        isSrcChange.value = true;
        if (props.recycle) {
          CStyle.width = '';
          CStyle.height = '';
        }
        loadImg();
      }

      function onRecycle() {
        if (!props.recycle) return
        if (isVisible.value) {
          loadImg()
        }
        if (!isVisible.value && error.value === false) {
          CStyle.width = cache.width + 'px';
          CStyle.height = cache.height + 'px';
        }

      }

      //
      function renderContent() {
        const nodes = [<img
          class={createClass("r-picture")}
          ref={(el) => (imgHtml = el)}
          onerror={onerror}
          onload={onload}
          src={src.value}
          style={{ "object-fit": props.fit, "object-position": props.position }}
        />,
        loading.value && renderSlot(context.slots, 'loading', expose, () => [config.renderLoading(props, context, expose)]),
        error.value && renderSlot(context.slots, 'error', expose, () => [config.renderError(props, context, expose)])]
        if (!props.recycle) return nodes
        if (isVisible.value) return nodes
        return null
      }

      return () => {
        return (
          <div ref={(el) => (html = el)} class={createClass("r-image")} style={CStyle} >
            {renderContent()}
          </div>
        );
      };
    },
  });
};

export const RImage = RImageHoc();
