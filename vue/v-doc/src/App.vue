<template>
  <router-view />
</template>

<script setup>
</script>

<style lang="scss">
@font-face {
  font-family: 'iconfont';
  /* Project id 4509876 */
  src: url('//at.alicdn.com/t/c/font_4509876_zjfsdtcnmp.woff2?t=1748657848838') format('woff2'),
    url('//at.alicdn.com/t/c/font_4509876_zjfsdtcnmp.woff?t=1748657848838') format('woff'),
    url('//at.alicdn.com/t/c/font_4509876_zjfsdtcnmp.ttf?t=1748657848838') format('truetype');
}

body {
  margin: 0;
  height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}

.page {
  max-height: 100vh;
  overflow: auto;
}
</style>
