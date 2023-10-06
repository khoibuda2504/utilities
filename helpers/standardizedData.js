export function removeKeyNull(obj) {
  if(!obj) return obj
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] === undefined || obj[key] === null )) {
      delete obj[key]
    }
  }
  return obj
}