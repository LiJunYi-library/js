// vite-plugin-icss.ts
import type { Plugin } from 'vite'
import fs from 'fs'

export  function icssPlugin(): Plugin {
  return {
    name: 'vite-plugin-icss',
    enforce: 'pre',
    async load(id) {
      if (id.endsWith('.icss')) {
        try {
          const code = await fs.promises.readFile(id, 'utf-8')
          let minifiedCss: string = code
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
