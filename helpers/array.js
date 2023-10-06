import { SORT_TYPE } from "~/configs";

export function sortArray(arr = [], key, orderBy = "asc") {
  if (orderBy === SORT_TYPE.ASC) {
    return arr.sort((a, b) => (!!key ? a[key] : a) - (!!key ? b[key] : b))
  }
  return arr.sort((a, b) => (!!key ? b[key] : b) - (!!key ? a[key] : a))
}

export function mapArrayViaKey(data, key) {
  return Object.values(data?.reduce((obj, cur) => {
    if (!obj[cur?.[key]]) {
      obj[cur?.[key]] = { id: cur?.[key], reaction: cur?.[key] ?? '', docs: [] }
    }
    obj[cur?.[key]].docs.push(cur)
    return obj
  }, {})) ?? []
}