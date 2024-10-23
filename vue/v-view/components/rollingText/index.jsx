import { defineComponent, ref, watch, computed, renderList, reactive, onMounted } from 'vue';
import './index.scss';
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';

export const RRollingTextNum = defineComponent({
  props: {
    ani: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
    turn: { type: Number, default: 1 },
    transition: { type: String, default: '' },
    defAni: { type: Boolean, default: true },
  },
  emits: ['feedbackend', 'feedbackstart', 'animationend'],
  setup(props, ctx) {
    const turns = ref(props.turn);
    const node = ref();
    const num = 10;
    const deg = computed(() => 360 / num);
    const sin = computed(() => Math.sin((Math.PI / 180) * deg.value));
    const translateZ = computed(() => Math.floor((sin.value + 0.94) * node.value?.offsetHeight ?? 1));
    const rotateX = computed(() => -((props.value / num) * 360 + turns.value * 360));
    const style = reactive({ transform: 'rotateX(0deg)' });

    if (props.defAni) {
      setTimeout(() => {
        style.transform = `rotateX(${rotateX.value}deg)`;
      }, 0);
    } else {
      style.transform = `rotateX(${rotateX.value}deg)`;
    }

    function setNode(el) {
      node.value = el;
    }

    watch(
      () => props.ani,
      () => {
        turns.value += props.turn;
        style.transform = `rotateX(${rotateX.value}deg)`;
      },
    );

    return () => {
      return (
        <span class="r-rolling-text-num">
          <span
            class="r-rolling-text-num-con "
            data-turns={turns.value}
            style={[{ transition: props.transition }, style]}
          >
            <span class="measure" ref={setNode}>
              8
            </span>
            {renderList(num, (item, index) => (
              <span
                class={['num', `num${index}`]}
                style={{
                  transform: ` rotateX(${deg.value * index}deg)  translateZ(${translateZ.value
                    }px) `,
                }}
              >
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
    modelValue: { type: Number, default: 0 },
    defAni: { type: Boolean, default: true },
  },
  emits: ['feedbackend', 'feedbackstart', 'animationend'],
  setup(props, ctx) {
    let { defAni } = props;
    const startNum = ref(props.modelValue);
    const targetNum = ref(props.modelValue);
    const startStr = computed(() => String(startNum.value));
    const targetStr = computed(() => String(targetNum.value));
    const turns = ref([]);

    function setTurns(newV, oldV) {
      const mime = newV - oldV;
      const mimeStr = String(Math.abs(mime));
      turns.value = arrayLoopMap(mimeStr.length, index => {
        const size = Number([1, ...arrayLoopMap(index + 1, () => 0)].join(''));
        return Math.floor(mime / size);
      });
    }

    setTurns(props.modelValue, 0);

    watch(
      () => props.modelValue,
      (newV, oldV) => {
        targetNum.value = props.modelValue;
        setTurns(newV, oldV);
      },
    );

    onMounted(() => {
      defAni = true;
    });

    return () => {
      return (
        <span class="r-rolling-text">
          {renderList(targetStr.value.length, (_, index) => {
            const key = targetStr.value.length - index - 1;
            return (
              <RRollingTextNum
                transition={`0.8s`}
                data-key={key}
                ani={Math.random()}
                key={key}
                defAni={defAni}
                turn={turns.value[key]}
                value={Number(targetStr.value[index])}
              />
            );
          })}
        </span>
      );
    };
  },
});
