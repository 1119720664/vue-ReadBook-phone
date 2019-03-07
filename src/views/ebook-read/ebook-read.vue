<template>
  <div class="ebook-reader">
    <div id="read"></div>
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
    getLocation
  } from "common/js/localStorage"

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
        defaultTheme: "Book/defaultTheme"
      })
    },
    methods: {
      saveFileName(){
        const filename = this.$route.params.filename
        this.setFileName(filename).then(() => {
          this.initEqub()
        })
      },
      initEqub() {
        const ebookUrl = `${process.env.VUE_APP_RES_URL}/equb/${this.filename}.epub`;
        this.book = new Equb(ebookUrl)
        this.rendition = this.book.renderTo("read", {
          width: innerWidth,
          height: innerHeight,
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
        const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
        const startCfi = currentLocation.start.cfi;
        /*通过第一个字获取当前读取进度*/
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi)
      },
      display(target) {
        if (target) {
          return this.currentBook.rendition.display(target)
        } else {
          return this.currentBook.rendition.display()
        }
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
        setNavigation: "Book/setNavigation"
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
