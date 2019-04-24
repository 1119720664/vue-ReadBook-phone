import * as types from "./home-types"

const Home = {
  state: {
    hotSearchOffsetY: '', /*首页设置y轴偏移的距离*/
    flapCardVisible: false, /*首页推荐按钮卡片的显示*/
    isEditMode: false, /*是否进入编辑模式*/
    shelfList: [], /*书架图示列表*/
    shelfSelected: [], /*书架图书选中列表,可以是多本*/
    shelfTitleVisible: true, /*书架标题的显示状态*/
    shelfCategory: [], /*表示category书架分类列表的数据*/
    currentType: 1, /*表示选中长状态,书架列表为1,书架分类的列表为2*/
  },
  getters: {
    hotSearchOffsetY: state => state.hotSearchOffsetY,
    flapCardVisible: state => state.flapCardVisible,
    isEditMode: state => state.isEditMode,
    shelfSelected: state => state.shelfSelected,
    shelfTitleVisible: state => state.shelfTitleVisible,
    shelfList: state => state.shelfList,
    shelfCategory: state => state.shelfCategory,
    currentType: state => state.currentType
  },
  actions: {
    setHotSearchOffset: ({commit}, hotSearchOffsetY) => {
      return commit(types.SET_HOTSEARCHOFFSET, hotSearchOffsetY)
    },
    setFlapCardVisible: ({commit}, flapCardVisible) => {
      return commit(types.SET_FLAPCARDVISIBLE, flapCardVisible)
    },
    setIsEditMode: ({commit}, isEditMode) => {
      return commit(types.SET_ISEDIT_MODE, isEditMode)
    },
    setShelfTitleVisible: ({commit}, shelfTitleVisible) => {
      return commit(types.SET_SHELF_TITLE_VISIBLE, shelfTitleVisible)
    },
    setShelfList: ({commit}, shelfList) => {
      return commit(types.SET_SHELF_LIST, shelfList)
    },
    setShelfSelected: ({commit}, shelfSelected) => {
      return commit(types.SET_SHELF_SELECTED, shelfSelected)
    },
    setShelfCategory: ({commit}, shelfCategory) => {
      return commit(types.SET_SHELF_CATEGORY, shelfCategory)
    },
    setCurrentType: ({commit}, setCurrentType) => {
      return commit(types.SET_CURRENTTYPE, setCurrentType)
    }
  },
  mutations: {
    [types.SET_HOTSEARCHOFFSET](state, hotSearchOffsetY){
      state.hotSearchOffsetY = hotSearchOffsetY
    },
    [types.SET_FLAPCARDVISIBLE](state, flapCardVisible){
      state.flapCardVisible = flapCardVisible
    },
    [types.SET_ISEDIT_MODE](state, isEditMode){
      state.isEditMode = isEditMode
    },
    [types.SET_SHELF_TITLE_VISIBLE](state, shelfTitleVisible){
      state.shelfTitleVisible = shelfTitleVisible
    },
    [types.SET_SHELF_LIST](state, shelfList){
      state.shelfList = shelfList
    },
    [types.SET_SHELF_SELECTED](state, shelfSelected){
      state.shelfSelected = shelfSelected
    },
    [types.SET_CURRENTTYPE](state, currentType){
      state.currentType = currentType
    },
    [types.SET_SHELF_CATEGORY](state, shelfCategory) {
      state.shelfCategory = shelfCategory
    }
  }
}


export default {
  namespaced: true,
  ...Home
}

