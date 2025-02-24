<script lang="jsx">
import { YaxiHoc } from "./index.vue";

const option = () => {
  const config = {
    type: 'value',
    axisTick: {
      show: false,
    },
    boundaryGap: false,
    scale: true,
    axisLine: {
      lineStyle: {
        color: '#dddddd',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#ddd'],
        type: 'solid',
        opacity: 0.8,
      },
    },
    splitNumber: 5,
    minInterval: 20,
    axisLabel: {
      show: true,
      inside: false,
      showMinLabel: false,
      showMaxLabel: true,
      color: '#555',
      formatter(value) {
        let v = Number(value);
        if (typeof v === 'number') return v.toFixed(0);
        return value;
      },
    },
  };
  return config;
};

export default YaxiHoc({
  props: {
    option: { type: Object, default: () => option() },
    interceptOption: {
      type: Function, default: (config, rest) => {
        console.log(config.minInterval);
        console.log(rest);
        let max = Math.max(...config.data);
        let min = Math.min(...config.data);
        let avg = (max - min) / Math.max((config.splitNumber - 2), 1);

        if (avg < config.minInterval) {
          avg = config.minInterval
          config.max = () => max + avg * Math.floor(config.splitNumber / 2);
          config.min = () => Math.max(min - avg * Math.ceil(config.splitNumber / 2), 0);
          config.interval = config.minInterval;
          return
        }

        config.max = () => max + avg;
        config.min = () => Math.max(min - avg, 0);
        config.interval = ((max + avg) - (min - avg)) / config.splitNumber;
      }
    },
  },
});
</script>
