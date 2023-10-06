import floor from "lodash/floor"

const number = [" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín "];
const currency = ["", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ"];

//1. Hàm đọc số có ba chữ số;
function read3Num(baso, firstTime) {
  let tram;
  let chuc;
  let donvi;
  let result = "";
  tram = parseInt(baso / 100, 10);
  chuc = parseInt((baso % 100) / 10, 10);
  donvi = baso % 10;
  if (tram === 0 && chuc === 0 && donvi === 0) return "";
  if (!firstTime && ((tram === 0))) {
    result += " không trăm "
  } else {
    result += ""
  }
  if ((tram === 0 && chuc === 0) && !firstTime) {
    result += " lẻ "
  }
  if (tram !== 0) {
    result += number[tram] + " trăm ";
    if ((chuc === 0) && (donvi !== 0)) result += " linh ";
  }
  if ((chuc !== 0) && (chuc !== 1)) {
    result += number[chuc] + " mươi";
    if ((chuc === 0) && (donvi !== 0)) result = result + " linh ";
  }
  if (chuc === 1) result += " mười ";
  switch (donvi) {
    case 1:
      if ((chuc !== 0) && (chuc !== 1)) {
        result += " mốt ";
      }
      else {
        result += number[donvi];
      }
      break;
    case 5:
      if (chuc === 0) {
        result += number[donvi];
      }
      else {
        result += " lăm ";
      }
      break;
    default:
      if (donvi !== 0) {
        result += number[donvi];
      }
      break;
  }
  return result;
}

//2. Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)

function readCurrencyyString(numCurrency, hasRead3Num = true) {
  let count = 0;
  let num = 0;
  let result = "";
  let position = [];
  if (numCurrency < 0) return "Số tiền âm";
  if (numCurrency === 0) return "";
  num = numCurrency;
  if (numCurrency > 8999999999999999) return "Số tiền quá lớn";
  position[5] = ~~(num / 1000000000000000);
  if (isNaN(position[5]))
    position[5] = "0";
  num = num - parseFloat(position[5].toString()) * 1000000000000000;
  position[4] = ~~(num / 1000000000000);
  if (isNaN(position[4]))
    position[4] = "0";
  num = num - parseFloat(position[4].toString()) * 1000000000000;
  position[3] = ~~(num / 1000000000);
  if (isNaN(position[3]))
    position[3] = "0";
  num = num - parseFloat(position[3].toString()) * 1000000000;
  position[2] = parseInt(num / 1000000, 10);
  if (isNaN(position[2]))
    position[2] = "0";
  position[1] = parseInt((num % 1000000) / 1000, 10);
  if (isNaN(position[1]))
    position[1] = "0";
  position[0] = parseInt(num % 1000, 10);
  if (isNaN(position[0]))
    position[0] = "0";
  for (let i = 5; i >= 0; i--) {
    if (position[i] > 0) {
      count = i;
      break;
    }
  }
  for (let i = count; i >= 0; i--) {
    const idxPosition = position[i] === position[count]
    let tmp = hasRead3Num ? read3Num(position[i], idxPosition) : position[i];
    result += tmp;
    if (position[i] > 0) result += currency[i];
    if ((i > 0) && (tmp.length > 0)) result += ',';
  }
  if (result.substring(result.length - 1) === ',') {
    result = result.substring(0, result.length - 1);
  }
  result = result.substring(1, 2).toUpperCase() + result.substring(2);
  return result + ` đồng${((numCurrency % 2000) === 0) ? ' chẵn' : ''}`;
}

export const readPrice = (price) => {
  const units = ['Đồng', 'Ngàn', 'Triệu', 'Tỷ', "Ngàn Tỷ"]
  let curPrice = price

  let arrs = []
  units.forEach(function (unit) {
    arrs.push({
      value: curPrice % 1000,
      unit: unit
    })
    curPrice = floor(curPrice / 1000)
  })
  const revArr = arrs?.reverse()?.filter(it => it.value > 0)
  return revArr?.length > 0 ? revArr.map(it => `${it.value} ${it.unit}`)?.join(' ') : '0'
}

export default readCurrencyyString;