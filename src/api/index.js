import axios from "axios"
import { setLocalForage } from "common/js/localForage"

export function home() {
  return axios.get(`${process.env.VUE_APP_BASE_URL}/book/home`)
}

export function detail(book) {
  return axios.get(`${process.env.VUE_APP_BOOK_URL}/book/detail`, {params: {fileName: book.fileName}})
}

export function list() {
  return axios.get(`${process.env.VUE_APP_BOOK_URL}/book/list`)
}

export function shelf() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

export function download(book, onSuccess, onError, onProgress) {
  if (!onProgress) {
    onProgress = onError
    onError = null
  }
  return axios.create({
    /*注意这里的axios的用法*/
    baseURL: process.env.VUE_APP_EPUB_OPF_URL,
    method: "get",
    responseType: 'blob', /*下载电子书的类型*/
    timeout: 180 * 1000,
    onDownloadProgress: progressEvent => {   /*axios里包含的onDownloadProgress属性*/
      if (onProgress) onProgress(progressEvent)
    }
  }).get(`/${book.fileName}.epub`)     /*这里需要设置电子书的下载分类,因为项目资源问题没有设置分页,所以舍去`${book.categoryText}`*/
    .then(response => {
      const blob = new Blob([response.data])
      setLocalForage(book.fileName, blob, () => {
        if (onSuccess) onSuccess(response)
      }, err => {
        if (onError) onError(err)
      })
    }).catch(err => {
      if (onError) onError(err)
    })
}


