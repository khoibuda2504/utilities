import _ from 'lodash';

const getString = (obj, propertyPath = undefined, defaultValue = undefined) => {
    try {
        // propertyPath phải là string hoặc undefined 

        if(!propertyPath) return _.isString(obj) ? obj : defaultValue
        let pathValue = _.get(obj, propertyPath)
        if(_.isString(pathValue)) return pathValue
        return defaultValue   

        // if (!_.isUndefined(propertyPath) && !_.isString(propertyPath)) { return undefined; }
        // if (!_.isNil(propertyPath)) {
        //     if (_.isNil(obj)) { return defaultValue; }
        //     if (_.isObject(obj)) {
        //         var properties = propertyPath.split('.');
        //         // tìm property value từ property path
        //         let result = properties.reduce((prev, curr) => prev && prev[curr], obj);
        //         return _.isString(result) ? result : defaultValue;
        //     }
        // }
        // else if (_.isString(obj)) {
        //     return obj;
        // }

    } catch (err) {
        console.log(err);
    }
    return defaultValue;
}

const getNumber = (obj, propertyPath = undefined, defaultValue = undefined) => {
    try {
        // propertyPath phải là string hoặc undefined 

        const fixedFloatNumber = (value) => {
            return parseFloat(Number(value).toFixed(3));
        }

        if(!propertyPath) return _.isNumber(obj) ? fixedFloatNumber(obj) : defaultValue
        let pathValue = _.get(obj, propertyPath)
        if(_.isNumber(pathValue)) return fixedFloatNumber(pathValue)
        return defaultValue   

        // if (!_.isUndefined(propertyPath) && !_.isString(propertyPath)) { return undefined; }
        // if (!_.isNil(propertyPath)) {
        //     if (_.isNil(obj)) { return defaultValue; }
        //     if (_.isObject(obj)) {
        //         var properties = propertyPath.split('.');
        //         // tìm property value từ property path
        //         let result = properties.reduce((prev, curr) => prev && prev[curr], obj);
        //         return _.isNumber(result) ? fixedFloatNumber(result) : defaultValue;
        //     }
        // }
        // else if (_.isNumber(obj)) {
        //     return fixedFloatNumber(obj)
        // }

    } catch (err) {
        console.log(err);
    }
    return defaultValue;
}

const getBool = (obj, propertyPath = undefined, defaultValue = undefined) => {
    try {
        // propertyPath phải là string hoặc undefined 

        if(!propertyPath) return _.isBoolean(obj) ? obj : defaultValue
        let pathValue = _.get(obj, propertyPath)
        if(_.isBoolean(pathValue)) return pathValue
        return defaultValue   

        // if (!_.isUndefined(propertyPath) && !_.isString(propertyPath)) { return undefined; }
        // if (!_.isNil(propertyPath)) {
        //     if (_.isNil(obj)) { return defaultValue; }
        //     if (_.isObject(obj)) {
        //         var properties = propertyPath.split('.');
        //         // tìm property value từ property path
        //         let result = properties.reduce((prev, curr) => prev && prev[curr], obj);
        //         return _.isBoolean(result) ? result : defaultValue;
        //     }
        // }
        // else if (_.isBoolean(obj)) {
        //     return obj;
        // }
    } catch (err) {
        console.log(err);
    }
    return defaultValue;
}

const getArray = (obj, propertyPath = undefined, defaultValue = undefined) => {
    try {
        // propertyPath phải là string hoặc undefined 

        if(!propertyPath) return _.isArray(obj) ? obj : defaultValue
        let pathValue = _.get(obj, propertyPath)
        if(_.isArray(pathValue)) return pathValue
        return defaultValue   

    } catch (err) {
        console.log(err);
    }
    return defaultValue;
}

const getObject = (obj, propertyPath = undefined, defaultValue = {}) => {
    try {
        // propertyPath phải là string hoặc undefined 
        if(!propertyPath) return _.isObject(obj) ? obj : defaultValue
        let pathValue = _.get(obj, propertyPath)
        if(_.isObject(pathValue)) return pathValue
        return defaultValue   
    } catch (err) {
        console.log(err);
    }
    return defaultValue;
}


const getArrayWithoutEmptyItem = (array) => {
    const isEmptyObject = (item) => {
        let keys = Object.keys(item).filter(key => key !== 'key' && (typeof item[key] === 'number' || typeof item[key] === 'string'))
        let counter = 0
        keys.forEach(key => {
            if (!isNullOrEmpty(item[key])) { counter++ }
        })
        return counter === 0
    }
    return getArray(array, undefined, []).filter(item => !isEmptyObject(item))
}



const removeEmptyArrayItem = (object) => {
    let keys = Object.keys(object).filter(key => getArray(object, key, []).length > 0)
    let modifyObject = {}
    keys.forEach(key => {
        modifyObject[key] = getArrayWithoutEmptyItem(object[key])
    })
    return {
        ...object,
        ...modifyObject
    }
}


const isNullOrEmpty = (value) => {
    return _.isNil(value) || (!_.isNil(value) && _.isString(value) && (value || '').trim().length === 0)
}

const getMatchedValueWithRegex = (val, reg) => {
    let results = (val || '').match(reg) || [];
    return _.first(results) || '';
}


const removeSignThenLowerCaseString = (value) => {
    return (getString(value) || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9 ]/g, ' ')
        .toLocaleLowerCase()
        .trim()
}



export {
    getString,
    getNumber,
    getObject,
    getArray,
    getBool,
    removeSignThenLowerCaseString,
    getMatchedValueWithRegex,
    isNullOrEmpty,
    getArrayWithoutEmptyItem,
    removeEmptyArrayItem

}

