<template>
  <div class="pulldown-demo">
    <button class="tttt" @click="click">click</button>
    <button class="tttt" @click="close">close</button>
    <button class="tttt" @click="click2">click2</button>
    <button class="tttt" @click="close2">close</button>
    <button class="tttt" @click="click3">click3</button>
    <button class="tttt" @click="close3">close</button>
  </div>
</template>
<script setup lang="jsx">
import { ref, reactive, render } from 'vue'

const name = ref('name')

const p = { text: 'zzzzzz', loading: true, }

function click(params) {
  rainbow.toast.show(p)
}

function close(params) {
  rainbow.toast.close(p)
}

const p2 = {
  text: <div >
    <div >
      {name.value}
    </div>
    <div >
      {name.value}
    </div>
  </div>
}

function click2(params) {
  rainbow.toast.open(p2)
}

function close2(params) {
  rainbow.toast.close(p2)
}

const p3 = { loading: true, }

function click3(params) {
  rainbow.toast.open(p3)
}

function close3(params) {
  rainbow.toast.close(p3)
}




</script>

<style lang="scss">
.pulldown-demo {
  r-pulldown.select-pulldown {
    .r-pulldown-default-icon::after {
      content: '\e745';
    }
  }

  .my-pulldown {
    background: cyan;
  }

  .my-pulldown-top {
    --r-placement: top;
  }

  .my-pulldown-bottom {
    --r-placement: bottom;
  }

  .my-pulldown-left {
    --r-placement: left;
  }

  .my-pulldown-right {
    --r-placement: right;
  }

  .my-pulldown-top-left {
    --r-placement: top|left;
  }

  .my-pulldown-top-right {
    --r-placement: right|top;
  }

  .my-pulldown-bottom-left {
    --r-placement: bottom|left;
  }

  .my-pulldown-bottom-right {
    --r-placement: bottom|right;
  }
}


r-dialog.my-pulldown-dialog-top {
  --r-orientation: bottom;
}

r-dialog.my-pulldown-dialog-bottom {
  --r-orientation: top;
}

r-dialog.my-pulldown-dialog-left {
  --r-orientation: right;
}

r-dialog.my-pulldown-dialog-right {
  --r-orientation: left;
}
</style>
