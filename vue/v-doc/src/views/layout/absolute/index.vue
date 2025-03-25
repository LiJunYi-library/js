<template>
  <div class="r-absolute-demo">
    <template v-for="(t) in list" :key="t">
      <r-absolute :style="`--r-position:${t};`">{{ t }}</r-absolute>
    </template>
  </div>
  <div class="r-absolute-demo">
    <r-absolute>默认中间</r-absolute>
    <r-absolute useAttrs r-position="right-bottom">right-bottom</r-absolute>

    <r-absolute class="bottom-left">bottom-left</r-absolute>
  </div>
</template>
<script setup>
const list = [
  'center',
  'top-left',
  'top-center',
  'top-right',
  'right-center',
  'right-bottom',
  'bottom-center',
  'bottom-left',
  'left-center',
]
</script>

<style scoped lang="scss">
.r-absolute-demo {
  width: 100%;
  height: 200px;
  position: relative;

  .bottom-left {
    --r-position: bottom-left;
  }
}
</style>
