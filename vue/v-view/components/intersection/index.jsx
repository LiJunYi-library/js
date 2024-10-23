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




export const RIntersection = defineComponent({
  props: {
    lazy: Boolean, // 是否懒加载
    recycle: Boolean,// 是否回收
    zoom: Number, // 按比例缩放
    src: String,
    width: [String, Number],
    height: [String, Number],
    position: String,
    fit: { type: String, default: "contain" },
    errorClass: String,
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
    const createClass = (name) => [name, loading.value && name + '-loading', error.value && name + '-error'].filter(Boolean);
    const expose = reactive({ createClass });
    context.expose(expose)
    const CStyle = reactive({ width: undefined, height: undefined });

    const lazy = {
      onInter() {
        if (!isVisible.value) return;
        loadImg();
      },
      onChange: () => lazy.onInter(),
    }

    const recycle = {
      onBeforeInter(visible) {
        if (visible) return;
        if (error.value === true) return;
        let offset = imgHtml?.getBoundingClientRect?.();
        if (!offset) return;
        CStyle.width = offset.width + 'px';
        CStyle.height = offset.height + 'px';
      },
      onChange() {
        CStyle.width = '';
        CStyle.height = '';
        if (!isVisible.value) return;
        loadImg();
      },
    }

    const def = { onInter: loadImg, onChange: loadImg }

    const adapter = (() => {
      if (props.lazy) return lazy;
      if (props.recycle) return recycle;
      return def;
    })()

    function obser() {
      const intersectionObserver = new IntersectionObserver((entries) => {
        adapter?.onBeforeInter?.(entries[0].isIntersecting);
        isVisible.value = entries[0].isIntersecting;
        // console.log('intersectionObserver', isVisible.value);
        adapter?.onInter?.();
      });
      intersectionObserver.observe(html);
    }

    function loadImg() {
      if (!isSrcChange.value) return;
      // console.log('loadImg');
      loading.value = true;
      error.value = false;
      if (imgHtml) {
        imgHtml.style.width = 0;
        imgHtml.style.height = 0;
      }
      src.value = props.src;
    }

    //
    onMounted(obser);




    return () => {
      return (
        <div ref={(el) => (html = el)} style={CStyle} >
          {/* {renderContent()} */}
        </div>
      );
    };
  },
});



