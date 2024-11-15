<template>
  <router-view />
</template>

<script setup>
</script>

<style lang="scss">
body {
  margin: 0;
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
