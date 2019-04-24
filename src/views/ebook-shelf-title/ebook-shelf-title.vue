<template>
  <transition name="fade">
    <div class="shelf-title" :class="{'hide-shadow':ifHideShadow}" v-show="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="!ifShowBack" @click="clearCache">
        <span class="shelf-title-btn-text">{{$t('shelf.clearCache')}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right">
        <span class="shelf-title-btn-text"
              @click="onEditClick">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}
        </span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="ifShowBack" @click="back()">
        <span class="icon-back"
              @click="clearCache">{{$t('shelf.clearCache')}}
        </span>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from "vuex"
  import { shelf } from "../../api"
  import { addendAddToShelf } from "common/js/util"
  import { getBookShelf, saveBookShelf } from "common/js/localStorage"
  import { clearLocalStorage } from "../../common/js/localStorage"
  import { clearLocalForage } from "../../common/js/localForage"

  export default {
    name: 'EBookShelfTitle',
    props: {
      title: {
        type: String,
      },
      ifShowBack: {
        /*返回按钮显示的状态*/
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        ifHideShadow: true /*阴影隐藏是否开启*/
      }
    },
    computed: {
      selectedText() {
        const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
        return selectedNumber <= 0 ? this.$t('shelf.selectBook') : selectedNumber === 1
          ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) :
          this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber)
      },
      ...mapGetters({
        isEditMode: "Home/isEditMode",
        shelfSelected: "Home/shelfSelected",
        shelfTitleVisible: "Home/shelfTitleVisible",
        offsetY: "Book/offsetY",
        shelfList: "Home/shelfList"
      })
    },
    methods: {
      onEditClick() {
        if (!this.isEditMode) {  /*当不是编辑的状态下,把所有的选中的都还原*/
          this.setShelfSelected([])
          this.shelfList.forEach(item => {
            item.selected = false
            if (item.itemList) {
              item.itemList.forEach(subItem => {
                subItem.selected = false
              })
            }
          })
        }
        this.setIsEditMode(!this.isEditMode)
      },

      clearCache() {    /*清楚本地所有缓存的图书,书架,选中的图书都要清除*/
        clearLocalStorage()
        clearLocalForage()
        this.setShelfList([])
        this.setShelfSelected([])
        this.getAllBooks()
        this.toast = this.$createToast({text: this.$t('shelf.clearCacheSuccess')})
        this.number = 1500
        /*弹框默认显示的毫秒数*/
        this.toast.show()
        setTimeout(() => {
          this.toast.remove()
          /*销毁弹框,不然显示的层级有问题*/
        }, this.number)
      },
      getAllBooks() {
        shelf().then(res => {
          if (res.status === 200 && res.data) {
            if (this.shelfList && this.shelfList.length === 0) {  /**/
              // this.shelfList = addendAddToShelf(res.data.guessYouLike)
              /*从接口获取的数据保存到本地存储中*/
              saveBookShelf(res.data.guessYouLike)
            }
            this.setShelfList(addendAddToShelf(res.data.guessYouLike))
          }
        })
      },
      back() {
        this.$router.go(-1)
      },
      ...mapActions({
        setIsEditMode: "Home/setIsEditMode",
        setShelfSelected: "Home/setShelfSelected",
        setShelfList: "Home/setShelfList"
      })
    },
    watch: {
      offsetY(newVal){
        if (newVal > 0) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";
  @import "~common/styles/transition.scss";

  .shelf-title {
    position: relative;
    z-index: 130;
    width: 100%;
    height: px2rem(42);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
    &.hide-shadow {
      box-shadow: none;
    }
    &-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;
      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
      .shelf-title-sub-text {
        font-size: px2rem(10);
        color: #333
      }
    }
    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      height: 100%;
      box-sizing: border-box;
      @include center;
      .shelf-title-btn-text {
        font-size: px2rem(14);
        color: #666;
      }
      .icon-back {
        font-size: px2rem(12);
        color: #666
      }
    }
    .shelf-title-left {
      left: 0;
      padding-left: px2rem(15);
    }
    .shelf-title-right {
      right: 0;
      padding-right: px2rem(15);
    }
  }
</style>
