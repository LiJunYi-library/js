import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ msg: 'hello' }),
  template: `<div>{{ msg }}</div>`
})

;(async () => {
  const html = await renderToString(app)
  console.log(html)
})()