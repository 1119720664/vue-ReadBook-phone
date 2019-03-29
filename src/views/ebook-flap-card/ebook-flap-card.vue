<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation':runFlapCardAnimation}" v-show="runFlapCardAnimation">
      <div class="flap-card" v-for="(item,index) in flapCardList" :key="index" :style="{zIndex:item.zIndex}">
        <div class="flap-card-circle">
          <div class="flap-card-semi-circle flap-card-semi-circle-left" :style="semiCircleStyle(item,'left')"
               ref="left"></div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right" :style="semiCircleStyle(item,'right')"
               ref="right"></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div class="point" :class="{'animation':runPointAnimation}" v-for="(item,index) in pointList" :key="index">
        </div>
      </div>
    </div>
    <div class="book-card" :class="{'animation':runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" v-if="data&&data.cover" :src="data.cover">
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{data ? data.title : ''}}</div>
          <div class="content-author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="content-category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /*.point-wrapper烟花小球DOM结构*/
  import { mapGetters, mapActions } from "vuex"
  import { flapCardList, categoryText } from "common/js/store"

  export default {
    name: "EBookFlapCard",
    props: {
      data: {
        type: Object,
        default(){
          return {}
        }
      }
    },
    created() {
      this.pointList = []
      for (let i = 0; i < 18; i++) {
        this.pointList.push(`point${i}`)
      }
    },
    data(){
      return {
        flapCardList,
        front: 0,
        black: 1,
        runFlapCardAnimation: false, /*烟花动画显示*/
        pointList: null,
        runPointAnimation: false,
        runBookCardAnimation: false
      }
    },
    computed: {
      ...mapGetters({flapCardVisible: "Home/flapCardVisible"})
    },
    methods: {
      close(){
        this.setFlapCardVisible(false)
        this.stopAnimation()
        /*当动画执行过程中关闭时，则需要关闭所有的定时器才可以,否则会有bug出现*/
      },
      semiCircleStyle(item, dir) {
        return {
          backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
          backgroundSize: item.backgroundSize,
          backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
        }
      },
      rotate(index, type){
        const item = this.flapCardList[index]
        let dom;
        if (type === 'front') {
          dom = this.$refs.right[index]
        } else {
          dom = this.$refs.left[index]
        }
        dom.style.transform = `rotateY(${item.rotateDegree}deg)`
        dom.style.backgroundColor = `rgb(${item.r},${item.g},${item.b})`
      },
      flapCardRotate() {
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.black]
        frontFlapCard.rotateDegree += 10
        frontFlapCard.g -= 5
        backFlapCard.rotateDegree -= 10
        if (backFlapCard.rotateDegree < 90) {  /*在翻转时颜色值在变化*/
          backFlapCard.g += 5
        }
        backFlapCard.g += 5
        if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
          backFlapCard.zIndex += 2
        }
        this.rotate(this.front, 'front')
        this.rotate(this.black, 'back')
        if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {  /*当前张的右半部分和翻转180度和下一张选装到0度时*/
          this.next()
        }
      },
      startFlapCardAnimation(){
        this.preppare()
        this.task = setInterval(() => {
          this.flapCardRotate()
        }, 30)
        this.timeout = setTimeout(() => {  /*2500毫秒后卡片隐藏,可以使用v-show,这里是用css中的transform:scale(0)*/
          this.runFlapCardAnimation = false
          /*动画隐藏后,关闭定时器*/
          if (this.task) {
            clearInterval(this.task)
          }
          this.runBookCardAnimation = true
          /*推荐图书动画显示*/
        }, 2500)
      },
      stopAnimation() {
        if (this.task) {
          clearInterval(this.task)
        }
        if(this.timeout){
          clearInterval(this.timeout)
        }
        this.reset()
      },
      preppare() {       /*把下一张的图片的左半部分和右半部分重叠(旋转180度就),切换z-index,在让下一张的图片的左半部分继续翻转，才能实现整个动画的流程*/
        const backFlapCard = this.flapCardList[this.black]
        backFlapCard.rotateDegree = 180
        backFlapCard.g = backFlapCard.g - 5 * 9
        this.rotate(this.black, 'back')
      },
      next() {
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.black]
        frontFlapCard.rotateDegree = 0
        backFlapCard.rotateDegree = 0
        this.rotate(this.front, 'front')
        this.rotate(this.black, 'back')
        this.front++
        this.black++
        const len = this.flapCardList.length
        if (this.front >= len) {
          this.front = 0
        }
        if (this.black >= len) {
          this.black = 0
        }
        //zIndex算法
        //100 -> 96
        //98 -> 100
        //97 -> 99
        //96 -> 98
        //95 -> 97
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - ((index - this.front + len) % len)
        })
        this.preppare()
        /*最后在实现一次preppare*/
      },
      reset() {   /*把所有的属性都还原*/
        this.front = 0
        this.black = 1
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - index
          item.g = item._g
          item.rotateDegree = 0;
          this.rotate(index, 'front')
          this.rotate(index, 'black')
        })
        this.runBookCardAnimation = false
        /*吧所有的动画显示状态还原成隐藏的状态*/
        this.runFlapCardAnimation = false;
        this.runPointAnimation = false
      },
      startPointAnimation() {
        this.runPointAnimation = true
        setTimeout(() => {   /*750毫秒后小球动画结束*/
          this.runPointAnimation = false
        }, 750)
      },
      showBookDetail(){

      },
      categoryText(){
        if (this.data) {
          return categoryText(this.data.category, this)
        } else {
          return ''
        }
      },
      ...mapActions({
        setFlapCardVisible: "Home/setFlapCardVisible"
      })
    },
    watch: {
      flapCardVisible(v) {
        if (v) {
          this.runFlapCardAnimation = true
          setTimeout(() => {  /*动画完成以后300毫秒再执行卡片翻转动画*/
            this.startPointAnimation()
            this.startFlapCardAnimation()
          }, 300)
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/styles/global.scss";
  @import "~common/styles/flapCard.scss";

  .flap-card-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    @include center;
    .flap-card-bg {
      position: relative;
      width: px2rem(64);
      height: px2rem(64);
      border-radius: px2rem(5);
      background: white;
      transform: scale(0); /*默认值是0,不显示*/
      opacity: 0;
      &.animation {
        animation: flap-card-move 0.3s ease-in both;
      }
      @keyframes flap-card-move {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
        75% {
          transform: scale(0.9);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .flap-card {
        width: px2rem(48);
        height: px2rem(48);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        .flap-card-circle {
          display: flex;
          width: 100%;
          height: 100%;
          .flap-card-semi-circle {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            backface-visibility: hidden;
          }
          .flap-card-semi-circle-left {
            border-radius: px2rem(24) 0 0 px2rem(24);
            background-position: center right;
            transform-origin: right;
          }
          .flap-card-semi-circle-right {
            border-radius: 0 px2rem(24) px2rem(24) 0;
            background-position: center left;
            transform-origin: left;
          }
        }
      }
      .point-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 1500;
        .point {
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          &.animation {
            @for $i from 1 to length($moves) {
              &:nth-child(#{$i}) {
                @include move($i);
              }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      max-width: px2rem(400);
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale 0.3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
      }
      .content-wrapper {
        padding: 0 px2rem(20);
        margin-top: px2rem(20);
        .content-title {
          color: #333;
          font-weight: bold;
          font-size: px2rem(18);
          line-height: px2rem(20);
          max-height: px2rem(40);
          text-align: center;
          @include ellipsis2(2)
        }
        .content-author {
          margin-top: px2rem(10);
          text-align: center;
        }
        .content-category {
          color: #999;
          font-size: px2rem(14);
          margin-top: px2rem(10);
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 500;
        width: 100%;
        border-radius: 0 0 px2rem(15) px2rem(15);
        text-align: center;
        color: white;
        font-size: px2rem(28);
        background: $color-blue;
      }
    }
    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      z-index: 400;
      width: 100%;
      @include center;
      .icon-close {
        width: px2rem(45);
        height: px2rem(45);
        font-size: px2rem(25);
        border-radius: 50%;
        background: #333;
        color: white;
        @include center;
      }
    }
  }
</style>
