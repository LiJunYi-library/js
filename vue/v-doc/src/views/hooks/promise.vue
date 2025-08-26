<template>
  <div class="hooks-promise">
    <div>




      <button @click="nextSend">nextSend</button>
    </div>

  </div>
</template>
<script setup>
import { } from '@rainbow_ljy/rainbow-js'
import { useListPagination } from '@rainbow_ljy/v-hooks'
import { computed, onMounted, customRef, reactive, ref } from 'vue'
import { ElTableColumn, ElButton, ElSelect, ElOption } from 'element-plus'
import { useSpuFetch, } from '@/hooks'
import RPaginationTable from './r-el-pagination-table.vue'

function usePromise(cb) {

  let controller = new AbortController();


  // function ffffff(signal = controller.signal) {
  //   return new Promise((resolve, reject) => {
  //     let onAbort = (event, a, b) => {
  //       signal.removeEventListener('abort', onAbort)
  //     }

  //     signal.addEventListener('abort', onAbort);

  //     if (signal.aborted) return
  //     cb(...args).then((res) => {
  //       if (signal.aborted) return
  //       resolve(res)
  //       signal.removeEventListener('abort', onAbort)
  //     }).catch((err) => {
  //       if (signal.aborted) return
  //       reject(err)
  //       signal.removeEventListener('abort', onAbort)
  //     })
  //   })
  // }

  function nextSend(...args) {
    if (controller) controller.abort();
    controller = new AbortController();

    setTimeout(() => controller.abort(errTimeout), 1000);

    let signal = controller.signal;

    let onAbort = (event, a, b) => {
      console.log(event)
      console.error('Promise is aborted')
      signal.removeEventListener('abort', onAbort)
    }
    signal.addEventListener('abort', onAbort);

    return new Promise((resolve, reject) => {


      if (signal.aborted) return
      cb(...args).then((res) => {
        if (signal.aborted) return
        resolve(res)
        signal.removeEventListener('abort', onAbort)
      }).catch((err) => {
        if (signal.aborted) return
        reject(err)
        signal.removeEventListener('abort', onAbort)
      })
    })

  }


  return { nextSend }
}

const pList = usePromise(async (a) => {
  return new Promise((resolve, reject) => {
    if (a === 5) reject('err')
    setTimeout(() => {
      resolve({ list: [], a })
    }, 3000);
  })
})

let a = 1
async function nextSend(params) {
  a++;
  const res = await pList.nextSend(a)
  console.log('pList.nextSend', res)
}

onMounted(() => {
  // pList.nextSend()
})
</script>

<style lang="scss" scoped>
.hooks-promise {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}
</style>
