<script setup>
  import '@rainbow_ljy/rainbow-element/main.js'
  import MyComponent from './MyComponent.vue'
  import  ResizeFalls from './ResizeFalls.vue'
</script>

# 瀑布流布局

### webComponent组件  
不支持回收想要有回收效果请使用r-scroll-virtual-falls-list  
基于ResizeObserver兼容性要求较高

## css

| Name        | Description                              | Default |
| ---------------- | ------------------------------------------| ------- |
| r-columns        | 瀑布流的列数                               | 2    |
| r-min-auto-width | 子view最小的宽度 非常适合响应式布局          | —    |
| r-gap            | 子view之间的间隙宽度                        | 继承      |
| r-row-gap        | 子view行之间的距离                          | 继承    |
| r-column-gap     | 子view列之间的距离                          | 继承       |

## 基本使用
<<< ./MyComponent.vue

## 展示效果
<ClientOnly>
  <MyComponent></MyComponent>
</ClientOnly>


## 监听子view的高度
<<< ./ResizeFalls.vue

## 展示效果
<ClientOnly>
  <ResizeFalls></ResizeFalls>
</ClientOnly>




### 方法

| Name        | Description                              | Default |
| ----------- | ---------------------------------------- | ------- |
| gap         | 元素之间的空系                           | —       |
| type        | alert type.                              | info    |
| description | descriptive text.                        | —       |
| closable    | whether alert can be dismissed.          | true    |
| center      | whether content is placed in the center. | false   |
| close-text  | customized close button text.            | —       |
