import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { isArray, has, toLower } from 'lodash';
import { parseObjToQuery } from '.';

export function removeAccents(str) {
  //str = removeUnicode(str);
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function convertToSlug(str) {
  const convertStr = str
    .toLowerCase()
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\\{\\}\\[\]\\\\/]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/\\-\\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  return removeAccents(convertStr)
}

export function countWords(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi, '');
  s = s.replace(/[ ]{2,}/gi, ' ');
  s = s.replace(/\n /, '\n');
  return s.split(' ').length;
}

export function getStringWithWord(string, n) {
  let str = '';
  for (let i = 1; i <= n; i++) {
    if (i < n) {
      str += getWord(string, i) + ' ';
    } else {
      str += getWord(string, i);
    }
  }
  return str;
}

export function getWord(string, n) {
  var words = string.split(' ');
  return words[n - 1];
}

export function removeUnicode(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}

export function getFileIdFromDriveUrl(url) {
  const match = url?.match(/([a-z0-9_-]{25,})[$/&?]/i);
  return match ? match[1] : null;
}

const REGEX = /(^|[\s`~!@#$%^&+\-*=_()[\]{};:'"\\|,<.>/?])[^\s`~!@#$%^&+\-*=_()[\]{};:'"\\|,<.>/?]/g;
export function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.toLowerCase().replace(REGEX, match => match.toUpperCase());
}

// eslint-disable-next-line
const REGEX_QUERY = /(\?|\&)([^=]+)\=([^&]+)/g
export function renderLinks(str, preLink = "#", separator = ',', matchStr, mapLinkByKeys, key, isBlank = true, queryParams) {
  try {
    if (isArray(str)) {
      str = str.join(',')
    }
    if (isArray(matchStr)) {
      matchStr = matchStr.join(',')
    }
    const vIds = !!str ? str.split(',') : []
    const matchIds = !!matchStr ? matchStr.split(',') : undefined
    return vIds.map((it, idx) => {
      const link = isArray(preLink) ? (
        !!mapLinkByKeys && !!key ? (
          has(mapLinkByKeys, preLink?.[idx]?.[key]) ? mapLinkByKeys?.[preLink?.[idx]?.[key]] : []
        ) : preLink[idx]
      ) : preLink
      const checkParamsExist = it.search(REGEX_QUERY)
      return (
        <Fragment key={idx}>
          <Link
            to={{
              pathname: checkParamsExist !== -1 ? `${link}${it}${queryParams ? parseObjToQuery(queryParams) : ''}` : `${link}/${it}${queryParams ? parseObjToQuery(queryParams) : ''}`,
              search: isBlank ? `${queryParams ? '&' : '?'}target=_blank` : ''
            }}
            target={isBlank ? "_blank" : undefined}
          >
            {!!matchIds ? matchIds[idx] : it}
          </Link>
          {idx < vIds.length - 1 && `${separator}`}
        </Fragment>
      )
    })
  } catch (err) {
    console.log("err: ", err)
  }
}
export function pickLastCharOfWord(string, numberChar = 2) {
  if (!string) return '';
  let result = ''
  const count = countWords(string)
  if (count === 1) {
    result += string?.[0]
  } else {
    for (let i = numberChar; i >= 0; i--) {
      const char = getWord(string, count - (i - 1))?.[0]?.replace(/[`~!@#$%^*()_|+\-=?;:'",.<>]/gi, '') ?? ''
      result += char
    }
  }
  return result
}


export function copyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
}
export const renderSearchText = (value, searchValue, className = 'font-weight-bold') => {
  if (!searchValue) return value;

  const formatValue = removeUnicode(toLower(value));
  const formatSearchValue = removeUnicode(toLower(searchValue));
  const idx = formatValue.indexOf(formatSearchValue);

  if (idx !== -1) {
    const matchText = value.slice(idx, searchValue.length + idx);
    return value.replace(new RegExp(matchText, "gi"), `<span class="${className}">${matchText}</span>`);
  }
  
  return value;
};

export const htmlDecode = (content) => {
  let e = document.createElement('div');
  e.innerHTML = content;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

export function uuid(length = 6) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}