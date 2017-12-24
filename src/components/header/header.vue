<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}} / {{seller.deliveryTime}}分钟送达</div>
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span><span class="text">{{seller.supports[0].description}}</span>
        </div>
        
      </div>
      <div class="support-count" @click="showDetails">
        <span v-if="seller.supports" class="count">{{seller.supports.length}}个</span>
        <span class="icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="bulletin" @click="showDetails">
      <span class="icon"></span><span class="text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%"/>
    </div>
    <transition name="fade">
    <div class="detail" v-show="showDetail" >
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
         <div class="name">{{seller.name}}</div>
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul class="supports">
            <li class="supports-item" v-for="item in seller.supports">
              <span class="icon" :class="classMap[item.type]"></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
           <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletins">
            <p class="text">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <i class="icon-close"></i>
      </div>
    </div>
    </transition>
    
  </div>
</template>
<script>
import star from '../star/star.vue'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data(){
    return {
      showDetail:false
    };
  },
  methods:{
    showDetails(){
      this.showDetail = true;
    },
    hideDetail(){
      this.showDetail = false;
    }
  },
  created() {
    this.classMap=["decrease","discount","special","invoice","guarantee"]
  },
  components:{
    star
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin";
  .header
    color:#fff
    overflow:hidden
    position:relative
    background-color:rgba(7,17,27,0.5)
    .content-wrapper
      padding:24px 12px 18px 24px
      font-size:0px
      position:relative
    .avatar
      display:inline-block
      vertical-align:top
    .content
      display:inline-block
      font-size:14px
      margin-left:16px
     
      .title
        margin:2px 0 8px 0
        .brand
          display:inline-block
          width:30px
          height:18px
          vertical-align:top
          bg-image("brand")
          background-size:30px 18px
          background-repeat:no-repeat
        .name
          font-size:16px
          color:rgb(255,255,255)
          font-weight:bold
          line-height:18px
          margin-left:8px
      .description
        font-size:12px
        font-weight:200
        line-height:12px
        margin-bottom:10px
      .supports
        .icon
          display:inline-block
          width:12px
          height:12px
          vertical-align:middle
          background-size:12px 12px
          background-repeat:no-repeat
          margin-right:4px
          &.decrease
            bg-image("decrease_1")
          &.discount
            bg-image("discount_1")
          &.guarantee
            bg-image("guarantee_1")
          &.invoice
            bg-image("invoice_1")
          &.special
            bg-image("special_1")
        .text
          line-height:12px
          font-size:10px
          font-weight:200
          display:inline-block
    .support-count
      position:absolute
      bottom:14px
      right:12px
      padding:0 8px
      background-color:rgba(0,0,0,0.2)
      border-radius:14px
      height:24px
     
      text-align:center
      .count
        font-size:10px
        vertical-align:top
        font-weight:200
        line-height:24px
        //  line-height:12px
      .icon-keyboard_arrow_right
        margin-left:2px   
        font-size:10px
        line-height:24px
    .bulletin
      height:28px;
      padding:0 22px 0 12px
      line-height:28px
      white-space:nowrap
      overflow:hidden
      text-overflow:ellipsis
      position:relative
      background-color:rgba(7,17,27,0.2)
      .icon
        display:inline-block
        width:22px
        height:12px
        bg-image("bulletin")
        background-size:22px 12px
        background-repeat:no-repeat
        vertical-align:top
        margin-top:7px
      .text
        font-size:10px
        font-weight:200
        line-height:28px
        vertical-align:top
        margin:0 4px
      .icon-keyboard_arrow_right
        position:absolute
        top:7px
        right:12px
    .background
      width:100%
      height:100%
      position:absolute
      top:0
      left:0
      z-index:-1
      filter:blur(10px)
    .detail
      position:fixed
      top:0
      left:0
      z-index:100
      width:100%
      height:100%
      overflow:auto
      backdrop-filter:blur(10px)
      transition:all 0.5s
      background:rgba(7,17,27,0.8)
      opacity:1
      &.fade-enter, &.fade-leave-to 
        opacity:0
        background:rgba(7,17,27,0)  
      .detail-wrapper
        width:100%
        min-height:100%
        .detail-main
          margin-top:64px
          padding-bottom:64px
          .name
            font-size:16px
            font-weight:700
            line-height:16px
            text-align:center
          .star-wrapper
            margin-top:18px
            padding:2px 0
            text-align:center
          .title
            display:flex
            width:80%
            margin:28px auto 24px auto
            .line
              flex:1
              border-bottom:1px solid rgba(255,255,255,0.2)
              position:relative
              top:-6px
            .text
              padding:0 12px
              font-size:14px
              font-weight:700
          .supports
            width:80%
            margin:0 auto
            font-size:0
            .supports-item
              padding:0 12px
              margin-bottom:12px
              &:last-child
                margin-bottom:0
              .icon
                width:16px
                height:16px
                display:inline-block
                background-size:16px 16px
                background-repeat:no-repeat
                margin-right:6px
                vertical-align:top
                &.decrease
                  bg-image("decrease_2")
                &.discount
                  bg-image("discount_2")
                &.guarantee
                  bg-image("guarantee_2")
                &.invoice
                  bg-image("invoice_2")
                &.special
                  bg-image("special_2")
              .text
                font-size:12px
                font-weight:200
                line-height:16px
          .bulletins
            width:80%
            margin:0 auto
            .text
              padding:12px
              font-size:12px
              font-weight:200
              line-height:24px
      .detail-close
        position:relative
        width:32px
        height:32px
        margin:-64px auto 0 auto
        font-size:32px
</style>

