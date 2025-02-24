<!-- eslint-disable no-useless-concat -->
<!-- eslint-disable no-undef -->
<script lang="jsx">
import { SerieHoc } from './index.vue';



const option = () => ({
  name: '价格',
  type: 'line',
  symbol: 'circle',
  symbolSize: [2, 2],
  showSymbol: false,
  itemStyle: {
    color: '#ff6729',
  },
  lineStyle: {
    width: 2,
    shadowColor: '#dddddd',
    shadowBlur: 0,
    shadowOffsetY: 0.3,
    shadowOffsetX: 0,
    z: 22,
  },
  areaStyle: {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: '#ff6729' + '80',
      },
      {
        offset: 0.2,
        color: '#ff6729' + '20',
      },
      {
        offset: 1,
        color: '#ff6729' + '00',
      },
    ]),
  },
});

export default SerieHoc({
  props: {
    property: { type: String, default: 'saleCount' },
    option: { type: Object, default: () => option() },
  },
});
</script>
