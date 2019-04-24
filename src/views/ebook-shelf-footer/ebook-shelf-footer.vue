<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div class="shelf-footer-tab-wrapper" v-for="item in tabs" :key="item.index" @click="onTabClick(item)"
         :class="{'is-selected':isSelected}">
      <div class="shelf-footer-tab" :class="{'is-selected':isSelected}">
        <div class="icon-private tab-icon" v-if="item.index===1&&!isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index===1&&isPrivate"></div>
        <div class="icon-download tab-icon" v-if="item.index===2&&!isDownload"></div>
        <div class="icon-download-remove tab-icon" v-if="item.index===2&&isDownload"></div>
        <div class="icon-move tab-icon" v-if="item.index===3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index===4"></div>
        <div class="tab-text" :class="{'remove-text':item.index===4}">{{labelText(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from "vuex"
  import { download } from "../../api"
  import { saveBookShelf, removeLocalStorage } from "common/js/localStorage"
  import { removeLocalForage } from "common/js/localForage"

  export default{
    name: 'EBookShelfFooter',
    data() {
      return {
        popupMenu: null
      }
    },
    computed: {
      isSelected(){
        return this.shelfSelected && this.shelfSelected.length > 0
      },
      isPrivate() {    /*判断当前选中的书籍是否是私密阅读*/
        if (!this.isSelected) {
          return false
        } else {   /*必须是每一本书都是私密阅读才可以切换ebook-shelf-footer的图标,这里使用every遍历*/
          return this.shelfSelected.every(item => item.private)
        }
      },
      isDownload() {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => {
            if (item.selected) {
              return item.cache
            } else {
              return true
            }
          })
        }
      },
      tabs() {
        return [
          {
            label: this.$t("shelf.private"),
            label2: this.$t("shelf.noPrivate"),
            index: 1
          }, {
            label: this.$t("shelf.download"),
            label2: this.$t("shelf.delete"),
            index: 2
          }, {
            label: this.$t("shelf.move"),
            index: 3
          }, {
            label: this.$t("shelf.remove"),
            index: 4
          }
        ]
      },
      ...mapGetters({
        isEditMode: "Home/isEditMode",
        shelfSelected: "Home/shelfSelected",
        shelfList: "Home/shelfList"
      })
    },
    methods: {
      hidePopup(){
        this.popupMenu.hide()
      },
      showPrivate(){
        this.popupMenu = this.$createPopup({
          $props: {
            title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
            btn: [
              {
                text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
                click: () => {
                  this.setPrivate()
                }
              },
              {
                text: this.$t('shelf.cancel'),
                click: () => {
                  this.hidePopup()
                }
              }
            ]
          }
        })
        this.popupMenu.show()
      },
      showDownLoad() {
        this.popupMenu = this.$createPopup({
          $props: {
            title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
            btn: [
              {
                text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
                click: () => {
                  this.setDownload()
                }
              },
              {
                text: this.$t('shelf.cancel'),
                click: () => {
                  this.hidePopup()
                }
              }
            ]
          }
        })
        this.popupMenu.show()
      },
      showRemove() {
        let title
        /*创建这个变量的意思就是选取一本书和多本书的提示信息是不一样的*/
        if (this.shelfSelected.length === 1) {
          title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
        } else {
          title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
        }
        this.popupMenu = this.$createPopup({
          $props: {
            title: title,
            btn: [
              {
                text: this.$t('shelf.removeBook'),
                type: 'danger',
                click: () => {
                  this.removeSelected()
                }
              },
              {
                text: this.$t('shelf.cancel'),
                click: () => {
                  this.hidePopup()
                }
              }
            ]
          }
        })
        this.popupMenu.show()
      },
      setPrivate() {
        let isPrivate
        if (this.isPrivate) {  /*调用isPrivate计算属性*/
          isPrivate = false
        } else {
          isPrivate = true
        }
        this.shelfSelected.forEach(book => {
          book.private = isPrivate
          /*给选中的图书调价属性*/
        })
        this.hidePopup()
        this.setIsEditMode(false)
        saveBookShelf(this.shelfList)
        /*关闭编辑模式*/
        /*用弹窗组件显示提示*/
        if (isPrivate) {
          this.$createToast({text: this.$t('shelf.setPrivateSuccess')}).show()
        } else {
          let text = ''
          const toast = this.$createToast({text})
          toast.show()
          /*注意这里的用法*/
          text = this.$t('shelf.closePrivateSuccess')
          toast.updateText(text)
        }
      },
      async setDownload() {
        let isDownload
        if (this.isDownload) {  /*调用isDownload计算属性*/
          isDownload = false
        } else {
          isDownload = true
        }
        /*下载图书*/
        this.hidePopup()
        this.setIsEditMode(false)
        /*保存在本地存储文件中*/
        /*关闭编辑模式*/
        /*用弹窗组件显示提示*/
        if (this.isDownload) {
          this.removeSelectedBook()
          /*删除离线缓存的功能*/
        } else {
          await this.downloadSelectedBook()
          saveBookShelf(this.shelfList)
          this.$createToast({text: this.$t('shelf.setDownloadSuccess')}).show()
        }
      },
      removeSelected() {      /*移出所选中的书籍*/
        this.shelfSelected.forEach(selected => {   /*从书架中移出选中的书籍*/
          this.setShelfList(this.shelfList.filter(book => book !== selected))
        })
        this.setShelfSelected([])
        /*把所选中的书籍还原成空数组*/
        this.hidePopup()
        this.setIsEditMode(false)
        saveBookShelf(this.shelfList)
        /*把所有的图书都保存起来*/
      },
      async downloadSelectedBook() {   /*使用async,await解决下载过程中弹框关闭的问题*/
        for (let i = 0; i < this.shelfSelected.length; i++) {
          await this.downloadBook(this.shelfSelected[i]).then((book) => {   /*下载完后进行处理*/
            //book.cache = true
            this.shelfSelected.forEach(book => {    /*给选中的图书调价属性*/
              book.cache = true
            })
            this.setShelfSelected(this.shelfSelected)
          })
        }
      },
      downloadBook(book) {   /*电子书下载的方法*/
        let text = ''
        this.toast = this.$createToast({
          $props: {
            text
          }
        })
        this.toast.continueShow()
        return new Promise((resolve, reject) => {
          download(book, (book) => {
            this.toast.remove()
            /*hide换成remove的方法，解决组件更新机制的问题,组件没有被销毁,在显示出来后文本的内容是空白,所以销毁，remove是vue-create-api提供的*/
            console.log("下载完毕")
            resolve(book)
          }, reject, progressEvent => {
            const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + "%"
            const text = this.$t("shelf.progressDownload").replace("$1", `${book.fileName}.epub(${progress})`)
            this.toast.updateText(text)
          })
        })
      },
      labelText(item){    /*修改所对应的文字*/
        switch (item.index) {
          case 1:
            return this.isPrivate ? item.label2 : item.label
          case 2:
            return this.isDownload ? item.label2 : item.label
          default:
            return item.label
        }
      },
      removeBook(book){   /*删除indexDB缓存和本地存储*/
        return new Promise((resolve, reject) => {
          removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
          removeLocalForage(`${book.fileName}`)
          resolve(book)
        })
      },
      removeSelectedBook() {
        Promise.all(this.shelfSelected.map(book => this.removeBook(book))).then(books => {   /*移出所有的电子书*/
          books.map(book => {
            book.cache = false
          })
          this.setShelfSelected(this.shelfSelected)   /*把修改的数据再次保存在vuex中*/
          saveBookShelf(this.shelfList)
          const toast = this.$createToast({text: ''})
          toast.show()
          toast.updateText(this.$t('shelf.removeDownloadSuccess'))
        })
      },
      showDialogGroup(){
        this.$createToast({text: this.$t('shelf.clearCacheSuccess')}).show()
          this.$createDialog().show()
      },
      onTabClick(item){
        /* if (!this.isSelected) {
         return
         }*/
        switch (item.index) {
          case 1:
            this.showPrivate()
            break
          case 2:
            this.showDownLoad()
            break
          case 3:
            this.showDialogGroup()
            break
          case 4:
            this.showRemove()
            break
          default:
            break
        }
      },
      ...mapActions({
        setIsEditMode: "Home/setIsEditMode",
        setShelfList: "Home/setShelfList",
        setShelfSelected: "Home/setShelfSelected"
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: #fff;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, 0.1);
    .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        opacity: 0.5;
        @include columnCenter;
        &.is-selected {
          opacity: 1
        }
        .tab-icon {
          font-size: px2rem(20);
          color: #666;
        }
        .tab-text {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          color: #666;
          &.remove-text {
            color: $color-pink
          }
        }
        .icon-shelf {
          color: $color-pink
        }
      }
    }
  }
</style>
