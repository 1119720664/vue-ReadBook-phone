import * as types from "./book-types"
import $ from "lodash"

const Book = {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1,          //-1:不显示,0:字号,2:进度,3:目录
    defaultFontSize: 16,
    currentBook: null,
    defaultFontFamily: "Default",
    fontFamilyVisible: false,
    defaultTheme: "default",
    progress: 0,
    bookAvailable: false,
    section: 0
  },
  getters: {
    filename: state => state.fileName,
    menuVisible: state => state.menuVisible,
    settingVisible: state => state.settingVisible,
    defaultFontSize: state => state.defaultFontSize,
    currentBook: state => state.currentBook,
    defaultFontFamily: state => state.defaultFontFamily,
    fontFamilyVisible: state => state.fontFamilyVisible,
    defaultTheme: state => state.defaultTheme,
    bookAvailable: state => state.bookAvailable,
    progress: state => state.progress,
    section: state => state.section
  },
  actions: {
    setFileName: ({commit}, fileName) => {
      return commit(types.SET_FILENAME, fileName)
    },
    setMenuVisible: ({commit}, menuVisible) => {
      return commit(types.SET_MENUVISIBLE, menuVisible)
    },
    setSettingVisible: ({commit}, settingVisible) => {
      return commit(types.SET_SETTINGVISIBLE, settingVisible)
    },
    setFontSize: ({commit}, defaultFontSize) => {
      return commit(types.SET_DEFAULTFONTSIZE, defaultFontSize)
    },
    setCurrentBook: ({commit}, currentBook) => {
      return commit(types.SET_CURRENTBOOK, currentBook)
    },
    setDefaultFontFamily: ({commit}, defaultFontFamily) => {
      return commit(types.SET_DEFAULTFONTFAMILY, defaultFontFamily)
    },
    setFontFamilyVisible: ({commit}, fontFamilyVisible) => {
      return commit(types.SET_FONTFAMILYVISIBLE, fontFamilyVisible)
    },
    setDefaultTheme: ({commit}, defaultTheme) => {
      return commit(types.SET_DEFAULTTHEME, defaultTheme)
    },
    setProgress: ({commit}, progress) => {
      return commit(types.SET_PROGRESS, progress)
    },
    setBookAvailable: ({commit}, bookAvailable) => {
      return commit(types.SET_BOOKAVAILABLE, bookAvailable)
    },
    setSection: ({commit}, section) => {
      return commit(types.SET_SECTION, section)
    }
  },
  mutations: {
    [types.SET_FILENAME](state, fileName){
      state.fileName = fileName
    },
    [types.SET_MENUVISIBLE](state, menuVisible){
      state.menuVisible = menuVisible
    },
    [types.SET_SETTINGVISIBLE](state, settingVisible){
      state.settingVisible = settingVisible
    },
    [types.SET_DEFAULTFONTSIZE](state, defaultFontSize){
      state.defaultFontSize = defaultFontSize
    },
    [types.SET_CURRENTBOOK](state, currentBook) {
      state.currentBook = currentBook
    },
    [types.SET_DEFAULTFONTFAMILY](state, defaultFontFamily) {
      state.defaultFontFamily = defaultFontFamily
    },
    [types.SET_FONTFAMILYVISIBLE](state, fontFamilyVisible) {
      state.fontFamilyVisible = fontFamilyVisible
    },
    [types.SET_DEFAULTTHEME](state, defaultTheme) {
      state.defaultTheme = defaultTheme
    },
    [types.SET_PROGRESS](state, progress) {
      state.progress = progress
    },
    [types.SET_BOOKAVAILABLE](state, bookAvailable) {
      state.bookAvailable = bookAvailable
    },
    [types.SET_SECTION](state, section) {
      state.section = section
    }
  }
}


export default {
  namespaced: true,
  ...Book
}
