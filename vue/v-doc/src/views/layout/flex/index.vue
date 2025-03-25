<template>
  <div class="r-absolute-demo">

      <r-flex >
        <r-flex >1111</r-flex>
        <r-flex >2222</r-flex>
        <r-flex >3333</r-flex>
      </r-flex>

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

}
</style>
