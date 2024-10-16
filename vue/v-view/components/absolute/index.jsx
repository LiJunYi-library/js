import { defineComponent, computed } from "vue";
import './index.scss';


export const RAbsolute = defineComponent({
  props: {
    center: [Boolean, String],
    position: [Boolean, String],
    left: [Number, String],
    right: [Number, String],
    bottom: [Number, String],
    top: [Number, String],
  },
  setup(props, context) {

    function px(num) {
      if (num === undefined) return '';
      if (typeof num === 'number') return num + 'px';
      return num;
    }

    const className = computed(() => {
      if (!props.center) return ''
      if (props.center === true) return 'r-absolute-center';
      return 'r-absolute-' + props.center;
    })

    const positionClass = computed(() => {
      if (!props.position) return ''
      return 'r-absolute-' + props.position;
    })

    return (vm) => {
      return <div class={['r-absolute', className.value, positionClass.value]} style={{
        left: px(props.left),
        right: px(props.right),
        top: px(props.top),
        bottom: px(props.bottom),
      }}>{context.slots?.default?.()}</div>;
    };
  },
});
