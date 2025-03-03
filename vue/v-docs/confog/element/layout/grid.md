<script setup>
  import '@rainbow_ljy/rainbow-element/main.js'
  import grid from './grid.vue'
</script>

# 宫格布局

### webComponent组件 

### css 

| Name        | Description                                    | Default  | 有效值  |
| ---------------- | ------------------------------------------| -------  |-------------  |
| r-columns        | 宫格的列数                                 | 2          |    |
| r-min-auto-width | 子view最小的宽度 非常适合响应式布局          | —          |   |
| r-gap            | 子view之间的间隙宽度                        | 继承        |  |
| r-row-gap        | 子view行之间的距离                          | 继承        |  |
| r-column-gap     | 子view列之间的距离                          | 继承        |  |
| r-grid-wrap      | 子view宽度大于剩余的布局宽度时是否换行        | nowrap     | wrap nowrap|
| r-grid-stretch   | 子view是否填充剩余的宽度                     | nostretch  |  stretch nostretch|

### 子view Attributes
| Name        | Description                              | Type                                                  | Default |
| ----------- | ---------------------------------------- | ----------------------------------------------------- | ------- |
| grid-column | 设置子view占r-columns的倍数               | ^[number]                                             | 1       |

## 基本使用
<<< ./grid.vue

## 展示效果
<ClientOnly>
  <grid></grid>
</ClientOnly>

## 设置最小响应宽度

## 设置换行

## 设置填充剩余宽度 





