function dfs(obj, key) {
  if (obj.key === key) {
    return obj
  }
  if (obj.children) {
    for (let item of obj.children) {
      let check = dfs(item, key)
      if (check) {
        return check
      }
    }
  }
  return null
}

export function findByKey(menuItems, key) {
  let result = {}
  for (let obj of menuItems) {
    result = dfs(obj, key)
    if (result) {
      break
    }
  }
  return result
}