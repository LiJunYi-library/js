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
    align: 'right',
    axisLabel: {
      align: 'right',
      rotate: 0,
      color: '#555555',
      showMinLabel: true,
      showMaxLabel: true,
      formatter(value, index) {
        // console.log(value);
        const date = new Date(value * 1);

        //  return  'value'
        // const date = new Date(value);
        // let texts: any = [date.getMonth() + 1, date.getDate()];
        // if (index === 0) {
        //   texts = [''];
        // } else if (index === arrX.length - 1) {
        //   // texts.unshift(date.getFullYear());
        // } else {
        //   // texts = [''];
        // }
        return [date.getMonth() + 1, date.getDate()].join('-');
      },
    },
    splitNumber:6,
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#ddd'],
        type: 'solid',
        opacity: 0.8,
      },
    },
    max() {
      console.log(Math.max(...config.data))
      const date = new Date(Math.max(...config.data));
      return [date.getMonth() + 1, date.getDate()].join('-');
    },
    min() {
      console.log(Math.min(...config.data))
      const date = new Date(Math.min(...config.data));
      return [date.getMonth() + 1, date.getDate()].join('-');
    },
  }
  return config;
};

export default XaxiHoc({
  props: {
    option: { type: Object, default: () => option() },
  },
});
</script>
