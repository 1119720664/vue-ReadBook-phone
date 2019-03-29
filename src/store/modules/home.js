import * as types from "./home-types"

const Home = {
  state: {
    hotSearchOffsetY: '', /*首页设置y轴偏移的距离*/
    flapCardVisible: false   /*首页推荐按钮卡片的显示*/
  },
  getters: {
    hotSearchOffsetY: state => state.hotSearchOffsetY,
    flapCardVisible: state => state.flapCardVisible
  },
  actions: {
    setHotSearchOffset: ({commit}, hotSearchOffsetY) => {
      return commit(types.SET_HOTSEARCHOFFSET, hotSearchOffsetY)
    },
    setFlapCardVisible: ({commit}, flapCardVisible) => {
      return commit(types.SET_FLAPCARDVISIBLE, flapCardVisible)
    }
  },
  mutations: {
    [types.SET_HOTSEARCHOFFSET](state, hotSearchOffsetY){
      state.hotSearchOffsetY = hotSearchOffsetY
    },
    [types.SET_FLAPCARDVISIBLE](state, flapCardVisible){
      state.flapCardVisible = flapCardVisible
    }
  }
}


export default {
  namespaced: true,
  ...Home
}

