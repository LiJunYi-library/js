<!-- eslint-disable no-unused-expressions -->
<script lang="jsx">
import {onBeforeUnmount, provide, reactive, renderSlot, inject, defineComponent} from 'vue';
import {merge} from '../index.vue';

const option = () => ({
  type: 'bar',
  barMaxWidth: 30,
});

export const SerieHoc = (options = {}) => {
  const config = {
    props: {},
    ...options,
  };

  return defineComponent({
    inheritAttrs: false,
    props: {
      option: {type: Object, default: (...arg) => option(...arg)},
      property: {type: String, default: ''},
      formatter: Function,
      interceptOption: Function,
      name: String,
      data: [Array, Object],
      ...config.props,
    },
    setup(props, ctx) {
      const SerieContext = reactive({
        data: [],
      });

      const serie = reactive({
        props,
        context: SerieContext,
        attrs: merge(props.option, ctx.attrs),
      });

      provide('SerieContext', SerieContext);

      const ChartContext = inject('ChartContext') || {};

      ChartContext?.series.push(serie);

      onBeforeUnmount(() => {
        ChartContext.series = ChartContext?.series.filter(el => el !== serie);
      });

      return () => {
        return renderSlot(ctx.slots, 'default');
      };
    },
  });
};

export default SerieHoc();
</script>
