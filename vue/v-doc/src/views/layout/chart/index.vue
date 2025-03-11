<template>
  <div class="chart-page">
    <div class="chart-card">
      <div class="chart-card-title">价格走势</div>
      <div class="chart-declaration">
        <span class="chart-title">{{ dateRadio.select?.title }} : </span>
        <span class="chart-lowerPrice">￥{{ dateRadio.select?.lowerPrice }}</span>
        <span class="chart-time">{{ [dateRadio.select?.lowerDate && `(${dateRadio.select?.lowerDate})`,
        dateRadio.select?.lowerDate && `常卖价: ${20}`
        ].filter(Boolean).join(',') }} </span>
      </div>
      <RGridListSelect class="date-radio" :list-hook="dateRadio" :columns="dateRadio.list.length"></RGridListSelect>
      <RChartHistory :list="dateRadio.select?.chart ?? []" :options="options" minHeight="300">
        <RChartXaxiHistory property="date" :formatter="({ row }) => formatterXaxiHistory(row)"></RChartXaxiHistory>
        <RChartYaxiHistory property="actualPrice"></RChartYaxiHistory>
        <RChartSerieHistoryLine property="actualPrice"></RChartSerieHistoryLine>
      </RChartHistory>
      <div class="chart-hint">数据由慢慢买整理</div>
    </div>

    <!-- <div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
    </div>

    <div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
    </div> -->
  </div>
</template>
<script setup lang="jsx">
import { RChartHistory, RChartXaxiHistory, RChartYaxiHistory, RChartSerieHistoryLine } from '@rainbow_ljy/v-chart'
import { arrayLoopMap, ListArray } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { RGridListSelect } from '@rainbow_ljy/v-view'
import { ref, render } from 'vue'
import { useFetch } from '@/utils/request'
// import { createDialog } from '@rainbow_ljy/rainbow-element'
import mData from './data.json'

console.log(mData.result.listPrices[60]);

function formatterXaxiHistory(item) {
  const value = item.date;
  if (!value) return ''
  const date = new Date(value * 1);
  return [date.getMonth() + 1, date.getDate()].join('-');
}


const dateRadio = useRadio2({
  value: 0,
  list: mData.result.listLower.map(el => {
    const d = new Date();
    d.setDate(d.getDate() - el.days);
    const chartData = mData.result.listPrices.map(el => ({ ...el, date: new Date(el.date).getTime() }))
    const chart = chartData.filter(val => el.days === 0 ? true : val.date >= d.getTime());
    return { ...el, chart }
  }),
  formatterLabel: (item) => item?.dayText,
  formatterValue: (item) => item?.days,
})

const options = {
  tooltip: {
    formatter: (datas, ticket, callback) => {
      const ele = datas[0] || {}
      const index = ele.dataIndex
      const item = (dateRadio.select?.chart ?? [])[index];
      const date = new Date(item.date);
      date.getMonth() + 1, date.getDate()
      const str = `
        <div class="history-tooltip">
          <div class="history-tooltip-time">
          <span>${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日</span>
          <span>￥${item.actualPrice}</span>
          </div>
          <div class="history-tooltip-discounts">${item.discounts}</div>
        </div>`;
      return str
    }
  }
}
</script>

<style lang="scss">
.chart-page {
  position: fixed;
  left: 0;
  top: 0;
  background: #666672;
  // width: 100vw;
  // height: 100vh;
  // transform: rotate(90deg);
  box-sizing: border-box;
}

.chart-card {
  background: #fff;
  padding: 12px;
  box-sizing: border-box;

  .chart-card-title {
    height: 22px;
    font-weight: 600;
    font-size: 16px;
    color: #19191E;
    line-height: 22px;
    margin-bottom: 8px;
  }

  .chart-declaration {
    height: 30px;
    background: #F7F7F9;
    border-radius: 3px;
    display: flex;
    align-items: center;
    padding: 0 8px;

    .chart-title {
      height: 17px;
      font-weight: 400;
      font-size: 12px;
      color: #666672;
      line-height: 17px;
    }

    .chart-lowerPrice {
      height: 17px;
      font-weight: bold;
      font-size: 15px;
      color: #EE4D2D;
      line-height: 17px;
    }

    .chart-time {
      height: 17px;
      font-weight: 400;
      font-size: 12px;
      color: #9999A5;
      line-height: 17px;
      margin-left: 8px;
    }
  }

  .date-radio {
    display: flex;
    gap: 2px;
    margin: 11px 0;

    .r-grid-item {
      height: 22px;
      font-size: 12px;
      line-height: 17px;
      background: transparent;
      font-weight: 400;
      font-size: 12px;
      color: #666672;
      line-height: 22px;
      padding: 0 8px;
    }

    .r-grid-item-same {
      font-weight: 500;
      color: #EE4D2D;
      background: rgba(254, 32, 64, 0.08);
      border-radius: 3px;
    }
  }

  .history-chart {
    min-height: 300px;
    width: 100%;
  }

  .history-tooltip {
    white-space: unset;
    height: 20px;
    display: inline-block;
  }

  .history-tooltip-time {
    display: flex;
    align-items: center;
  }

  .history-tooltip-discounts {
    display: flex;

  }

  .chart-hint {
    height: 16px;
    font-weight: 400;
    font-size: 11px;
    color: #9999A5;
    line-height: 16px;
  }
}
</style>
