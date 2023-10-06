import findIndex from 'lodash/findIndex'
import { OPERATOR_FILTER_TABLE } from '~/configs';

const addQueryFilter = (filters, obj, operator = OPERATOR_FILTER_TABLE.CONTAINS) => {
  const keys = Object.keys(obj);
  if (typeof filters === 'string') {
    filters = JSON.parse(filters)
  }
  if (keys.length > 0 ) {
    const isEquals = operator === OPERATOR_FILTER_TABLE.EQUALS
    const idx = findIndex(filters, {'code': keys[0]});
    if (idx > -1) {
      filters[idx].value = isEquals ? obj[keys[0]] : [obj[keys[0]]]
      return filters;
    }

    return  [
        ...filters,
        {
          code: keys[0],
          operator,
          value: isEquals ? obj[keys[0]] : [obj[keys[0]]]
        }
      ]; 
  }
  return filters
}

export default addQueryFilter