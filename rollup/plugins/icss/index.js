import { readFile } from "fs";
import { promisify } from "util";
import * as csso from "csso";

const readFileAsync = promisify(readFile);

export default function icssPlugin(options = {}) {
  const { minify = true, include = ["**/*.icss"], exclude } = options;

  return {
    name: "rollup-plugin-icss",
    async load(id) {
      const matched = Array.isArray(include)
        ? include.some((pattern) => id.endsWith(pattern))
        : id.endsWith(include);

      if (!matched) return null;

      if (
        exclude &&
        (Array.isArray(exclude) ? exclude.some((p) => id.includes(p)) : id.includes(exclude))
      )
        return null;

      try {
        const code = await readFileAsync(id, "utf-8");

        // 是否压缩
        let css = code;
        if (minify) {
          try {
            css = csso.minify(code).css;
          } catch (e) {
            this.warn(`csso minify error in ${id}: ${e.message}`);
          }
        }

        // 返回 JS 模块：导出 CSS 字符串
        return `
          const css = ${JSON.stringify(css)};
          export default css;
        `;
      } catch (e) {
        this.error(`rollup-plugin-icss: Failed to read ${id} - ${e.message}`);
      }
    },
  };
}
