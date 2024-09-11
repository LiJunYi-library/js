
function fmt(item) {
  if (!item) return null
  if (!item.children) return null
  return item.children
}

/**
 * 树形结构 递归 循环
 * @params fun  每次循环的方法 item ，index ，list递归时的数组，parent 父node，roote 根node
 * @params keys 需要遍历的属性名
 * @params list 需要遍历 树
 * @params recursive 递归时的方法 list，parent，layer 层数，roote
 * @return 返回 list树
 */
export function recursiveForEach(list, formatter = fmt, fun, recursive, layer = -1, parent) {
  let roote;
  roote = roote ? roote : list;
  layer++;
  if (recursive && recursive(list, parent, layer, roote)) return roote;
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    if (fun(element, index, list, parent, layer, roote)) return roote;
    keys.forEach(key => {
      if (element[key]) Array.recursiveForEach(fun, keys, [...element[key]], recursive, layer, element)
    });
  }
  return roote;
}