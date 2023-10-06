import _ from 'lodash';
import { getBool, getString } from './utilObject';
import { OPERATOR_TYPE, PAGINATION } from '~/configs';
const queryString = require('query-string');
/**
 * dùng tạo url params
 */
const generatePagination = (pageInfo = {
  page: 0,
  size: PAGINATION.PAGE_SIZE
}) => {
  let _page = _.isNumber(pageInfo.page) ? pageInfo.page : 0
  let _size = _.isNumber(pageInfo.size) ? pageInfo.size : PAGINATION.PAGE_SIZE
  return {
    offset: _page * _size,
    limit: _size,
    page: _page,
    size: _size
  }
}

const generateSorterObject = (sorter) => {
  let order = getString(sorter, 'order');
  let dataIndex = getString(sorter, 'column.dataIndex');
  let sorterKey = getString(sorter, 'column.sorterKey');
  let customSort = getBool(sorter, 'customSort', false)
  let sorterObject = {};

  if ((dataIndex || sorterKey) && order) {
    if (customSort) {
      sorterObject = {
        sortColumnId: JSON.stringify([`${sorterKey ? sorterKey : dataIndex}:${order === 'descend' ? 'DESC' : 'ASC'}`])
      }
    } else {
      sorterObject = {
        sort: JSON.stringify([`${sorterKey ? sorterKey : dataIndex}:${order === 'descend' ? 'DESC' : 'ASC'}`])
      }
    }

  }
  return sorterObject
}

const appendFilters = (params, filters, omitArr = []) => {
  let curr = generateSearchOrFilter(params, false, omitArr)
  let cFilters = curr.filters

  let nFilters = [...cFilters, ...filters]
  return {
    filters: nFilters.length > 0 ? JSON.stringify(nFilters) : undefined,
    sort: !_.isEmpty(curr.sort) ? JSON.stringify(curr.sort) : undefined
  }
}

const initialExtendFilters = (props) => (extendFilters, otherParams) => {
  const { filterOrSearchParams, setFilterOrSearchParams } = props
  filterOrSearchParams.extendFilters = extendFilters || []
  filterOrSearchParams.otherParams = otherParams || {}
  setFilterOrSearchParams(filterOrSearchParams)
  return { ...props, filterOrSearchParams: filterOrSearchParams }
}

const appendExtendFilter = (props) => (status) => (obj = { code: '', operator: '', value: null }) => {
  const { filterOrSearchParams, setFilterOrSearchParams } = props
  let extendFilters = filterOrSearchParams?.extendFilters || []

  let tmp = extendFilters.filter(it => it.code !== obj.code)
  if (status !== 'ALL') {
    tmp.push(obj)
  }
  filterOrSearchParams.extendFilters = tmp

  setFilterOrSearchParams(filterOrSearchParams)
  return { ...props, filterOrSearchParams }
}

const storeWithTemporaryFilters = (props) => (params) => (temporaryFilters, otherParams) => {
  const { setFilterOrSearchParams } = props
  params.temporaryFilters = temporaryFilters
  if (otherParams) {
    params.otherParams = otherParams
  }
  setFilterOrSearchParams(params)
  return params
}

const generateSearchOrFilter = (params = {}, autoStringify = true, withOutFilterKeys = [], additionFilters = [], overrideOperators, additionField = {}) => {
  let filters = params.filters || {}

  let temporaryFilters = params.temporaryFilters || []
  let search = params.search || {}
  let ranges = params.ranges || { from: {}, to: {} }
  let extendFilters = params.extendFilters || []
  let otherParams = params.otherParams || {}
  let sort = params.sort

  extendFilters = extendFilters.filter(f => additionFilters.find(af => af.code === f.code) === undefined)

  extendFilters = [...extendFilters, ...additionFilters]


  let filterItems = { ...filters, ...search }
  let filterArray = Object.keys(filterItems).map(key => ({
    code: key,
    operator: overrideOperators?.[key.trim()] ?? OPERATOR_TYPE.CCI,
    value: filterItems[key],
    ...(additionField?.[key] ? additionField?.[key] : {})
  }))

  filterArray.push(...extendFilters)
  filterArray.push(...temporaryFilters)

  if (withOutFilterKeys?.length > 0) {
    filterArray = filterArray.filter(it => withOutFilterKeys.find(i => i === it.code) === undefined)
  }


  Object.keys(ranges.from).forEach(key => {
    filterArray.push({
      code: key,
      operator: OPERATOR_TYPE.GET,
      value: ranges.from[key]
    })
  })

  Object.keys(ranges.to).forEach(key => {
    filterArray.push({
      code: key,
      operator: OPERATOR_TYPE.SET,
      value: ranges.to[key]
    })
  })

  return {
    filters: autoStringify === true ? (filterArray.length > 0 ? JSON.stringify(filterArray) : undefined) : filterArray,
    sort: !_.isEmpty(sort) && autoStringify === true ? JSON.stringify(sort) : sort,
    ...otherParams
  }
}


const generateURL = ({
  path,
  params
}) => {
  return `${path}?${Object.keys(params).filter(key => !(_.isString(params[key]) && params[key].trim().length === 0)).map(key => `${key}=${params[key]}`).join('&')}`
}

const updateURLParams = (props, params = [{ key: '', value: '' }]) => {
  const { location, history } = props;
  let q = queryString.parse(getString(location, 'search'));
  params.forEach((item) => {
    q[item.key] = item.value
  })
  history.push(window.location.pathname + `?${Object.keys(q).filter(key => !(_.isString(q[key]) && q[key].trim().length === 0)).map(key => `${key}=${q[key]}`).join('&')}`)
}


export {
  generatePagination,
  generateURL,
  generateSorterObject,
  updateURLParams,
  generateSearchOrFilter,
  appendFilters,
  initialExtendFilters,
  appendExtendFilter,
  storeWithTemporaryFilters
}