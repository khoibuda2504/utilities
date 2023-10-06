import _ from 'lodash';
import queryString from "query-string"

const obj1 = {
	page: 1,
	limit: 10,
	keyword: '',
	status: '',
	start_date: '',
	end_date: ''
};

// function parseObjToQuery(obj = obj1) {
// 	let qr = '';
// 	if (!!obj) {
// 		const keys = Object.keys(obj);
// 		const values = Object.values(obj);
// 		qr += '?';
// 		keys.forEach((item, id) => {
// 			qr += `${item}=${values[id]}${id < keys.length - 1 ? '&' : ''}`;
// 		});
// 	}
// 	return qr;
// }

function parseObjToQuery(obj = obj1, startWith = '?') {
	if (_.isNil(obj)) return "";


	let keys = Object.keys(obj).filter(key => 
		!_.isNil(obj[key]) && 
		!((_.isString(obj[key]) && obj[key].trim().length === 0)) &&
		!((_.isObject(obj[key]) && Object.keys(obj[key]).length === 0))
	);
	let params = {};

	(keys || []).map(key => params = { ...params, [key]: obj[key] })
	return startWith + queryString.stringify(params);
}


export default parseObjToQuery;
