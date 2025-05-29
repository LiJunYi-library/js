import { Vfetch } from '@rainbow_ljy/v-hooks'

export class MFetch extends Vfetch {
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
      // rainbow.toast.show({ text: '正在获取中', ms: 1000 })
    },
    onTimeoutAbort: (error, config, resolve, reject) => {
      rainbow.toast.show({ text: '请求超时', ms: 1000 })
    },
    interceptResponseError: (error, config, resolve, reject) => {
      rainbow.toast.show({ text: error, ms: 1000 })
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
  }
}

export class SpuFetch extends Vfetch {
  config = {
    ...this.config,
    onRequest: (config) => {
      config.toast = { loading: true }
      rainbow.toast.open(config.toast)
    },
    onResponse: (config) => {
      rainbow.toast.close(config.toast)
    },
    onLoading: () => {},
    onTimeoutAbort: (error, config, resolve, reject) => {
      rainbow.toast.show({ text: '请求超时', ms: 1000 })
    },
    interceptRequest(config) {
      console.log(config)
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
  }
}
