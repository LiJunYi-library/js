<script setup>
  import '@rainbow_ljy/rainbow-element/main.js'
  import MyComponent from './MyComponent.vue'
</script>

# falls布局

webComponent组件

### css

| Name        | Description                              | Default |
| ---------------- | ------------------------------------------| ------- |
| r-columns        | 瀑布流的列数                               | 2    |
| r-min-auto-width | 子view最小的宽度 非常适合响应式布局          | —    |
| r-gap            | 子view之间的间隙宽度                        | 继承      |
| r-row-gap        | 子view行之间的距离                          | 继承    |
| r-column-gap     | 子view列之间的距离                          | 继承       |

## 展示代码
<<< ./MyComponent.vue

## 展示效果
<ClientOnly>
  <MyComponent></MyComponent>
</ClientOnly>





### Attributes

| Name        | Description                              | Type                                                  | Default |
| ----------- | ---------------------------------------- | ----------------------------------------------------- | ------- |
| title       | alert title.                             | ^[string]                                             | —       |
| type        | alert type.                              | ^[enum]`'success' \| 'warning' \| 'info' \| 'error' ` | info    |
| description | descriptive text.                        | ^[string]                                             | —       |
| closable    | whether alert can be dismissed.          | ^[boolean]                                            | true    |
| center      | whether content is placed in the center. | ^[boolean]                                            | false   |
| close-text  | customized close button text.            | ^[string]                                             | —       |
| show-icon   | whether a type icon is displayed.        | ^[boolean]                                            | false   |
| effect      | theme style.                             | ^[enum]`'light' \| 'dark'`                            | light   |

### 方法

| Name        | Description                              | Default |
| ----------- | ---------------------------------------- | ------- |
| gap         | 元素之间的空系                           | —       |
| type        | alert type.                              | info    |
| description | descriptive text.                        | —       |
| closable    | whether alert can be dismissed.          | true    |
| center      | whether content is placed in the center. | false   |
| close-text  | customized close button text.            | —       |
