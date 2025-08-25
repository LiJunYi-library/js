import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup(props, context) {
    const div = ref('div')
    console.log(div)

    return () => {
      let vn = <div ref={div}>11111</div>
      console.log('vn', vn)

      return vn
    }
  },
})
