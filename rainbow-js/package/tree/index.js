import { arrayLoop, arrayRemove } from '../array';
import { d } from './data'

function fmt(item) {
  return item?.children ?? []
}

/**
 * 树形结构模糊筛选 不改变原树的堆
 * @param {*} children 
 * @param {*} formatter 
 * @param {*} formatterChildren 
 * 
 * @param {*} copyC 
 * @param {*} parent 
 * @param {*} parentList 
 */
export function treeVagueFilter(
  children = [],
  formatter,
  formatterChildren = fmt,
  copyC = [...children],
  parent,
  parentList) {
  copyC.forEach(child => {
    const childList = formatterChildren(child);
    if (!formatter(child) && !childList?.length) arrayRemove(children, child)
    if (formatter(child)) return
    if (childList?.length) treeVagueFilter(childList, formatter, formatterChildren, [...(childList ?? [])], child, children)
  });

  if (parent && parentList) {
    const pChildList = formatterChildren(parent);
    if (!formatter(parent) && !pChildList?.length) arrayRemove(parentList, parent)
  }
}

/**
 * 树形结构 递归循环
 * @param {*} list 
 * @param {*} fun 
 * @param {*} recursive 
 * @param {*} formatter 
 * @param {*} layer 
 * @param {*} parent 
 * @returns 
 */
export function treeForEach(list = [], fun, recursive, formatter = fmt, layer = -1, parent) {
  let roote;
  roote = roote ? roote : list;
  layer++;
  if (recursive && recursive(list, parent, layer, roote)) return roote;
  for (let index = 0; index < list.length; index++) {
    const child = list[index];
    const children = formatter(child);
    if (fun(child, index, list, parent, layer, roote)) return roote;
    treeForEach(children, fun, recursive, formatter, layer, parent)
  }
  return roote;
}
