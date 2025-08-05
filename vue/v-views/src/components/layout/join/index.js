import { defineComponent, cloneVNode, Comment } from 'vue'

export const Join = defineComponent({
  props: {},
  setup(props, context) {
    return () => {
      const filterUnCommentNode = (el) => el.type !== Comment
      const defVnode = (context.slots?.default?.() || []).filter(filterUnCommentNode)
      const sVnode = (index) => (context.slots?.symbol?.(index) || []).filter(filterUnCommentNode)
      return defVnode
        .map((node, index) =>
          index === 0 ? node : [sVnode(index).map((n) => cloneVNode(n)), node],
        )
        .flat(Infinity)
    }
  },
})
