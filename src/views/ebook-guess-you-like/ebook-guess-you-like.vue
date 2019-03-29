<template>
  <div class="guess-you-like">
    <title-view :label="$t('home.guessYouLike')" :btn="$t('home.change')" @onClick="change"></title-view>
    <div class="guess-you-like-list">
      <div class="guess-you-like-item" v-for="item in showData" :key="Math.random()*100" @click="showBookDetail(item)">
        <div class="img-wrapper">
          <img class="img" :src="item.cover">
        </div>
        <div class="content-wrapper">
          <div class="title title-big" ref="title">{{item.title}}</div>
          <div class="anthor sub-title" ref="anthor">{{item.anthor}}</div>
          <div class="result third-title" ref="result">{{resultText(item)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { realPx } from "common/js/util"
  import TitleView from "../ebook-view-title/ebook-view-title.vue"

  export default {
    name: 'EBookGuessYouLike',
    props: {
      data: Array,
      default: []
    },
    data() {
      return {
        index: 0,
        total: 0
      }
    },
    computed: {
      width() {
        return window.innerWidth - realPx(20) - realPx(60) + 'px'
      },
      showData() {
        if (this.data) {   /*一共有9本书,取的是1,4,7三本,注意这里的算法*/
          return [
            this.data[this.index],
            this.data[this.index + this.total],
            this.data[this.index + this.total * 2]
          ]
        } else {
          return []
        }
      }
    },
    components: {
      TitleView
    },
    methods: {
      change() {
        if (this.index + 1 >= this.total) {
          this.index = 0
        } else {
          this.index++
        }
      },
      resultText(item) {
        if (item && item.type && item.result) {
          console.log(this.$t('home.readPercent'))
          switch (item.type) {
            case 1:
              return this.$t('home.sameAuthor').replace('$1', item.result)    /*$1,表示正则第几次匹配的内容,$2表示第二次匹配的内容*/
            case 2:
              return this.$t('home.sameReader').replace('$1', item.result)
            case 3:
              return this.$t('home.readPercent').replace('$1', item.percent).replace('$2', item.result)
          }
        }
      },
      resize() {
        this.$nextTick(() => {
          this.$refs.title.forEach(item => {
            item.style.width = this.width
          })
          this.$refs.author.forEach(item => {
            item.style.width = this.width
          })
          this.$refs.result.forEach(item => {
            item.style.width = this.width
          })
        })
      },
      showBookDetail(book) {
        this.$router.push({
          path: '/home/detail',
          query: {
            fileName: book.fileName,
            category: book.categoryText
          }
        })
      }
    },
    watch: {
      data(v){
        this.total = v.length / 3
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";

  .guess-you-like {
    .guess-you-like-list {
      width: 100%;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .guess-you-like-item {
        display: flex;
        margin-top: px2rem(15);
        &:first-child {
          margin-top: px2rem(5);
        }
        .img-wrapper {
          flex: 0 0 20%;
          padding: px2rem(10) px2rem(10) px2rem(10) 0;
          box-sizing: border-box;
          .img {
            width: 100%;
          }
        }
        .content-wrapper {
          flex: 1;
          padding: px2rem(10) 0;
          box-sizing: border-box;
          .author {
            margin-top: px2rem(15);
          }
          .result {
            margin-top: px2rem(5);
          }
        }
      }
    }
  }
</style>
