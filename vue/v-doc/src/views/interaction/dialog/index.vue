<template>
  <div class="r-dialog-demo" :class="classname">
    <div>
      <!-- <button @click="dialog.show('aa')">show</button>
      <button @click="dialog2.show('bb')">show</button>
      <button @click="dialog3.show('ccc')">show</button> -->
    </div>

    <r-grid>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
    </r-grid>

    <div>
      <div class="an">属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
      <div>属性</div>
    </div>

    <div disabled="true">
      <button @click="visible = true">default center</button>
      <button @click="topVisible = true">top</button>
      <button @click="bottomVisible = true">bottom</button>
      <button @click="leftVisible = true">left</button>
      <button @click="rightVisible = true">right</button>
      <button @click="customVisible = true">自定义</button>
      <button @click="customAnimationVisible = true">自定义 Animation</button>
      <button @click="dialog1.value = true">visibleFun</button>
      <button @click="commconDialog()">通用弹窗封装</button>
      <div style="display: inline-block" class="loading-icon"></div>
    </div>

    <!-- <Teleport to="body"> -->
    <r-dialog v-model="visible" @input="input">
      <div class="my-dialog-content">
        <div>default center</div>
        <div>
          <r-dialog-close :onclick="asyncClose">
            <div slot="prve"   class="loading-icon"></div>
            <button>使用 dialog-close 组件关闭 弹窗</button>
            <div  class="loading-icon"></div>
          </r-dialog-close>
        </div>
        <button @click="visible = false">关闭</button>
        <div>嵌套弹窗</div>
        <div>
          <button @click="customVisible = true">自定义</button>
        </div>
      </div>
    </r-dialog>
    <!-- </Teleport> -->

    <r-dialog v-model="topVisible" class="my-top-dialog" r-overlay="false" closeOnPopstate>
      <div class="my-dialog-content">
        <div>top</div>
        <button @click="bottomVisible = true">bottom</button>
        <button @click="topVisible = false">关闭</button>
      </div>
    </r-dialog>

    <r-dialog v-model="bottomVisible" class="my-bottom-dialog" closeOnPopstate>
      <div class="my-dialog-content">
        <div>bottom</div>
        <div @click="classname = 'dddddddd'">bottom</div>
        <button @click="bottomVisible = false">关闭</button>
      </div>
    </r-dialog>

    <r-dialog v-model="leftVisible" class="my-left-dialog" closeOnPopstate>
      <div class="my-dialog-content">
        <div>left</div>
        <button @click="leftVisible = false">关闭</button>
      </div>
    </r-dialog>

    <r-dialog v-model="rightVisible" class="my-right-dialog">
      <div class="my-dialog-content">
        <div>right</div>
        <button @click="rightVisible = false">关闭</button>
      </div>
    </r-dialog>

    <r-dialog v-model="customVisible" class="my-custom-dialog">
      <div class="my-dialog-content">
        <div>custom</div>
        <button @click="customVisible = false">关闭</button>
        <div>嵌套弹窗</div>
        <div>
          <button @click="visible = true">default center</button>
          <button @click="customAnimationVisible = true">自定义 Animation</button>
        </div>
      </div>
    </r-dialog>

    <r-dialog
      v-model="customAnimationVisible"
      class="my-custom-animation-dialog"
      styleElement="r-dialog-demo-style"
    >
      <div class="my-dialog-content">
        <div>animation</div>
        <button @click="customAnimationVisible = false">关闭</button>
      </div>
    </r-dialog>
  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap, setTimeoutPromise } from '@rainbow_ljy/rainbow-js'
import { ref, render } from 'vue'
import { Dialog } from 'vant'
const visible = ref(false)
const topVisible = ref(false)
const bottomVisible = ref(false)
const leftVisible = ref(false)
const rightVisible = ref(false)
const customVisible = ref(false)
const customAnimationVisible = ref(false)
const classname = ref('my-dialog-bottom')

function create(vNode) {
  document.body._vnode = undefined
  render(vNode, document.body)
  return vNode.el
}

function commconDialog() {
  const dia = (
    <r-dialog destroy key={Math.random()}>
      <div>
        <div>commconDialog</div>
        <r-dialog-close>使用 dialog-close 组件关闭 弹窗</r-dialog-close>
      </div>
    </r-dialog>
  )
  const div = document.createElement('div')
  document.body._vnode = undefined
  render(dia, document.body)
  console.log([document.body])

  // document.body.append(dia.el)
  dia.el.value = true
}

const dialog1 = create(
  <r-dialog key="dialog1">
    <div>使用方法创建弹窗</div>
    <r-dialog-close>使用 dialog-close 组件关闭 弹窗</r-dialog-close>
  </r-dialog>,
)

async function asyncClose() {
  await setTimeoutPromise(30000)
}

function input(event) {
  console.log('input  input input event')
}
</script>

<style lang="scss" id="r-dialog-demo-style">
.r-dialog-demo {
  padding: 0 20px;
  r-grid {
    --r-gap: 0px;
    --r-columns: 3;
    // border:  0.5px solid #0c0c0c;
    border-collapse: collapse;
    .r-grid-item {
      border: 0.5px solid #0c0c0c;
      border-left: none;
      border-top: none;
    }
  }
}

.my-dialog-content {
  background: cyan;
  min-width: 250px;
  min-height: 250px;
  width: 100%;
  height: 100%;
}

.my-top-dialog {
  --r-orientation: top;
}

.my-bottom-dialog {
  --r-orientation: bottom;
  --r-blank-bottom: 100px;
}

.dddddddd .my-bottom-dialog {
  --r-blank-bottom: 10px;
}

.my-left-dialog {
  --r-orientation: left;
  --r-blank-top: 100px;
}

.my-right-dialog {
  --r-orientation: right;
}

/* 自定义弹窗css 过度动画*/
.my-custom-dialog {
  --r-orientation: custom;
  --r-blank-top: 50px;
  --r-overlay-class: custom-overlay;
  // --r-overlay-visibility: hidden;

  &[css-name~='r-dialog-custom'] {
    left: 50%;
    top: 50%;
    transform-origin: 50% 50%;
    transform: translate(-50%, -50%);
    overflow: visible;
  }

  &[css-name~='r-dialog-custom-enter-from']::part(r-dialog-content) {
    transform: rotate(0deg) scale(0);
  }

  &[css-name~='r-dialog-custom-enter-active']::part(r-dialog-content) {
    transition: 0.25s;
  }

  &[css-name~='r-dialog-custom-enter-to']::part(r-dialog-content) {
    transform: rotate(720deg) scale(1);
  }

  &[css-name~='r-dialog-custom-leave-from']::part(r-dialog-content) {
    transform: rotate(720deg) scale(1);
  }

  &[css-name~='r-dialog-custom-leave-active']::part(r-dialog-content) {
    transition: 0.25s;
  }

  &[css-name~='r-dialog-custom-leave-to']::part(r-dialog-content) {
    transform: rotate(0deg) scale(0);
  }
}

/* 自定义弹窗css */
.my-custom-animation-dialog {
  --r-orientation: springing;

  &[css-name~='r-dialog-springing'] {
    left: 0;
    top: 0;
    width: 100vw;
    overflow: visible;
    --r-blank-top: 100px;
  }

  &[css-name~='r-dialog-springing-enter-from']::part(r-dialog-content) {
    transform: translateY(-100%);
  }

  &[css-name~='r-dialog-springing-enter-active']::part(r-dialog-content) {
    animation: springing 1s 1;
  }

  &[css-name~='r-dialog-springing-enter-to']::part(r-dialog-content) {
    transform: translateY(-0%);
  }

  &[css-name~='r-dialog-springing-leave-from']::part(r-dialog-content) {
    transform: translateY(-0%);
  }

  &[css-name~='r-dialog-springing-leave-active']::part(r-dialog-content) {
    transition: 0.25s;
  }

  &[css-name~='r-dialog-springing-leave-to']::part(r-dialog-content) {
    transform: translateY(-100%);
  }
}

@keyframes springing {
  0% {
    transform: translateY(-100%);
  }

  10% {
    transform: translateY(0%);
  }

  20% {
    transform: translateY(-80%);
  }

  30% {
    transform: translateY(0%);
  }

  40% {
    transform: translateY(-50%);
  }

  100% {
    transform: translateY(0%);
  }
}
</style>
