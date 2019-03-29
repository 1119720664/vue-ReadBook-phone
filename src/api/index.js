import axios from "axios"

export function home() {
  return axios.get(`${process.env.VUE_APP_BASE_URL}/book/home`)
}

export function detail(book) {
  return axios.get(`${process.env.VUE_APP_BOOK_URL}/book/detail`, {params: {fileName: book.fileName}})
}

export function list() {
  return axios.get(`${process.env.VUE_APP_BOOK_URL}/book/list`)
}
