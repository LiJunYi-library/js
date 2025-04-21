<template>
  <div class="toast-fetch-demo">
    <div style="display: flex;">
      <button class="tttt" @click="click">click</button>
      <button class="tttt" @click="close">close</button>
      <button class="tttt" @click="send">send</button>

      <button class="tttt" @click="click2">click</button>
      <button class="tttt" @click="close2">close</button>
      <button class="tttt" @click="click3">click3</button>
      <button class="tttt" @click="close3">close</button>
      <r-async-click class="button" :onclick="send" theme="info">
        r-async-click
      </r-async-click>
    </div>


    <div>begin: {{ fff.begin }}</div>
    <div>loading: {{ fff.loading }}</div>
    <div>error: {{ fff.error }}</div>
    <div>data: {{ fff.data }}</div>
    <input type="file" @input="input" />
  </div>
</template>
<script setup lang="jsx">
import { Vfetch } from '@rainbow_ljy/v-hooks'
import { ref, reactive, render, isRef, computed } from 'vue'


class MFetch extends Vfetch {
  config = {
    ...this.config,
    onRequest: (config) => {
      config.toast = { loading: true }
      rainbow.toast.open(config.toast)
    },
    onResponse: (config) => {
      rainbow.toast.close(config.toast)
    },
    onLoading: () => {
      rainbow.toast.show({ text: '正在获取中', ms: 1000 })
    },
    onTimeoutAbort: (error, config, resolve, reject) => {
      rainbow.toast.show({ text: '请求超时', ms: 1000 })
    },
    interceptResponseError: (error, config, resolve, reject) => {
      rainbow.toast.show({ text: error, ms: 1000 })
    },
    interceptResponseSuccess: async (res, data, config) => {
      try {
        if (data instanceof Blob) return data;
        if (data.code !== 200) throw data;
        return data.data;
      } catch (error) {
        rainbow.toast.show({ text: data.message, })
        return Promise.reject(error);
      }

    },
    headers: {
      'content-type': 'application/json'
    },
  }
}

const fff = new MFetch({
  baseUrl: 'http://192.168.192.187:5000',
  url: '/serve/page',
  method: 'post',
  time: 2500,
  // isFormBody: true,
  // baseUrl: 'https://a-zhekou-api-test.manmanbuy.com',
  // url: '/admin/user/profile/export',
  // urlParams: computed(() => ({
  //   ssid: "714ae50a-d498-4637-9ff9-f6f6b8ece4ff",
  //   mmbDevId: "e8d591df67394582a632f206d88af0fd-565",
  //   nickName: "",
  // })),
  // method: 'post',
  // isDownloadFile: true,
  // fileName: 'aaa.xlsx',
  headers: {
    cacle: undefined,
    cookie: 'Hm_lvt_85f48cee3e51cd48eaba80781b243db3=1743392174; HMACCOUNT=F8AA4863CE464DE1; _ga_1Y4573NPRY=GS1.1.1744711446.2.0.1744711446.0.0.0; _ga=GA1.2.116738885.1743392174; Hm_lpvt_85f48cee3e51cd48eaba80781b243db3=1744711447',
    token: '2,eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDUxMzU1NjUsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IjIxMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiLlvKDotKTpkqYiLCJ1c2VySWQiOjIxMSwidXNlcm5hbWUiOiLlvKDotKTpkqYiLCJyb2xlSWRzIjoiNSw2LDEyLDksMiIsInVzZXJUeXBlIjo1fQ.Z3_hWI-fQG0sUAbupAaSRcI2pJowvyySU-sGIvXftEI'
  },
})



const name = ref('name')

const p = { text: 'zzzzzz', loading: true, }


async function send() {
  const data = await fff.nextBeginSend({
    body: ref({ code: 400, time: 3000, }),
  }).catch((error) => {
    console.log('cache---', error);
  })

  console.log('then---', data);
}

async function click(params) {
  const data = await fff.nextBeginSend({
    headers: {
      tttt: '789',
    },
  }).catch((error) => {
    console.log('cache---', error);
  })

  console.log('then---', data);
}

function input(params) {
  console.log(params);

}

function close(params) {
  fff.abort();
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

