import { useFetchHOC } from '@rainbow_ljy/v-hooks'

type REST = {
  code: Number,
  message: String,
  data: any
}



export const useSpuFetch = useFetchHOC<REST>({
  onRequest: (config) => {
    config.toast = { loading: true }
    rainbow?.toast?.open(config.toast)
  },
  onResponse: (config) => {
    rainbow.toast.close(config.toast)
  },
  onLoading: () => { },
  onTimeoutAbort: (error, config, resolve, reject) => {
    rainbow.toast.show({ text: '请求超时', ms: 1000 })
  },
  interceptRequest(config) {
    // console.log(config)
  },
  interceptResponseError: (error, config, resolve, reject) => {
    rainbow.toast.show({ text: error, ms: 1000 })
  },
  interceptResponseSuccess: async (res, data, config) => {
    try {
      if (data instanceof Blob) return data
      if (data.code !== 2000) throw data
      return data.data
    } catch (error) {
      rainbow.toast.show({ text: data.message })
      return Promise.reject(error)
    }
  },
  headers: {
    'content-type': 'application/json',
  },
  time: 30000,
  baseUrl: 'https://spu-test.manmanbuy.com',
  toast: undefined,
})

// const asyncHook = useSpuFetch<{ list: [] }>({
//   url: '/spu/list',
//   method: 'post',
// })
// asyncHook.data?.list
// asyncHook.data.list
// asyncHook.send({
//   formatterData(data, rest, res, config) {
//     data.list=[{}]
//   },
// })

// const asyncHook2 = useSpuFetch<{ total: number }>({
//   url: '/spu/list',
//   method: 'post',
// })
// asyncHook2.data.total

export const useMFetch = useFetchHOC<REST>({
  onRequest: (config) => {
    config.toast = { loading: true }
    rainbow?.toast?.open(config.toast)
  },
  onResponse: (config) => {
    rainbow.toast?.close?.(config.toast)
  },
  interceptRequest: (config) => {
    console.log('interceptRequest',config)
  },
  onLoading: () => {
    // rainbow.toast.show({ text: '正在获取中', ms: 1000 })
  },
  onTimeoutAbort: (error, config, resolve, reject) => {
    rainbow.toast.show({ text: '请求超时', ms: 1000 })
  },
  interceptResponseError: (error, config, resolve, reject) => {
    rainbow.toast?.show?.({ text: error, ms: 1000 })
  },
  interceptResponseSuccess: async (res, data, config) => {
    try {
      if (data instanceof Blob) return data
      if (data.code !== 200) throw data
      return data.data
    } catch (error) {
      rainbow.toast.show({ text: data.message })
      return Promise.reject(error)
    }
  },
  headers: {
    'content-type': 'application/json',
  },
  time: 30000,
  baseUrl: 'http://192.168.192.202:5000',
})
