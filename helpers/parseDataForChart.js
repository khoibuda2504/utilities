const sortDate = (a, b) => {
    if (a.month < b.month) {
        return -1;
    }
    if (a.month > b.month) {
        return 1;
    }

    return 0;
}

const sortHour = (a, b) => {
    if (+a.month.split(":", 1) < +b.month.split(":", 1)) {
        return -1;
    }
    if (+a.month.split(":", 1) > +b.month.split(":", 1)) {
        return 1;
    }
    return 0;
}

const item = {
    'KOLs': 0,
    'Chiến dịch': 0,
    'Khách hàng': 0
};

const item2 = {
    'Thành viên': 0,
}




function parseDataForChart(arr, dateLookup, typeChart, hours = false ) {
    const normalize = text => text.trim().toLowerCase();
    const itemDate = (typeChart === "barChart") ? item2 : item;
    const DatesLookup = Object.create(null);
    
    arr.forEach(date => { 
        date.month = hours ? date.month : date.month.split("-", 1)[0];
        DatesLookup[normalize(date.month)] = 1;
    });
    const getDates = (input) => {
        return input.reduce((array, date) => {
            let key = normalize(date);
            if (DatesLookup[key] !== 1) {
                array.push(key);
            }

            return array;
        }, []);
    };
    const data = getDates(dateLookup);
    for (let i = 0; i < data.length; i++) {
        arr.push({
            month: data[i],
            ...itemDate,
        })
    }
    return arr.sort(hours ? sortHour : sortDate)
}

export default parseDataForChart;