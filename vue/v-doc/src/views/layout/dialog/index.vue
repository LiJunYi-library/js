<template>
  <div class="VirtualFallsList-page" :class="name">
    <div>
      <button @click="dialog.show('aa')">show</button>
      <button @click="dialog2.show('bb')">show</button>
      <button @click="dialog3.show('ccc')">show</button>
    </div>
    <div>
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
    </div>
    <button @click="dialog.show('haha')">show</button>
    <button @click="dialog.close()">close</button>
    <button @click="bool = !bool">bool</button>
    <!-- <Teleport to="body"> -->
      <r-dialog v-model="bool" class="my-dialog" @input="input">
        <div>
          <div>属性</div>
          <div>属性</div>
          <button @click="dialog.show('2222')">show</button>
          <button @click="bool = !bool">bool</button>
        </div>
      </r-dialog>
    <!-- </Teleport> -->
  </div>
</template>
<script setup lang="jsx">
import { arrayLoopMap, ListArray } from '@rainbow_ljy/rainbow-js'
import { useRadio2 } from '@rainbow_ljy/v-hooks'
import { ref, render } from 'vue'
import { useFetch } from '@/utils/request'
// import { createDialog } from '@rainbow_ljy/rainbow-element'

const { createDialog } = rainbow

const name = ref('bottom-center')
const bool = ref(false)
const arrays = new ListArray()
const List = ref([])
const gap = ref(10)
const columns = ref(4)

const dialog = createDialog()
dialog.show = (sss) => {
  return dialog(
    <div>
      <div>属性</div>
      <div>{sss}</div>
      <div>属性</div>
      <div>属性</div>
      <button onclick={() => dialog.show('11111')}>show</button>
      <button onclick={dialog.close}>close</button>
      <button onclick={() => setBool(true)}>bool true</button>
      <button onclick={() => setBool(false)}>bool false</button>
    </div>,
    {
      top: 50,
    },
  )
}

const dialog2 = createDialog()
dialog2.show = (sss) => {
  return dialog2(
    <div>
      <div>dialog2</div>
      <div>{sss}</div>
      <div>dialog2</div>
      <div>dialog2</div>
      <div>dialog2</div>
      <div>dialog2</div>
      <div>dialog2</div>
    </div>,
    {
      top: 50,
    },
  )
}

const dialog3 = createDialog()
dialog3.show = (sss) => {
  return dialog3(
    <div>
      <div>dialog3</div>
      <div>{sss}</div>
      <div>dialog3</div>
      <div>dialog3</div>
      <div>dialog3</div>
      <div>dialog3</div>
      <div>dialog3</div>
    </div>,
    {
      top: 50,
    },
  )
}

function setBool(params) {
  bool.value = params
}

function input(event) {
  console.log(event)
  console.log(bool)
}

// arrays.push(
//   ...arrayLoopMap(10, (value) => ({
//     value,
//     id: Math.random(),
//     title: arrayLoopMap(Math.floor(Math.random() * 100), (i) => '我').join(''),
//   })),
// )
</script>

<style>
.my-dialog {
  --r-orientation: bottom;
}
</style>
