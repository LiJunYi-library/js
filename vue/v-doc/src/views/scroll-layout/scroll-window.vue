<template>
  <div class="scroll-refresh-demo">
    <r-scroll-window>
      <r-scroll-refresh slot="top" :onrefresh="onrefresh"></r-scroll-refresh>
      <r-scroll @scroll="scroll">
        <!-- <r-scroll-refresh :onrefresh="onrefresh"></r-scroll-refresh> -->
        <div>50px</div>
        <div>50px</div>
        <div class="flexed">flexed</div>
        <div>123</div>
        <div>123</div>
        <div class="sticky">
          sticky
          <input class="sticky-input" type="text" />
        </div>
        <div>123</div>
        <div class="absolute">absolute</div>
        <div>123</div>
        <div style="font-size: 80px">{{ text }}</div>
      </r-scroll>
    </r-scroll-window>
  </div>
</template>
<script setup>
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import { setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
const text = arrayLoopMap(300, () => '帅').join('')
async function onrefresh() {
  return setTimeoutPromise(300000)
}
</script>

<style lang="scss">
.scroll-refresh-demo {
  r-scroll-refresh{
    background: chartreuse;
  }
  .flexed {
    position: fixed;
    top: 50px;
    width: 50px;
    background: rgba(255, 0, 0, 0.5);
    height: calc(var(--scrollTopPx) + 50px);
  }
  .sticky {
    position: sticky;
    top: 10px;
    width: 100%;
    background: rgb(255, 90, 0);
    background: rgb(255, 255, 255);
    background: rgb(
      255,
      calc(90 + (min(1, var(--scrollTop) / 200) * 165)),
      calc(0 + (min(1, var(--scrollTop) / 200) * 255))
    );
    height: 50px;
    display: flex;
    justify-content: space-between;
    .sticky-input{
      width: calc(100% - (min(1, var(--scrollTop) / 200) * 105px) - 55px );
    }
  }
  .absolute {
    position: absolute;
    top: 50px;
    right: 50px;
    width: 100px;
    background: rgba(0, 204, 255, 0.5);
    height: calc(var(--scrollTopPx) + 50px);
  }
}
</style>
