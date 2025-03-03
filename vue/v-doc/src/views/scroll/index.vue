<template>
  <div class="page" :class="name">
    <!-- <r-circle v-model="add">
      <div>123</div>
    </r-circle> -->
    <!--<div @click="look" id="clippedElement" style="width: 200px; height: 200px; background-color: #6495ED;"></div> -->
    <!-- <div class="circle-clip"></div>
    <div class="circle-clip2"></div> -->

    <!-- <r-input v-model="name" :contenteditable="true" type="text" style="height: 50px;width: 100%;display: block;" />
    <input type="text" style="height: 50px;width: 100%;display: block;" />
    <input is="r-input" type="text" style="height: 50px;width: 100%;display: block;" /> -->
    <!-- <div style="height: 200px;background: greenyellow;width: 50px;"></div> -->

    <!--<div style="max-height: 100vh;overflow: auto;">
      <div style="height: 200px;background: yellow;width: 50px;"></div>sticky
      <div style="height: 50px;width: 100%; background: red;position: fixed;top: 10px;"></div>
      <div style="height: 1200px;background: cyan;width: 50px;"></div>
    </div> -->


    <r-scroll-view class="my-scroll" ref="ele" @scrollrefresh="refresh">
      <!-- <div slot="bottom">liu六liu六liu六liu六liu六liu六liu六liu六liu六</div>
      <r-scroll-sticky>
        <div style="height: 50px;background: cyan;"></div>
      </r-scroll-sticky>  v-if="bool"-->
      <div>{{ text }}</div>
      <!-- <div solt="top">
        <r-scroll-refresh  solt="top"></r-scroll-refresh>
      </div> -->

      <r-scroll-refresh solt="top" @refresh="refresh"></r-scroll-refresh>

      <!-- <div> 1****{{ name }} </div>
        <div> {{ name }} </div>
        <div> 3****{{ name }} </div> -->
      <!-- <div solt="top" >
        <div> 122****{{ name }} </div>
        <div v-if="bool" > {{ name }} </div>
        <div> 322****{{ name }} </div>
        <r-scroll-refresh></r-scroll-refresh>
      </div> -->

      <div style="height: 50px;width: 100%; background: red;position: sticky;top: 0px;"></div>
      <div style="font-size: 50px;">{{ text }}</div>
      <div style="height: 50px;width: 50px; background: yellowgreen;position: fixed;top: 10px;"></div>
      <div style="height: 50px;width: 50px; background: pink;position: absolute;top: 100px;right: 0;"></div>
      <!-- <r-scroll-memory-bable>
        <div style="width: 50px;height: 50px;background: cyan;"></div>
      </r-scroll-memory-bable> -->


    </r-scroll-view>



  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';
import { useRadio2 } from '@rainbow_ljy/v-hooks';
import { ref, onMounted } from 'vue'
import { setTimeoutPromise } from "@rainbow_ljy/rainbow-js";

const text = arrayLoopMap(300, () => '帅').join('');

const ele = ref('ele');

const name = ref('bottom-center');
const bool = ref(true);
const add = ref(0);
const List = ref(arrayLoopMap(100, (value) => ({ value })))
const gap = ref(10);
const columns = ref(4);

function look(params) {
  console.log(name.value)
}

const styles = ref([]);

styles.value[0] = { left: '20px' }

styles.value[0] = { left: '40' }
async function refresh(event) {
  console.log(event);
  await setTimeoutPromise(5000)
  event.resolve(true)
  console.log('refresh')

}

const radio = useRadio2({ list: arrayLoopMap(100, (value) => ({ value: 'v' + value, label: value + '*' })) })

// const div = document.createElement('div')
// document.body.append(div)
// div.style.width= 'calc(100vh - 20px)';
// const style = window.getComputedStyle(div);
// console.log(style.getPropertyValue('width'));


function scroll(params) {
  // console.log('refresh', params);
}

// console.log(radio);

function arcToClipPathRing(x, y, outerRadius, innerRadius, startAngleDeg, endAngleDeg, anticlockwise = false) {
  // 将度数转换为弧度
  const toRadians = angle => (angle * Math.PI / 180);
  if ((endAngleDeg - startAngleDeg + 360) % 360 === 0) endAngleDeg = endAngleDeg - 0.001;
  // 将起始和结束角度转换为弧度
  const startAngleRad = toRadians(startAngleDeg);
  const endAngleRad = toRadians(endAngleDeg);
  // 计算外圆的起始点和结束点的坐标
  const outerStartX = x + outerRadius * Math.cos(startAngleRad);
  const outerStartY = y + outerRadius * Math.sin(startAngleRad);
  const outerEndX = x + outerRadius * Math.cos(endAngleRad);
  const outerEndY = y + outerRadius * Math.sin(endAngleRad);
  // 计算内圆的起始点和结束点的坐标
  const innerStartX = x + innerRadius * Math.cos(startAngleRad);
  const innerStartY = y + innerRadius * Math.sin(startAngleRad);
  const innerEndX = x + innerRadius * Math.cos(endAngleRad);
  const innerEndY = y + innerRadius * Math.sin(endAngleRad);

  const angleDiff = (() => {
    if (endAngleDeg === startAngleDeg) return 0;
    let age = (endAngleDeg - startAngleDeg + 360) % 360;
    if (age === 0) return 360;
    return age;
  })();  // 确保角度差为正值
  const largeArcFlagOuter = angleDiff > 180 ? 1 : 0;
  const sweepFlagOuter = anticlockwise ? 0 : 1;

  const largeArcFlagInner = angleDiff <= 180 ? 0 : 1;
  const sweepFlagInner = anticlockwise ? 1 : 0; // 内圆的方向与外圆相反

  // 构建路径字符串
  const pathData = [
    `M ${outerStartX} ${outerStartY}`, // 移动画笔到外圆的起始点
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlagOuter} ${sweepFlagOuter} ${outerEndX} ${outerEndY}`, // 绘制外圆弧
    `L ${innerEndX} ${innerEndY}`, // 画一条直线到内圆的结束点
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlagInner} ${sweepFlagInner} ${innerStartX} ${innerStartY}`, // 绘制内圆弧
    `L ${outerStartX} ${outerStartY}`,
    'Z' // 关闭路径
  ].join(' ');

  return `path('${pathData}')`;
}

function arcToClipPathPolygon(x, y, radius, startAng, endAng, anticlockwise = false) {
  // 将度数转换为弧度
  const toRadians = angle => (angle * Math.PI / 180);

  // 确保角度在0到360度之间
  let startAngleDeg = ((startAng % 360) + 360) % 360;
  let endAngleDeg = ((endAng % 360) + 360) % 360;

  // 特殊处理360度的情况
  if (Math.abs(startAngleDeg - endAngleDeg) < 1e-6 && !anticlockwise) {
    // 生成一个完整的圆形路径
    return `path('M ${x - radius} ${y} a ${radius} ${radius} 0 1,0 ${2 * radius} 0 a ${radius} ${radius} 0 1,0 -${2 * radius} 0 Z')`;
  }

  // 如果anticlockwise为true，则交换起始和结束角度
  if (anticlockwise && startAngleDeg < endAngleDeg) {
    [startAngleDeg, endAngleDeg] = [endAngleDeg, startAngleDeg];
  } else if (!anticlockwise && startAngleDeg > endAngleDeg) {
    [startAngleDeg, endAngleDeg] = [endAngleDeg, startAngleDeg];
  }

  // 将起始和结束角度转换为弧度
  const startAngleRad = toRadians(startAngleDeg);
  const endAngleRad = toRadians(endAngleDeg);

  // 计算起始点和结束点的坐标
  const startX = x + radius * Math.cos(startAngleRad);
  const startY = y + radius * Math.sin(startAngleRad);
  const endX = x + radius * Math.cos(endAngleRad);
  const endY = y + radius * Math.sin(endAngleRad);

  // 确定大弧标志（large-arc-flag）和方向标志（sweep-flag）
  const largeArcFlag = (endAngleDeg - startAngleDeg) % 360 >= 180 ? 1 : 0;
  const sweepFlag = anticlockwise ? 0 : 1;

  // 构建路径字符串
  const pathData = [
    `M ${startX} ${startY}`, // 移动画笔到起始点
    `A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`, // 绘制圆弧
    'L', `${x} ${y}`, // 画一条直线回到圆心
    'Z' // 关闭路径
  ].join(' ');

  return `path('${pathData}')`;
}
onMounted(() => {
  const element = document.getElementById('clippedElement');
  // element.style.clipPath = arcToClipPathPolygon(100, 100, 100, 0, 250, false); // 从0度到270度顺时针绘制
  // element.style.clipPath = arcToClipPathRing(100, 100, 60, 50, 270, 631, false);
})


setTimeout(() => {

  bool.value = false
  name.value = 'right-bottom'
  gap.value = false
  columns.value = 5

  // console.log(ele.value);


  // ele.value.scrollTop = 500
}, 4000);

setInterval(() => {
  bool.value = !bool.value;
  add.value += 2;
  // const element = document.getElementById('clippedElement');
  // element.style.clipPath = arcToClipPathPolygon(100, 100, 100, 0,  add.value, false);
  // element.style.clipPath = arcToClipPathRing(100, 100, 55, 50, 180, 180 + add.value, false);
}, 50);

</script>

<style>
.ring-progress {
  position: relative;
  width: 150px;
  height: 150px;
}

.ring,
.progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #e0e0e0;
  /* 背景颜色 */
}

.circle-clip {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 200px;
  background-color: #4caf4fa3;
  /* 背景颜色 */
  clip-path: path('M 100 100 a 50,50 1,1,1 10,10 l 25,-50 Z');
}

.circle-clip2 {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 200px;
  background-color: #fd01018f;
  /* 背景颜色 */
  clip-path: path('M 100 100 a 50,50 1,1,1 30,30 l 25,-50 Z');
}

.progress {
  clip-path: circle(50% at 50% 50%);
  /* 初始状态下显示整个圆 */
  background: red;
  transform: rotate(-90deg);
  /* 旋转以从顶部开始 */
  transition: clip-path 0.3s ease-out;
  /* clip-path: padding-box circle(50px); */
  /* 添加过渡效果 */
}

/* 使用CSS变量来存储百分比 */
:root {
  --percentage: 75;
  /* 默认进度 */
}


.long {
  width: 30px;
  font-size: 100px;
  background: linear-gradient(45deg, red, blue);
  text-wrap: wrap;
  word-wrap: break-word;
}

.r-grid-item {
  background: gold;
}

.r-scroll-fixed {
  height: 50px;
  background: cyan;
}

.r-scroll-fixed-fixed {
  /* background: rgb(0, 85, 255); */
}

.my-falls {
  --r-columns: 3;
  /* --r-min-auto-width: 100px; */
  --r-gap: 10px;
  --r-row-gap: 25px;
  --r-column-gap: 15px;
}

.r-falls-item {
  background: yellow;
}

.bottom-center .my-grid {
  /* --r-columns: 9; */
}

.right-bottom .my-grid {
  /* --r-columns: 6; */
}

/* .dsk {
    width: calc(100vw - 50px);
}

.page .dsk {
    --r-absolute: top;
    flex-wrap: wrap;
    column-width: 30px;

} */
</style>
