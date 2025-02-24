<script lang="jsx">
import { Hoc } from './index.vue';

const option = () => {
  const config = ({
    tooltip: {
      extraCssText: 'max-width: 100%; word-break: break-all;white-space:pre-wrap',
      trigger: 'axis',
      transitionDuration: 0,
      confine: true,
      backgroundColor: '#ec652e',
      borderWidth: 0,
      borderColor: '#ec652e',
      padding: [4, 10],
      textStyle: {
        color: '#ffffff',
        fontSize: 11,
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#ec652e',
          type: 'solid',
        },
      },
      position(point, params, dom) {
        const width = dom.clientWidth;
        return [point[0] - width / 2, 0];
      },
      formatter: (data) => {
        // console.log('formatter',data);
        // console.log(config.data);
        const item = data[0] || {};
        console.log('formatter',item.dataIndex);
      },
    },
    grid: {
      top: '10',
      left: '1',
      right: '1',
      bottom: '10',
      containLabel: true,
    },
    xAxis: [],
    yAxis: [],
    series: [],
  })
  return config
};

export default Hoc({
  props: {
    option: { type: Object, default: () => option() },
  },
});
</script>
