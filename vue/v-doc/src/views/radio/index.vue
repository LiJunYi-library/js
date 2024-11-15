<template>
    <div class="page">
        <div class="sticky">
            <p> hook 属性 </p>
            <ul style="margin-left: 20px;">
                <li><span>index：</span>{{ radio.index }}</li>
                <li><span>label：</span>{{ radio.label }}</li>
                <li><span>value：</span>{{ radio.value }}</li>
                <li><span>select：</span>{{ radio.select }}</li>
                <li><span>list：</span>{{ radio.list }}</li>
            </ul>
        </div>

        <p> hook 参数 </p>
        <pre>
        <ElTable :data="args">
            <ElTableColumn prop="arg" label="参数名" width="180"></ElTableColumn>
            <ElTableColumn prop="explain" label="说明"></ElTableColumn>
            <ElTableColumn prop="type" label="类型" width="280"></ElTableColumn>
            <ElTableColumn prop="default" :formatter="(item) => item.default === undefined ? 'undefined' : item.default"
                label="默认值" width="180"></ElTableColumn>
            <ElTableColumn width="180">
                <template #default="{ row }">
                    <component v-if="row.com?.name" :is="tems[row.com.name]" v-model="row.com.value"></component>
                </template>
            </ElTableColumn>
        </ElTable>
       </pre>

        <p> hook 方法 </p>

        <ElTable :data="methods">
            <ElTableColumn prop="arg" label="方法名" width="180"></ElTableColumn>
            <ElTableColumn prop="explain" label="说明"></ElTableColumn>
            <ElTableColumn prop="type" label="参数"></ElTableColumn>
            <ElTableColumn width="180">
                <template #default="{ row }">
                    <component v-if="row.com?.name" :is="tems[row.com.name]" v-model="row.com.value"></component>
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
</template>
<script setup>
import { useRadio2, useLocalStorageRef } from '@rainbow_ljy/v-hooks';
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js';
import { ElTable, ElTableColumn, ElInputNumber, ElInput, formatter } from 'element-plus'
import { ref, reactive, shallowRef, computed } from 'vue'
import { useRoute } from "vue-router";
import router from '@/router'
import Gh from './Gh.vue'




const tems = { ElInputNumber, ElInput };

const { query } = useRoute();


const options = reactive({
    index: undefined,// useLocalStorageRef('dfg').value,
    value: undefined,
    label: undefined,
    list: arrayLoopMap(10, (v) => ({ value: `value--${v}`, label: `label--${v}` })),
    cancelSame: false,
    isMultiple: false,
    // indexRef: (i) => useLocalStorageRef('dfg', i),
    ...(JSON.parse(query.options || '{}')),
})

const mComputed = (obj) => computed({
    ...obj,
    set(val) {
        obj.set(val);
        router.replace({ path: '/radio/index', query: { options: JSON.stringify(options) } })
        setTimeout(() => {
            window.location.reload()
        }, 0);

    }
})

const args = ref([
    {
        arg: 'index', explain: '初始化默认的index值', type: 'number', default: options.index,
        com: { name: 'ElInputNumber', value: mComputed({ get: () => options.index, set: (val) => options.index = val }) }
    },
    {
        arg: 'value', explain: '初始化默认的value值', type: 'any', default: options.value,
        com: { name: 'ElInput', value: mComputed({ get: () => options.value, set: (val) => options.value = val }) }
    },
    {
        arg: 'label', explain: '初始化默认的label值', type: 'any', default: options.label,
        com: { name: 'ElInput', value: mComputed({ get: () => options.label, set: (val) => options.label = val }) }
    },
    { arg: 'list', explain: '初始化默认的list值', type: 'any', default: '[]' },
    { arg: 'cancelSame', explain: '再次点击 是否取消相同的', type: 'bool', default: options.cancelSame },
    { arg: 'isMultiple', explain: '是否多选', type: 'bool' },

    { arg: 'validator', explain: 'onSelect 选择时的验证 返回布尔值 true才能继续选择', type: "(item, index)=>bool" },
    { arg: 'formatterValue', explain: 'item formatter的value', type: 'fun' },
    { arg: 'formatterLabel', explain: 'item formatter的label', type: 'fun' },
    { arg: 'formatterDisabled', explain: 'item formatter的Disabled', type: 'fun' },
    { arg: 'listRef', explain: '自定义list的Ref函数 ', type: 'fun' },
    { arg: 'selectRef', explain: '自定义select的Ref函数', type: 'fun' },
    { arg: 'valueRef', explain: '自定义value的Ref函数', type: 'fun' },
    { arg: 'labelRef', explain: '自定义label的Ref函数', type: 'fun' },
    { arg: 'indexRef', explain: '自定义index的Ref函数', type: 'fun' },
    { arg: 'priority', explain: '  ', type: '  valueItem |   indexItem | labelItem' },
])

const radio = useRadio2(options)

const methods = ref([
    { arg: 'updateIndex', explain: '更新', type: 'number', com: { name: 'ElInputNumber', value: computed({ get: () => radio.index, set: (val) => radio.updateIndex(val) }) }, },
    { arg: 'updateLabel', explain: '更新', type: 'any', com: { name: 'ElInput', value: computed({ get: () => radio.label, set: (val) => radio.updateLabel(val) }) }, },
    { arg: 'updateValue', explain: '更新', type: 'any', com: { name: 'ElInput', value: computed({ get: () => radio.value, set: (val) => radio.updateValue(val) }) }, },
    { arg: 'updateSelect', explain: '更新', type: '2个重载  item:T  或  方法(item,index,list)=>T 等同list的find', },
    { arg: 'onSelect', explain: '选择', type: ' (item:T , index:number ) => bool', },
    { arg: 'same', explain: '是否相同', type: ' (item:T ) => bool', },
    { arg: 'reset', explain: '重置' },
    { arg: 'formatterValue', explain: 'for循环时用到的' },
    { arg: 'formatterLabel', explain: 'for循环时用到的' },
    { arg: 'formatterDisabled', explain: 'for循环时用到的' },
    { arg: 'getSelectOfValue', explain: '' },
    { arg: 'getLabelOfValue', explain: '' },
    { arg: 'getIndexOfValue', explain: '' },
    { arg: 'someValue', explain: '' },
])

radio.updateValue('value--3')

radio.updateList(arrayLoopMap(30, (v) => ({ value: `value--${v}`, label: `label--${v}` })))

console.log(radio);

</script>