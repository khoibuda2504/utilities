const addQuerySorter = (obj) => {
  const keys = Object.keys(obj);
  return {
    column: keys[0],
    direction: obj[keys[0]]
  }
}

export default addQuerySorter