import { arrayLoop, arrayRemove } from "../array";

function fmt(item) {
  return item?.children ?? [];
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
  parentList,
) {
  copyC.forEach((child) => {
    const childList = formatterChildren(child);
    if (!formatter(child) && !childList?.length) arrayRemove(children, child);
    if (!isdeep && formatter(child)) return;
    if (childList?.length)
      treeConditionRemove(
        childList,
        formatter,
        isdeep,
        formatterChildren,
        [...(childList ?? [])],
        child,
        children,
      );
  });

  if (parent && parentList) {
    const pChildList = formatterChildren(parent);
    if (!formatter(parent) && !pChildList?.length) arrayRemove(parentList, parent);
  }
}

export function treeConditionDeepRemove(children = [], formatter, formatterChildren) {
  treeConditionRemove(children, formatter, true, formatterChildren);
}

function __treefilter(
  children = [],
  formatter,
  isdeep = false,
  formatterChildren = fmt,

  copyC = [...children],
  parent,
  parentList,
  layer = -1,
) {
  layer++;
  children.forEach((el) => (el.children = el.children?.map?.((val) => ({ ...val }))));
  copyC.forEach((child) => {
    let childList = formatterChildren(child);
    if (!formatter(child, layer, parent) && !childList?.length) arrayRemove(children, child);
    if (!isdeep && formatter(child, layer, parent)) return;
    let copy = [...(childList ?? [])];
    if (childList?.length) __treefilter(childList, formatter, isdeep, formatterChildren, copy, child, children, layer);
  });

  if (parent && parentList) {
    const pChildList = formatterChildren(parent);
    if (!formatter(parent, layer) && !pChildList?.length) arrayRemove(parentList, parent);
  }
}
/**
 * 树形结构筛选 不改变原对象 返回新树
 * @param {*} children
 * @param {*} formatter
 * @param {*} isdeep
 * @param {*} formatterChildren
 *
 * @param {*} copyC
 * @param {*} parent
 * @param {*} parentList
 */
export function treefilter(treeList = [], ...arg) {
  // const d =  treeList.map(el => ({ ...el }));
  const d = JSON.parse(JSON.stringify(treeList));
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
    const children = formatter(child, index, parent, layer);
    if (fun(child, index, list, parent, layer, roote)) return roote;
    if (children?.length) treeForEach(children, fun, recursive, formatter, layer, parent);
  }
  return roote;
}

export function treePathMap(tree = [], formatter, data = [], parent, path = [], layer = -1) {
  layer++;
  tree.forEach(() => {
    path.push;
  });
}
