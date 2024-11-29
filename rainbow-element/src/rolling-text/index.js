import "./index.css";
import { RainbowElement, renderChildren } from "../base/index.js";
import { arrayLoop, arrayLoopMap } from "@rainbow_ljy/rainbow-js";

export class RRollingTextNum extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-font": { type: String, default: "20px" }, // px
    "r-initial-animation": String, // true false
    "r-transition": String,
  });

  $$container = document.createElement("span");
  $$measure = document.createElement("span");
  $$rotes = arrayLoopMap(10, () => document.createElement("span"));
  $$num = 10;
  $$value = 0;

  get value() {
    return this.$$value;
  }

  set value(v) {
    this.$$value = v;
    this.$$rotateX(true);
  }

  setValue(v, ani = true) {
    this.$$value = v;
    this.$$rotateX(ani);
  }

  constructor(...arg) {
    super(...arg);
    this.attachShadow({ mode: "open" });
    this.$$container.className = "r-rolling-num-container r-rolling-num-container-ani";
    this.$$container.setAttribute("part", "r-rolling-num-container r-rolling-num-container-ani ");
    this.$$measure.className = "r-rolling-num-measure";
    this.$$measure.setAttribute("part", "r-rolling-num-measure");
    this.$$measure.innerText = "9";
    this.$$container.appendChild(this.$$measure);
    this.shadowRoot.appendChild(this.$$container);
  }

  $$renderNums() {
    const num = this.$$num;
    const deg = 360 / num;
    const sin = Math.sin((Math.PI / 180) * deg);
    const translateZ = (sin + 0.9) * (this.$$measure.offsetHeight || 1);

    this.$$rotes.forEach((div, index) => {
      div.style.transform = `rotateX(${deg * index}deg)  translateZ(${translateZ}px)`;
      div.setAttribute("part", "r-rolling-num-rotate");
      div.className = "r-rolling-num-rotate";
      div.innerText = index;
      this.$$container.appendChild(div);
    });
  }

  $$rotateX(isTransition) {
    const { rTransition } = this.$.DATA;
    const rotateX = -((this.$$value / this.$$num) * 360);

    this.$$container.style.transition = "";
    this.$$container.style.transform = "";
    this.$$container.style.transition = rTransition;
    this.$$container.style.transform = `rotateX(${rotateX}deg)`;
  }

  $render() {
    const { rInitialAnimation } = this.$.DATA;
    this.$$rotateX(rInitialAnimation === "true");
  }

  connectedCallback(...arg) {
    super.connectedCallback(...arg);
    this.$$renderNums();
  }

  disconnectedCallback(...arg) {
    super.connectedCallback(...arg);
  }
}

customElements.define("r-rolling-text-num", RRollingTextNum);

export class RRollingText extends RainbowElement {
  static observedAttributes = this.$registerProps({
    "r-font": { type: String, default: "20px" },
    "r-value": String,
    "r-math-type": String, // 'floor' , 'none'
  });

  $$renderNumNodes = renderChildren({
    parentNode: this,
  });

  //   cacheMap = new Map();
  //   pointer = undefined;

  $render() {
    let { rValue, rMathType } = this.$.DATA;

    let rValueStr = String(rValue);
    let values = (() => {
      return arrayLoopMap(rValueStr.length, (index) => {
        const size = Number([1, ...arrayLoopMap(index, () => 0)].join(""));
        if (rMathType === "floor") return Math.floor(rValue / size);
        return rValue / size;
      });
    })();

    this.$$renderNumNodes.renderList(values, {
      keyExtractor: (item, index) => index,
      onCreateNode: (item, index, key) => {
        let node = document.createElement("r-rolling-text-num");
        node.setAttribute("key", key);
        node.value = item;
        return node;
      },
      onCacheNode: (node, item, index, key) => {
        node.value = item;
        node.setAttribute("key", key);
        return node;
      },
    });
  }
}

customElements.define("r-rolling-text", RRollingText);

// export const RRollingText = defineComponent({
//     props: {
//       isFloor: { type: Boolean, default: true },
//       modelValue: { type: Number, default: 0 },
//       transition: { type: String, default: '0.8s' },
//       initialAnimation: { type: Boolean, default: true },
//       initAnimation: { type: Boolean, default: false },
//     },
//     emits: [],
//     setup(props, ctx) {
//       let initialAnimation = props.initialAnimation;

//       const valueStr = computed(() => String(props.modelValue));

//   const values = computed(() => {
//     return arrayLoopMap(valueStr.value.length, index => {
//       const size = Number([1, ...arrayLoopMap(index, () => 0)].join(''));
//       if (props.isFloor) return Math.floor(props.modelValue / size);
//       return props.modelValue / size
//     });
//   });

//       onMounted(() => initialAnimation = props.initAnimation)

//       return () => {
//         return (
//           <span class="r-rolling-text">
//             {renderList(valueStr.value.length, (_, index) => {
//               const lastIndex = valueStr.value.length - index - 1;
//               return (
//                 <RRollingTextNum
//                   initialAnimation={initialAnimation}
//                   transition={props.transition}
//                   data-key={lastIndex}
//                   key={lastIndex}
//                   data-value={values.value[lastIndex]}
//                   value={values.value[lastIndex]}
//                 />
//               );
//             })}
//           </span>
//         );
//       };
//     },
//   });

// export const RRollingTextNum = defineComponent({
//     props: {
//       turn: { type: Number, default: 0 },
//       value: { type: Number, default: 0 },
//       transition: { type: String, default: '' },
//       initialAnimation: { type: Boolean, default: false },
//     },
//     emits: [],
//     setup(props, ctx) {
//       const node = ref();
//       const num = 10;
//       const deg = computed(() => 360 / num);
//       const sin = computed(() => Math.sin((Math.PI / 180) * deg.value));
//       const translateZ = computed(() => (sin.value + 0.9) * node.value?.offsetHeight ?? 1);
//       const style = reactive({ transform: 'rotateX(0deg)' });
//       const rotateX = computed(() => -((props.value / num) * 360));
//       watch(() => props.value, setTransform);

//       function setTransform() {
//         style.transform = `rotateX(${rotateX.value}deg)`;
//       }

//       function setNode(el) {
//         node.value = el;
//       }

//       if (props.initialAnimation) {
//         onMounted(setTransform)
//       } else {
//         setTransform()
//       }

//       return () => {
//         return (
//           <span class="r-rolling-text-num" data-value={props.value}>
//             <span
//               class="r-rolling-text-num-con"
//               style={[{ transition: props.transition }, style]}
//             >
//               <span class="measure" ref={setNode}>
//                 9
//               </span>
//               {renderList(num, (item, index) => (
//                 <span
//                   class={['num', `num${index}`]}
//                   style={{ transform: ` rotateX(${deg.value * index}deg)  translateZ(${translateZ.value}px) ` }}>
//                   {index}
//                 </span>
//               ))}
//             </span>
//           </span>
//         );
//       };
//     },
//   });
