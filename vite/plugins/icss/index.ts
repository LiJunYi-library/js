// vite-plugin-icss.ts
import type { Plugin } from 'vite'
import fs from 'fs'
import { extname } from 'path'
import * as csso from 'csso' // 导入 csso

export  function icssPlugin(): Plugin {
  return {
    name: 'vite-plugin-icss',
    enforce: 'pre',

    async load(id) {
      if (id.endsWith('.icss')) {
        try {
          // 1. 读取文件内容
          const code = await fs.promises.readFile(id, 'utf-8')

          // 2. 使用 csso 压缩 CSS
          let minifiedCss: string
          try {
            minifiedCss = csso.minify(code).css
          } catch (e) {
            this.error(`CSS 压缩失败 in ${id}: ${e}`)
            minifiedCss = code // 失败时回退到原始内容
          }

          // 3. 返回 JS 模块：导出压缩后的 CSS 字符串
          return `
            const css = ${JSON.stringify(minifiedCss)};
            export default css;
          `
        } catch (e) {
          this.error(`Failed to read .icss file: ${id}`)
        }
      }

      return null
    }
  }
}
