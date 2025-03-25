<template>
  <div class="r-absolute-demo">
    <template v-for="(t) in list" :key="t">
          <r-absolute :style="`--r-position:${t};`">{{ t }}</r-absolute>
    </template>

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
  height: 100vh;
  position: relative;
}
</style>
