
export function pushToTopByPath(menus, pathToPush) {
  if (!pathToPush) {
    return menus
  } else {
    const findIndex = menus.findIndex(menu => menu.path === pathToPush)
    if (findIndex > -1) {
      const findItem = menus[findIndex]
      return [findItem, ...menus.filter((_, index) => index !== findIndex)]
    } else {
      return menus
    }
  }
}