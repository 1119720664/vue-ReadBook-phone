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
  import { themeList } from "common/js/book-font"
  import {
    saveFontFamily,
    getFontFamily,
    saveFontSize,
    getFontSize,
    getTheme,
    saveTheme,
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
          })
        })
      },
      prevPage() {
        this.rendition.prev()
        this.hideTitleAndMenu()
      },
      nextPage() {
        this.rendition.next()
        this.hideTitleAndMenu()
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
      ...mapActions({
        setFileName: 'Book/setFileName',
        setMenuVisible: "Book/setMenuVisible",
        setSettingVisible: "Book/setSettingVisible",
        setCurrentBook: "Book/setCurrentBook",
        setFontFamilyVisible: "Book/setFontFamilyVisible",
        setDefaultFontFamily: "Book/setDefaultFontFamily",
        setFontSize: "Book/setFontSize",
        setDefaultTheme: "Book/setDefaultTheme",
        setBookAvailable: "Book/setBookAvailable"
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
