<template>
  <div class="about">
    <h1>APPNAME: ~APPNAME~</h1>
    <h1>COMMUNITYNAME: ~COMMUNITYNAME~</h1>
    <h1>FRIEND: ~FRIEND~</h1>
    <h1>This is an about page</h1>
    <h1>慢慢买</h1>
    <h1>慢友设区</h1>
    <h1>慢友设们</h1>

    <#mmb>
    <div>mmb环境下有的代码 {{ mmbCode }}</div>
    </#mmb>

    <#jms>
    <div>jms环境下有的代码 {{ jmsCode }}</div>
    </#jms>
    <div>-------</div>

    <div>{{ envCode }}</div>
    <!-- <Sdf></Sdf> -->
    <div>-------</div>
    <img src='../assets/bg.png' />
    <img src="../assets/space-purple.png" alt="">
    <TT></TT>
  </div>
</template>

<script setup lang="jsx">
import TT from './Tm.vue'

const mmbCode = '变量  mmb环境下有的代码';
const jmsCode = '变量  jms环境下有的代码';






<#mmb>
const envCode = 'mmb环境'
</#mmb>

<#jms>
const envCode = 'jms环境'
</#jms>






</script>



~APPNAME~ 变量 自动编译
慢慢买 自动替换

如果环境是jms 移除 <#mmb>.*?</#mmb>  只存 const envCode = 'jms环境'
<#mmb>
const envCode = 'mmb环境'
</#mmb>

<#jms>
const envCode = 'jms环境'
</#jms>

如果环境是jms 移除 <#mmb>.*?</#mmb>  只存  <div>jms环境下有的代码 {{ jmsCode }}</div>
    <#mmb>
    <div>mmb环境下有的代码 {{ mmbCode }}</div>
    </#mmb>

    <#jms>
    <div>jms环境下有的代码 {{ jmsCode }}</div>
    </#jms>