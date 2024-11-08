import { arrayLoop, arrayRemove } from '../array';
import { d } from './data'

function fmt(item) {
  return item?.children ?? []
}

/**
 * 树形结构筛选 改变原对象
 * @param {*} children 
 * @param {*} formatter 
 * @param {*} formatterChildren 
 * @param {*} isdeep
 * 
 * @param {*} copyC 
 * @param {*} parent 
 * @param {*} parentList 
 */
export function treeConditionRemove(
  children = [],
  formatter,
  isdeep = false,
  formatterChildren = fmt,
  copyC = [...children],
  parent,
  parentList) {
  copyC.forEach(child => {
    const childList = formatterChildren(child);
    if (!formatter(child) && !childList?.length) arrayRemove(children, child)
    if (!isdeep && formatter(child)) return
    if (childList?.length) treeConditionRemove(childList, formatter, isdeep, formatterChildren, [...(childList ?? [])], child, children)
  });

  if (parent && parentList) {
    const pChildList = formatterChildren(parent);
    if (!formatter(parent) && !pChildList?.length) arrayRemove(parentList, parent)
  }
}

export function treeConditionDeepRemove(children = [], formatter, formatterChildren) {
  treeConditionRemove(children, formatter, true, formatterChildren)
}



function __treefilter(
  children = [],
  formatter,
  isdeep = false,
  formatterChildren = fmt,
  copyC = [...children],
  parent,
  parentList) {
  children.forEach(el => el.children = el.children?.map?.(val => ({ ...val })))
  copyC.forEach(child => {
    let childList = formatterChildren(child);
    if (!formatter(child) && !childList?.length) arrayRemove(children, child)
    if (!isdeep && formatter(child)) return
    let copy = [...(childList ?? [])]
    if (childList?.length) __treefilter(childList, formatter, isdeep, formatterChildren, copy, child, children)
  });

  if (parent && parentList) {
    const pChildList = formatterChildren(parent);
    if (!formatter(parent) && !pChildList?.length) arrayRemove(parentList, parent)
  }
}
/**
 * 树形结构筛选 不改变原对象 返回新树
 * @param {*} children 
 * @param {*} formatter 
 * @param {*} formatterChildren 
 * @param {*} isdeep
 * 
 * @param {*} copyC 
 * @param {*} parent 
 * @param {*} parentList 
 */
export function treefilter(treeList = [], ...arg) {
  const d = treeList.map(el => ({ ...el }));
  __treefilter(d, ...arg);
  return d;
}
// console.log(treefilter(d.data, (item) => item.name?.includes("玩具"), false));
// console.log(d.data);

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



