import { pick, get, keys, isEmpty, isNumber, isBoolean } from 'lodash';
import { OPERATOR_FILTER_TABLE } from "~/configs";

export function cloneArrayObject( sourceArr = [] ) {
  return JSON.parse(JSON.stringify(sourceArr))
}

export function pickPropsByPath(object, path, arrayOfPropsNames) {
  return pick(get(object, path), arrayOfPropsNames);
}

export function extendFilters(dataObj) {
  let filters = []
  const arrKeys = keys(dataObj);
  for (const key of arrKeys) {
    if (!isEmpty(dataObj[key]) || isNumber(dataObj[key]) || isBoolean(dataObj[key])) {
      filters.push({
        code: key,
        operator: OPERATOR_FILTER_TABLE.EQUALS,
        value: dataObj[key]
      })
    }
  }
  return filters
}

export function convertFilter(dataObj) {
  let filters = []
  const arrKeys = keys(dataObj);
  for (const key of arrKeys) {
    if (!isEmpty(dataObj[key]) || isNumber(dataObj[key]) || isBoolean(dataObj[key])) {
      filters.push({
        code: key,
        operator: OPERATOR_FILTER_TABLE.EQUALS,
        value: dataObj[key]
      })
    }
  }
  return JSON.stringify(filters)
}

export function convertProofAttached (data, convertKeyToName) {
  let tableData = [];
  const voteKeys = keys(data)
  for (const key of voteKeys) {
    const itemKeys = keys(data[key])
    let children = []
    for (const iKey of itemKeys) {
      children.push({
        voteId: iKey,
        voteType: key,
        keyId: `${key}-${iKey}`,
        children: data[key][iKey]
      })
    }
    tableData.push({
      proofName: convertKeyToName[key],
      keyId: `${key}`,
      children
    })
  }

  return tableData
}