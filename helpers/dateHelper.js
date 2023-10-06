import { SALE_CONFIG_STATUS, TIME_WORK_RULE, SHIFT_TYPE } from '~/configs'
import moment from 'moment'

const getDateRange = (startDate, endDate) => {

  var now = startDate, dates = [];

  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format('D/M'));
    now.add(1, 'days');
  }
  return dates;
}

export const getMonthDateRange = (year, month) => {

  // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
  // array is 'year', 'month', 'day', etc
  var startDate = moment([year, month - 1]);

  // Clone the value before .endOf()
  var endDate = moment(startDate).endOf('month');

  // make sure to call toDate() for plain JavaScript date type
  return { start: startDate, end: endDate };
}

export const getHourWork = (startDate, endDate) => {
  const d = endDate.diff(startDate, 'days') + 1
  let hStartDate = TIME_WORK_RULE.END - startDate.hour()
  if (hStartDate <= 0) {
    hStartDate = 0
  }
  if (startDate.hour() < 12) {
    hStartDate -= 1
  }
  let hEndDate = endDate.hour()
  if (hEndDate > TIME_WORK_RULE.END) {
    hEndDate = TIME_WORK_RULE.END
  }
  hEndDate -= TIME_WORK_RULE.START
  if (hEndDate <= 0) {
    hEndDate = 0
  }
  if (endDate.hour() > 12) {
    hEndDate -= 1
  }
  const total = hStartDate + hEndDate + (d - 2) * TIME_WORK_RULE.TIME
  return total > 0 ? total : 0
}

export const getHourWorkByDay = (startDate, endDate) => {
  let d = endDate.diff(startDate, 'days') + 1
  if (d < 0) {
    d = 0
  }
  return d * 8
}

export const getDayBetweenTwoDay = (startDate, endDate) => {
  const d = endDate.diff(startDate, 'days') + 1
  return d > 0 ? d : 0
}
const getDaysArray = function (start, end) {
  let arr = []
  for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  let obj = {}
  let countSatday = 0;
  let countSunday = 0;
  arr.forEach(it => {
    if(it.getDay() === 6) {
      countSatday++
    }
    if(it.getDay() === 0) {
      countSunday++
    }
  })
  obj.countSatday = countSatday
  obj.countSunday = countSunday
return {...obj, arr}
};

export const getDateWithShift = (startDate, endDate, shiftData, leaveKey) => {
  const s = new Date(+startDate);
  const e = new Date(+endDate);
  // Set time to midday to avoid dalight saving and browser quirks
  s.setHours(12, 0, 0, 0);
  e.setHours(12, 0, 0, 0);
  const dayObj = getDaysArray(s,e);
  // If not even number of weeks, calc remaining weekend days
  const totalDateOff = dayObj?.arr?.length - dayObj?.countSatday - dayObj?.countSunday
  switch (shiftData?.saturdayWorkStatus) {
    case SHIFT_TYPE.ALLDAY:
      return leaveKey === SHIFT_TYPE.ALLDAY ? 
            totalDateOff + dayObj?.countSatday : 
            (totalDateOff + dayObj?.countSatday)/2
    case SHIFT_TYPE.HALFTIME:
      const halfDate = dayObj.countSatday * 0.5
      return leaveKey === SHIFT_TYPE.ALLDAY ? 
            totalDateOff + halfDate : 
            (totalDateOff) / 2 + halfDate
    case SHIFT_TYPE.DAYOFF: 
      return leaveKey === SHIFT_TYPE.ALLDAY ? totalDateOff : totalDateOff/2;
    default:
      break;
  }
};
const subtractTimes = (times) => {
  let totalDiff = 0
  for (let i = 0; i < times.length; i++) {
    let duration = moment.duration(times[i]).as('milliseconds')
    if (i === 0) {
      totalDiff = duration
    }
    if (i > 0) {
      totalDiff = totalDiff - duration
    }
  }
  return totalDiff
}

export const getEventTimer = (compareDateConfig) => {
  const { startDay, startTime, endTime } = compareDateConfig
  const curDate = moment().utc()
  const startDate = moment(startDay)
  const d = startDate.diff(curDate, 'days') + 1
  let status = SALE_CONFIG_STATUS["FINISHED"]
  if(d > 0) { 
    status = SALE_CONFIG_STATUS["COMING"]
  } else if(d === 0) {
    const subTimeStart = subtractTimes([startTime, curDate?.format("HH:mm")])
    const subTimeEnd = subtractTimes([endTime, curDate?.format("HH:mm")])
    if(subTimeStart <= 0 && subTimeEnd >= 0) {
      status = SALE_CONFIG_STATUS["ON_GOING"]
    } else {
      status = SALE_CONFIG_STATUS["COMING"]
    }
  }
  return {
    day: d,
    status
  }
}

export function dateToFromNowDaily( myDate ) {
  // ensure the date is displayed with today and yesterday
  return moment( myDate ).calendar( null, {
      // when the date is closer, specify custom values
      lastWeek: 'DD/MM, HH:mm',
      lastDay:  '[Hôm qua], HH:mm',
      sameDay:  '[Hôm nay], HH:mm',
      nextDay:  '[Ngày mai], HH:mm',
      nextWeek: 'DD/ MM HH:mm',
      // when the date is further away, use from-now functionality             
      sameElse: function () {
          return 'DD/MM, HH:mm';
      }
  });
}

export default getDateRange;