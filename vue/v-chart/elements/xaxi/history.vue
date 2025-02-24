<script lang="jsx">
import { XaxiHoc } from './index.vue';

const option = () => {
  const config = {
    // type: 'time',
    axisTick: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: '#dddddd',
      },
    },
    align: 'center',
    axisLabel: {
      align: 'right',
      rotate: 0,
      color: '#555555',
      showMinLabel: true,
      showMaxLabel: true,
      formatter(value, index) {
        if (!value) return ''
        const date = new Date(value * 1);
        return [date.getMonth() + 1, date.getDate()].join('-');
      },
    },
    splitNumber: 6,
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#ddd'],
        type: 'solid',
        opacity: 0.8,
      },
    },
    // max() {
    //   const date = new Date(Math.max(...config.data));
    //   return [date.getMonth() + 1, date.getDate()].join('-');
    // },
    // min() {
    //   const date = new Date(Math.min(...config.data));
    //   return [date.getMonth() + 1, date.getDate()].join('-');
    // },
  }
  return config;
};

export default XaxiHoc({
  props: {
    option: { type: Object, default: () => option() },
    interceptOption: {
      type: Function, default: (config, rest) => {
        let max = Math.max(...config.data);
        let min = Math.min(...config.data);
        let avg = (max - min) / Math.max((config.splitNumber - 2), 1);
        config.interval = ((max + avg) - (min - avg)) / config.splitNumber;
      }
    },
  },
});
</script>
