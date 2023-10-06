import { isNumber } from "lodash";

function countDecimals(value) {
  if(Math.floor(value) === value) return 0;
  return (value.toString().split(".")[1] || '').length || 0; 
}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};

export const parseCurrency = (money, decimalCount) => {
  if(money !== null && money !== undefined) {
    const decimalCountAuto = countDecimals(money) > 0 ? 3 : 0
    return `${formatMoney((money || 0), decimalCount ? decimalCount : decimalCountAuto)}`;
  }
  return ''
}
export const fixedNum = (value, decimalCount = 3) => {
  if(!isNumber(value)) return undefined
  return parseFloat(Number(value || 0).toFixed(decimalCount))
}

export const convertNumberToRoman = (num) => {
  const convert = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let result = "";
  for (const [key, value] of Object.entries(convert)) {
    const symbolCount = Math.floor(num / value);
    if (symbolCount > 0) {
      result += key.repeat(symbolCount);
      num = num % value;
    }
  }
  return result;
};