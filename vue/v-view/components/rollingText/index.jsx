import { defineComponent, ref, watch, computed, renderList, reactive, onMounted } from 'vue';
import './index.scss';
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';


export const RRollingTextNum = defineComponent({
  props: {
    turn: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    transition: { type: String, default: '' },
    initialAnimation: { type: Boolean, default: false },
  },
  emits: [],
  setup(props, ctx) {
    const node = ref();
    const num = 10;
    const deg = computed(() => 360 / num);
    const sin = computed(() => Math.sin((Math.PI / 180) * deg.value));
    const translateZ = computed(() => (sin.value + 0.9) * node.value?.offsetHeight ?? 1);
    const style = reactive({ transform: 'rotateX(0deg)' });
    const rotateX = computed(() => -((props.value / num) * 360));
    watch(() => props.value, setTransform);

    function setTransform() {
      style.transform = `rotateX(${rotateX.value}deg)`;
    }

    function setNode(el) {
      node.value = el;
    }

    if (props.initialAnimation) {
      onMounted(setTransform)
    } else {
      setTransform()
    }

    return () => {
      return (
        <span class="r-rolling-text-num" data-value={props.value}>
          <span
            class="r-rolling-text-num-con"
            style={[{ transition: props.transition }, style]}
          >
            <span class="measure" ref={setNode}>
              9
            </span>
            {renderList(num, (item, index) => (
              <span
                class={['num', `num${index}`]}
                style={{ transform: ` rotateX(${deg.value * index}deg)  translateZ(${translateZ.value}px) ` }}>
                {index}
              </span>
            ))}
          </span>
        </span>
      );
    };
  },
});

export const RRollingText = defineComponent({
  props: {
    isFloor: { type: Boolean, default: true },
    modelValue: { type: Number, default: 0 },
    transition: { type: String, default: '0.8s' },
    initialAnimation: { type: Boolean, default: true },
    initAnimation: { type: Boolean, default: false },
  },
  emits: [],
  setup(props, ctx) {
    let initialAnimation = props.initialAnimation;

    const valueStr = computed(() => String(props.modelValue));

    const values = computed(() => {
      return arrayLoopMap(valueStr.value.length, index => {
        const size = Number([1, ...arrayLoopMap(index, () => 0)].join(''));
        if (props.isFloor) return Math.floor(props.modelValue / size);
        return props.modelValue / size
      });
    });

    onMounted(() => initialAnimation = props.initAnimation)

    return () => {
      return (
        <span class="r-rolling-text">
          {renderList(valueStr.value.length, (_, index) => {
            const lastIndex = valueStr.value.length - index - 1;
            return (
              <RRollingTextNum
                initialAnimation={initialAnimation}
                transition={props.transition}
                data-key={lastIndex}
                key={lastIndex}
                data-value={values.value[lastIndex]}
                value={values.value[lastIndex]}
              />
            );
          })}
        </span>
      );
    };
  },
});
