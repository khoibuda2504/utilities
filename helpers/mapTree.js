import flattenDeep from 'lodash/flattenDeep';
import { cloneArrayObject } from '.';

export const mapTree = (arrFlatInput, key = "parentId", elIdx = "id") => {
  const arrFlat = cloneArrayObject(arrFlatInput)
  const root = []
  // Cache found parent index
  const map = {}

  arrFlat.forEach(node => {
    // No parentId means top level
    if (!node[key]) return root.push(node)

    // Insert node as child of parent in arrFlat array
    let parentIndex = map[node[key]]
    if (typeof parentIndex !== "number") {
      parentIndex = arrFlat.findIndex(el => el[elIdx] === node[key])
      map[node[key]] = parentIndex
    }

    // Check if the parent node exists
    if (parentIndex !== -1) {
      if (!arrFlat[parentIndex].children) {
        arrFlat[parentIndex].children = []
      }
      arrFlat[parentIndex].children.push(node)
    }
  });

  return root
}

export const flattenTree = (
  tree,
  getChildNodes,
  convertNode = (
    node,
    parentNode,
    nodeId,
    parentNodeId
  ) => OutNode => node,
  generateId = (node) => () => undefined
) => {
  const stack = tree && tree.length ? [{ pointer: tree, offset: 0 }] : []
  const flat = []
  let current = {
    pointer: [],
    offset: 0,
    node: {},
    nodeId: "",
  }

  while (stack.length) {
    current = stack.pop()

    while (current.offset < current.pointer.length) {
      const node = current.pointer[current.offset]
      const nodeId = generateId(node)
      const children = getChildNodes(node)

      flat.push(convertNode(node, current.node, nodeId, current.nodeId))

      current.offset += 1

      if (children) {
        stack.push(current)

        current = {
          pointer: children,
          offset: 0,
          node,
          nodeId
        };
      }
    }
  }
  return flat
}

export const mapObjectToTree = (obj, keyParent = "name", extentArrField) => {
  let tree = []
  let count = 0;
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    const childrenData = extentArrField ? obj[keys[i]]?.[extentArrField] : obj[keys[i]]
    tree.push({
      key: 'tree-table-' + (i + 1),
      ...obj[keys[i]],
      [keyParent]: keys[i],
      // eslint-disable-next-line
      children: (childrenData ?? []).map((it, idx) => {
        return ({
          ...it,
          key: `tree-table-child-${i + 1}-${idx}`,
          parentKey: 'tree-table-' + (i + 1),
          idx: count++
        })
      })
    })
  }
  return tree
}

export function updateValue(n, key = "budgetAmount") {
  if (n?.children === undefined) return n[key]
  n.children.forEach(function (c) {
    var r = updateValue(c, key)
    if (!n[key]) {
      n[key] = 0
    }
    n[key] += r
  });
  return n[key]
}

export function updateValues(n, keys = ["budgetAmount"]) {
  if (n.children === undefined) {
    let objValue = {}
    for (const key of keys) {
      objValue[key] = n[key]
    }
    return objValue
  }
  n.children.forEach(function (c) {
    var r = updateValues(c, keys)
    for (const key of keys) {
      if (!n[key]) {
        n[key] = 0
      }
      n[key] += (r[key] || 0)
    }
  });

  let cacheValues = {}
  for (const key of keys) {
    cacheValues[key] = n[key]
  }
  return cacheValues
}

export function updateKey(node, parentId) {
  node.parentKey = `${parentId}`
  node.defaultParentId = null

  if (!node.children) return

  node.children.forEach(function (child, index) {
    child.parentKey = `${parentId}-${index}`
    child.defaultParentId = `${parentId}`
    child.childIdx = `${+parentId + 1}.${index + 1}`

    // Call update parentKey for current child
    updateKey(child, child.parentKey)
  });
}


export function convertToTree(data, parentIdKey = 'budgetParentId', nodeIdKey = 'budgetInternalId') {
  const tree = mapTree(data, parentIdKey, nodeIdKey)
  tree.forEach((it, id) => updateKey(it, id))
  return tree
}


export function renderPath(key, field) {
  try {
    if (!key && typeof key !== "string") return key;
    const indexs = key?.split("-")
    const lenIndexs = indexs?.length;
    let stringPath = ""
    let fieldPath = {}
    let prevPath = field
    for (let i = 0; i < lenIndexs; i++) {
      if (i === lenIndexs - 1) {
        stringPath += indexs?.[i]
        fieldPath = prevPath?.[indexs?.[i]]
      } else {
        stringPath += `${indexs?.[i]}.children.`
        prevPath = prevPath?.[indexs[i]]?.children
      }
    }
    return [stringPath, fieldPath, prevPath]
  } catch (err) {
    console.log("error: ", err)
  }
};
export function removeNodeOfTree(sourceArr, id, parentIdKey = "budgetParentId", nodeIdKey = "budgetInternalId", nodeIdKeyDefault = "id", exNodeIdKey = "budgetInternalId") {
  if (!sourceArr || !id) return sourceArr || []

  const cloneArr = cloneArrayObject(sourceArr)
  const idx = cloneArr.findIndex(
    node =>
      node?.[nodeIdKey]
        ? node?.[nodeIdKey] === id
        : node?.[nodeIdKeyDefault] ?? node?.[exNodeIdKey] === id
  );

  if (idx < 0) return sourceArr || []

  const node = cloneArr[idx]
  const parentId = node?.[parentIdKey]
  cloneArr.splice(idx, 1)

  if (!parentId) {
    return cloneArr.filter(it => it?.[parentIdKey] !== node?.[nodeIdKey]) || []
  }

  const sumChilds = cloneArr.filter(node => node?.[parentIdKey] === parentId).length

  return sumChilds === 0
    ? removeNodeOfTree(cloneArr, parentId, parentIdKey, nodeIdKey, nodeIdKeyDefault, exNodeIdKey)
    : cloneArr
}

export function findNodeParents(sourceArr, id, parents, parentIdKey = "budgetParentId", nodeIdKey = "budgetInternalId", nodeIdKeyDefault = "id") {
  if (!sourceArr) return (sourceArr || [])
  const nodeParent = sourceArr.find(node => node[nodeIdKey] ? node[nodeIdKey] === id : node[nodeIdKeyDefault] === id)
  if (!nodeParent) return (parents || [])
  parents.push(nodeParent)
  return findNodeParents(sourceArr, nodeParent[parentIdKey], parents, parentIdKey, nodeIdKey, nodeIdKeyDefault)
}

export function addNodeToTree(sourceArr, newNode, nodeParents, parentIdKey = "budgetParentId", nodeIdKey = "budgetInternalId", allowDuplicate = false) {
  if (!sourceArr) return []

  let cloneArr = cloneArrayObject(sourceArr)
  const parentId = newNode[parentIdKey]
  const nodeId = newNode[nodeIdKey]

  if (!allowDuplicate) {
    const checkExists = cloneArr.findIndex(node => node[nodeIdKey] === nodeId)
    if (checkExists < 0) {
      cloneArr.push(newNode)
    }
  } else {
    cloneArr.push(newNode)
  }

  const checkParentExists = cloneArr.findIndex(node => node[nodeIdKey] === parentId)

  if (checkParentExists < 0) {
    const diffParents = nodeParents.filter(item => !cloneArr.some(otherItem => item[nodeIdKey] === otherItem[nodeIdKey]))
    cloneArr = [...cloneArr, ...diffParents]
  }

  return cloneArr
}

export function getAllNodeLeaf(originTree, leafNodes = []) {
  if (!originTree) return leafNodes

  for (const node of originTree) {
    if (node.children) {
      getAllNodeLeaf(node.children, leafNodes)
    } else {
      leafNodes.push(node)
    }
  }

  return leafNodes
}

export const getAllKeys = (data, customKey = "id") => {
  const nestedKeys = (data ?? []).map(node => {
    let childKeys = []
    if (node.children) {
      childKeys = getAllKeys(node.children, customKey)
    }
    return [childKeys, node[customKey]]
  });
  return flattenDeep(nestedKeys)
};
