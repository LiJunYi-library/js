<template>
  <div class="pulldown-demo">
    <div>
      <div>默认</div>
      <div>--r-placement: bottom;</div>
      <div>--r-orientation: top;</div>
    </div>
    <r-grid style="--r-columns: 3">
      <r-pulldown class="select-pulldown" v-model="bool">
        <div slot="label">{{ category || '类目' }}
          <span>bool: {{ bool }}</span>
        </div>
        <div>
          <div v-if="visible">visible</div>
          <button @click="visible = !visible">visible</button>
          <div>类目内容</div>
          <div>使用bool值控制弹窗 打开 关闭</div>
          <div>bool: {{ bool }}</div>
          <div>
            <button @click="category = '牛奶牛奶牛奶牛奶牛奶牛奶牛奶牛奶牛奶'">修改label内容</button>
            <button @click="category = ''">清除label内容</button>
            <button @click="confirm">确定</button>
            <button @click="clear">清除</button>
          </div>
        </div>
      </r-pulldown>

      <r-pulldown>
        <div slot="label">{{ select.val || 'label' }}</div>
        <div>使用 r-dialog-close 组件 关闭弹窗</div>
        <div>使用 r-dialog-close 组件 关闭弹窗</div>
        <div>使用 r-dialog-close 组件 关闭弹窗</div>
        <r-grid style="--r-columns: 4">
          <r-dialog-close :onclick="select.confirm">确定</r-dialog-close>
          <r-dialog-close :onclick="select.clear">清除</r-dialog-close>
          <r-dialog-close>关闭</r-dialog-close>
        </r-grid>
      </r-pulldown>

      <r-pulldown v-model="radio.boolean">
        <div slot="label">{{ radio.val || 'label' }} <span>bool: {{ radio.boolean }}</span></div>
        <div>使用 r-dialog-close 组件 关闭弹窗</div>
        <div>使用 v-model 获取弹窗 打开 关闭</div>
        <r-grid style="--r-columns: 2">
          <r-dialog-close :onclick="radio.confirm">确定</r-dialog-close>
          <r-dialog-close :onclick="radio.clear">清除</r-dialog-close>
        </r-grid>
      </r-pulldown>
    </r-grid>

    <div style="height: 200px;"></div>

    <div style="text-align: center;"> --r-placement </div>
    <div style="display: flex;justify-content: center;">
      <r-grid style="--r-columns: 3">
        <template v-for="(item) in placements" :key="item">
          <r-pulldown :class="`my-pulldown my-pulldown-${item}`">
            <div slot="label">{{ item }}</div>
            <div> 1 </div>
            <div> 2 </div>
            <div> 3 </div>
            <div> 4 </div>
            <div> 5 </div>
            <div> 6 </div>
            <r-dialog-close>关闭</r-dialog-close>
          </r-pulldown>
        </template>
      </r-grid>
    </div>

    <div style="text-align: center;"> 修改弹窗的 --r-orientation 使用 dialogClass 设置弹窗的类名 </div>
    <div style="display: flex;justify-content: center;">
      <r-grid style="--r-columns: 3">
        <template v-for="(item) in placements" :key="item">
          <r-pulldown :class="`my-pulldown my-pulldown-${item}`" :dialogClass="`my-pulldown-dialog-${item}`">
            <div slot="label">{{ item }}</div>
            <div> 1 </div>
            <div> 2 </div>
            <div> 3 </div>
            <div> 4 </div>
            <div> 5 </div>
            <div> 6 </div>
            <r-dialog-close>关闭</r-dialog-close>
          </r-pulldown>
        </template>
      </r-grid>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref, reactive } from 'vue'
const visible = ref(false);
const category = ref('');
const bool = ref(false);
function confirm() {
  category.value = '哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇'
  bool.value = false;
}
function clear() {
  category.value = ''
  bool.value = false;
}

const select = (() => {
  const val = ref('');
  function confirm() {
    val.value = '确认'
  }
  function clear() {
    val.value = ''
  }
  return reactive({ val, confirm, clear })
})()


const radio = (() => {
  const val = ref('');
  const boolean = ref(false);
  function confirm() {
    val.value = '确认'
  }
  function clear() {
    val.value = ''
  }
  return reactive({ val, boolean, confirm, clear })
})()


const placements = [
  'left',
  'top',
  'right',
  'bottom',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
]

</script>

<style lang="scss">
.pulldown-demo {
  r-pulldown.select-pulldown {
    .r-pulldown-default-icon::after {
      content: '\e745';
    }
  }

  .my-pulldown {
    background: cyan;
  }

  .my-pulldown-top {
    --r-placement: top;
  }

  .my-pulldown-bottom {
    --r-placement: bottom;
  }

  .my-pulldown-left {
    --r-placement: left;
  }

  .my-pulldown-right {
    --r-placement: right;
  }

  .my-pulldown-top-left {
    --r-placement: top|left;
  }

  .my-pulldown-top-right {
    --r-placement: right|top;
  }

  .my-pulldown-bottom-left {
    --r-placement: bottom|left;
  }

  .my-pulldown-bottom-right {
    --r-placement: bottom|right;
  }
}


r-dialog.my-pulldown-dialog-top {
  --r-orientation: bottom;
}

r-dialog.my-pulldown-dialog-bottom {
  --r-orientation: top;
}

r-dialog.my-pulldown-dialog-left {
  --r-orientation: right;
}

r-dialog.my-pulldown-dialog-right {
  --r-orientation: left;
}
</style>
