<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask" @click="onMaskClick" @touchmove="move" @touchend="touchEnd"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from "vuex"
  import Equb from "epubjs"
  import { EBookMixin } from "common/js/mixin"
  import { globalThemeCss } from "common/js/gloubThemeCss"
  import { themeList, flatten } from "common/js/book-font"
  import {
    saveFontFamily,
    getFontFamily,
    saveFontSize,
    getFontSize,
    getTheme,
    saveTheme,
    saveLocation,
    getLocation,
    getBookmark
  } from "common/js/localStorage"
  import { getLocalForage } from "../../common/js/localForage.js"


  export default {
    name: "eBookRead",
    created(){
      this.saveFileName()
    },
    mixins: [EBookMixin],
    computed: {
      themeList() {
        return themeList(this)
      },
      ...mapGetters({
        filename: 'Book/filename',
        defaultFontFamily: "Book/defaultFontFamily",
        currentBook: "Book/currentBook",
        defaultFontSize: "Book/defaultFontSize",
        defaultTheme: "Book/defaultTheme",
        navigation: "Book/navigation",
        pageLists: "Book/pageLists"
      })
    },
    methods: {
      saveFileName(){
        const filename = this.$route.params.filename.split("|")[0]
        const fileNameKey = this.$route.params.filename.split("|")[1]
        /*获取key,通过key来获取本地存储的值*/
        getLocalForage(filename, (err, blob) => {
          if (!err && blob) {
            console.log("存在blob对象")
            this.setFileName(filename).then(() => {
              this.initEqub(blob)
            })
          }else{
            console.log("在线获取电子书")
            this.setFileName(filename).then(() => {
              const ebookUrl = `${process.env.VUE_APP_RES_URL}/equb/${this.filename}.epub`
              this.initEqub(ebookUrl)
            })
          }
        })
      },
      initEqub(ebookUrl) {
        /*  const ebookUrl = `${process.env.VUE_APP_RES_URL}/equb/${this.filename}.epub`*/
        this.book = new Equb(ebookUrl)
        console.log(this.book)
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          methods: 'default'
        })

        this.rendition.display().then(() => {
          /*初始化fontfamily字体*/
          let font = getFontFamily(this.filename)
          if (!font) {
            saveFontFamily(this.filename, this.defaultFontFamily)
          } else {
            this.currentBook.rendition.themes.font(font)
            this.setDefaultFontFamily(font)
          }
          /*初始化fontfamily字号大小*/
          let fontSize = getFontSize(this.filename)
          if (!fontSize) {
            saveFontSize(this.filename, this.defaultFontSize)
          } else {
            this.currentBook.rendition.themes.fontSize(fontSize + 'px')
            this.setFontSize(fontSize)
          }

          /*初始化设置是否存在location*/
          const location = getLocation(this.filename)
          console.log(location)
          if (location) {
            this.display(location)
            this.refreshLocation()
          }
          /*设置主题*/
          let defaultTheme = getTheme(this.filename)
          if (!defaultTheme) {
            defaultTheme = this.themeList[0].name
            saveTheme(this.fileName, defaultTheme)
          }
          this.setDefaultTheme(defaultTheme)
          this.themeList.forEach(theme => {
            this.rendition.themes.register(theme.name, theme.style)
            this.rendition.themes.select(this.defaultTheme)
          })

          /*设置全局主题样式*/
          globalThemeCss(this.defaultTheme)
        })

        this.rendition.on("touchstart", event => {
          this.touchStartX = event.changedTouches[0].pageX;
          this.touchStartTime = event.timeStamp;
        }, {passive: false})
        this.rendition.on("touchend", event => {
          const offsetX = event.changedTouches[0].pageX - this.touchStartX
          const time = event.timeStamp - this.touchStartTime
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()        //disable-eslint-line /*不满足条件时,则显示标题和菜单*/
          }
        }, {passive: false})

        this.setCurrentBook(this.book)
        this.rendition.hooks.content.register(contents => {
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`)
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`)
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        })

        /*设置分页,必须是等书加载完成*/
        this.book.ready.then(() => {
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)).then((locations) => {
            locations.forEach(item => {        /*获取简单的分页信息*/
              const loc = item.match(/\[(.*)\]!/)[1]
              this.navigation.forEach(nav => {
                nav.pagelist = []
              })
              this.navigation.forEach(nav => {
                if (nav.href) {
                  const href = nav.href.match(/^(.*)\.html$/)[1]
                  if (href === loc) {
                    nav.pagelist.push(item)
                  }
                }
              })

              let currentPage = 1
              this.navigation.forEach((nav, index) => {
                if (index === 0) {
                  nav.page = 1
                } else {
                  nav.page = currentPage
                }
                currentPage += nav.pagelist.length + 1
              })
            })
            this.setPageLists(locations)
            /*设置分页的信息*/
            this.setBookAvailable(true)
            this.refreshLocation()
            /*加载完成后显示进度的位置*/
          })
        })

        /*获取图书封面的图片*/
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url)
          })
        })
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })

        this.book.loaded.navigation.then(nav => {
          console.log(nav.toc)
          const navItem = flatten(nav.toc)
          console.log(navItem)
          function find(item, level = 0) {
            if (!item.parent) {
              return level
            } else {
              return find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
            }
          }

          navItem.forEach(item => {
            item.level = find(item)
          })
          this.setNavigation(navItem)
        })
      },
      prevPage() {
        this.rendition.prev()
        this.hideTitleAndMenu()
        setTimeout(() => {
          this.refreshLocation()
        }, 20)
        /*注:这里是有异步问题，否则无法实时更新标题*/
        /*存储当前读取的进度放在location*/
      },
      nextPage() {
        this.rendition.next()
        this.hideTitleAndMenu()
        setTimeout(() => {
          this.refreshLocation()
        }, 20)
        /*存储当前读取的进度放在location*/
        /*注:这里是有异步问题，否则无法实时更新标题*/
      },
      hideTitleAndMenu(){
        if (this.menuVisible) {
          this.setSettingVisible(-1)
          this.setFontFamilyVisible(false)
        }
        this.setMenuVisible(false)
      },
      toggleTitleAndMenu() {
        this.setMenuVisible(!this.menuVisible)
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      },

      refreshLocation() {  /*存储当前读取的进度放在location*/
        const currentLocation = this.currentBook.rendition.currentLocation()
        console.log(currentLocation)
        const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
        const startCfi = currentLocation.start.cfi;
        /*通过第一个字获取当前读取进度*/
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.filename, startCfi)
        const bookmark = getBookmark(this.filename)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setBookMask(true)
          } else {
            this.setBookMask(false)
          }
        } else {
          this.setBookMask(false)
        }
        /* if (this.pageLists) {  //设置分页,由于官方给的算法不是很清晰,所以省略
         const totalPage = this.pageLists.length
         const currentPage = currentLocation.start.location
         if (currentPage && currentPage > 0) {
         this.setP
         }
         }*/
      },
      display(target) {
        if (target) {
          return this.currentBook.rendition.display(target)
        } else {
          return this.currentBook.rendition.display()
        }
      },
      onMaskClick(e) {
        const offsetX = e.offsetX
        const width = window.innerWidth
        if (offsetX > 0 && offsetX < width * 0.3) {
          this.prevPage()
        } else if (offsetX > 0 && offsetX > width * 0.7) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
      },
      move(e) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY
        }
        e.preventDefault()
        /*解决微信端的一些bug*/
        e.stopPropagation()
      },
      touchEnd(e) {   /*偏移量重置*/
        this.setOffsetY(0)
        this.firstOffsetY = 0
      },
      ...mapActions({
        setFileName: 'Book/setFileName',
        setMenuVisible: "Book/setMenuVisible",
        setSettingVisible: "Book/setSettingVisible",
        setCurrentBook: "Book/setCurrentBook",
        setFontFamilyVisible: "Book/setFontFamilyVisible",
        setDefaultFontFamily: "Book/setDefaultFontFamily",
        setFontSize: "Book/setFontSize",
        setDefaultTheme: "Book/setDefaultTheme",
        setBookAvailable: "Book/setBookAvailable",
        setProgress: "Book/setProgress",
        setSection: "Book/setSection",
        setCover: "Book/setCover",
        setMetadata: "Book/setMetadata",
        setNavigation: "Book/setNavigation",
        setOffsetY: "Book/setOffsetY",
        setBookMask: "Book/setBookMask",
        setPageLists: "Book/setPageLists"
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
      z-index: 150;
      width: 100%;
      height: 100%;
    }
  }
</style>
