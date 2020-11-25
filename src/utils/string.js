/* eslint-disable */

import { toLower as _toLower } from 'lodash'

export function replaceVietnameseStr(alias) {
  var str = alias
  str = _toLower(str)
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' '
  )
  str = str.replace(/ + /g, ' ')
  str = str.trim()
  return str
}

export function isJsonString(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export function deepParseJson(jsonString) {
  // if not stringified json rather a simple string value then JSON.parse will throw error
  // otherwise continue recursion
  if (typeof jsonString === 'string') {
    try {
      return deepParseJson(JSON.parse(jsonString))
    } catch (err) {
      return jsonString
    }
  } else if (Array.isArray(jsonString)) {
    // if an array is received, map over the array and deepParse each value
    return jsonString.map(val => deepParseJson(val))
  } else if (typeof jsonString === 'object' && jsonString !== null) {
    // if an object is received then deepParse each element in the object
    // typeof null returns 'object' too, so we have to eliminate that
    return Object.keys(jsonString).reduce((obj, key) => {
      obj[key] = deepParseJson(jsonString[key])
      return obj
    }, {})
  } else {
    // otherwise return whatever was received
    return jsonString
  }
}

export function removeSpecialCharacterUploadFile(fileName) {
  return fileName.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '')
}

export function isContainSpecialCharacter(str) {
  const format = /[`!@#$%^&*+\=\[\]{};':"\\|,<>\/?~]/;
  return format.test(str)
}
