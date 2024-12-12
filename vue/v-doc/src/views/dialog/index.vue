<template>
  <div style="height: 100vh;background-color: aqua;">

    <!-- <Teleport to="body"> -->
    <r-dialog ref="text">
      <r-visible-animate  class="my-dialog">
        <div style="height: 100px;background: #ff000088;">{{ num }}</div>
        <div style="height: 100px;background: #ff000088;">{{ num }}</div>
      </r-visible-animate>
    </r-dialog>

    <!-- </Teleport> -->

    <!-- <select v-model="num"  @change="change">
      <option value="dog">Dog</option>
      <option value="cat">Cat</option>
      <option value="hamster">Hamster</option>
      <option value="parrot">Parrot</option>
      <option value="spider">Spider</option>
      <option value="goldfish">Goldfish</option>
    </select> -->

    <!-- <r-dialog-content v-model="num" @change="change"></r-dialog-content>
    <div style="height: 200px;background: #ff000088;">{{ num }}</div> -->


    <!-- <RDialog v-model:visible="visible">
      <div style="height: 200px;background: orangered;">123456</div>
    </RDialog> -->

    <div style="display: flex;justify-content: end;margin-top: 300px;">
      <button @click="open">
        open
      </button>

      <button @click="close">
        close
      </button>

    </div>


  </div>
</template>
<script setup>
import { arrayLoopMap } from "@rainbow_ljy/rainbow-js";
// import { RDialog }from '@rainbow_ljy/v-view'
import { useRadio2 } from "@rainbow_ljy/v-hooks";
import { ref, onMounted } from "vue";


const val = ref(5);
const visible = ref(false);
const num = ref(987);

const text = ref("text");

// setTimeout(() => {
//     val.value = 95
// }, 500);

function input(event) {
  console.log("params", event.target.value);
}

function open(params) {
  // console.log(text.value);
  text.value?.open?.()
  visible.value = true
}

function close(params) {
  text.value?.close?.()
}

function add(params) {
  val.value++;
  // text.value.value = val.value
}

function change(event) {
  console.log(event.target.composing)
  console.log(event.currentTarget.value)
}

onMounted(() => {
  //  text.value.value = val.value
});
</script>

<style lang="scss">
.my-dialog {
  background: yellow;
}

.r-dialog-content {
  background: yellow;
}
</style>
