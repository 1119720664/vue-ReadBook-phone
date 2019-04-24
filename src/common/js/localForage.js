import localForage from 'localforage'
/*游览器端关系型数据库indexDB*/

export function setLocalForage(key, data, cb, cb2) {
  localForage.setItem(key, data).then((value) => {
    if (cb) cb(value)
  }).catch(function (err) {
    if (cb2) cb2(err)
  })
}

export function getLocalForage(key, cb) {
  localForage.getItem(key, (err, value) => {
    cb(err, value)
  })
}

export function removeLocalForage(key, cb, cb2) {
  localForage.removeItem(key).then(function () {
    cb && cb()
  }).catch(function (err) {
    cb2 && cb2(err)
  })
}

export function clearLocalForage(cb, cb2) {
  localForage.clear().then(function () {
    cb && cb()
  }).catch(function (err) {
    cb2 && cb2(err)
  })
}

export function lengthLocalForage(cb) {   /*数据长度的遍历*/
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
      console.log(numberOfKeys)
    }).catch(function (err) {
    console.log(err)
  })
}

export function iteratorLocalForage() {  /*整个数据的遍历(key,value)*/
  localForage.iterate(function (value, key, iterationNumber) {
    console.log([key, value])
  }).then(function () {
    console.log('Iteration has completed')
  }).catch(function (err) {
    console.log(err)
  })
}

export function support() {   /*判断是不是关系型数据库indexedDB*/
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
