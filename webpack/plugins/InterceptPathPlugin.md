<template>
  <div class="about">
    <h1>APPNAME: ~APPNAME~</h1>
    <h1>COMMUNITYNAME: ~COMMUNITYNAME~</h1>
    <h1>FRIEND: ~FRIEND~</h1>
    <h1>This is an about page</h1>
    <h1>慢慢买</h1>
    <h1>慢友设区</h1>
    <h1>慢友设们</h1>

    <img src='../assets/bg.png' />
    <img src="../assets/space-purple.png" alt="">
    <TT></TT>
  </div>
</template>

<script setup lang="jsx">
import TT from './Tm.vue'



</script>
区分环境
import 引入  拦截文件请求 xxx.yy文件指向 xxx.jms.yy

如果同等级目录下有
Tm.vue
Tm.jms.vue
 在jms环境下 将拦截引入 import TT from './Tm.vue' 将指向 import TT from './Tm.jms.vue'

 如果同等级目录下有
 assets/bg.png
assets/bg.jms.png  在jms环境下图片将指向  assets/bg.jms.png

 如果同等级目录下只有
 assets/space-purple.png 无论哪个环境图片将不变
