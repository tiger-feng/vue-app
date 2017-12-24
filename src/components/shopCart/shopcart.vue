<template>
<div class="shopCart">
    <div class="content"  @click="toggleList">
    <div class="content-left">
        <div class="logo">
            <div class="icon" :class="{'highlight':totalCount>0}">
                <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
    </div>
    <div class="content-right" @click.stop.prevent="pay()">
        <div class="pay" :class="payClass">{{payDesc}}</div>
    </div>
    </div>
    <div class="ball-container" >
        <div v-for="ball in balls">
          <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
    </div>
    <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="listContent">
                <ul>
                    <li class="food" v-for="food in selectFoods">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <span>￥{{food.price*food.count}}</span>
                        </div>
                        <div class="cartcontrol-wrapper">
                            <cartcontrol :food="food"></cartcontrol>
                        </div>
                    </li>
                </ul>
            </div>
    </div>
    </transition>
   
   <transition name="hide">
    <div class="fold-mask" v-show="listShow" @click="hideList"></div>
</transition>
</div>

</template>
<script type="text/ecmascript-6">
import cartcontrol from "../cartcontrol/cartcontrol"
import BScroll from "better-scroll";
export default{
props:{
    selectFoods:{
        type:Array,
        default(){
            return [];
        }
    },
    deliveryPrice:{
        type: Number,
        default:0
    },
    minPrice:{
        type:Number,
        default:0
    }
},
data() {
    return {
        balls:[
            {show:false},
            {show:false},
            {show:false},
            {show:false},
            {show:false}
        ],
        dropBalls:[],
        fold:true
    }
},
computed:{
    totalPrice(){
        let total=0;
        this.selectFoods.forEach((food)=>{
            total+=food.price*food.count;
        })
        return total;
    },
    totalCount(){
        let count = 0;
          this.selectFoods.forEach((food)=>{
              count+=food.count;
          })
          return count;
    },
    payDesc(){
        if(this.totalPrice === 0){
            return `￥${this.minPrice}起送`;
        }else if(this.totalPrice<this.minPrice){
            let diff = this.minPrice-this.totalPrice;
            return `还差${diff}元起送`;
        }else{
            return `去结算`;
        }
    },
    payClass(){
        if(this.totalPrice<this.minPrice){
            return 'not-enough';
        }else{
            return 'enough';
        }
    },
     listShow(){
        if(!this.totalCount){
            this.fold=true;
            return false;
        }
        let show = !this.fold;
        if(show){
            this.$nextTick(()=>{
                if(!this.scroll){
                    this.scroll = new BScroll(this.$refs.listContent,{click:true})
                }else{
                    this.scroll.refresh();
                }
            })
        }
        return show;
        
    },
},
methods:{
    drop(el){
        for(let i=0;i<this.balls.length;i++){
            let ball =this.balls[i];
            if(!ball.show){
                ball.show=true;
                ball.el=el;
                this.dropBalls.push(ball);
                return;
            }
        }
    },
    toggleList(){
        if(!this.totalCount){
            return;
        }
        this.fold = !this.fold;
    },
    beforeEnter(el) {
        let count =this.balls.length;
        while(count--){
            let ball = this.balls[count];
            if(ball.show){
                let rect = ball.el.getBoundingClientRect(); 
                let x = rect.left-32;
                let y = -(window.innerHeight-rect.top-22);
                el.style.display="";
                el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                el.style.transform = `translate3d(0,${y}px,0)`;
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                inner.style.transform = `translate3d(${x}px,0,0)`;
            }
        }
    },
  
    enter(el, done) {
        // ...
        let rf = el.offsetHeight;
        this.$nextTick(()=>{
            el.style.webkitTransform = 'translate3d(0,0,0)';
                el.style.transform = 'translate3d(0,0,0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
                el.addEventListener('transitionend', done);
        })
   
    },
    afterEnter(el) {
        // ...
        let ball = this.dropBalls.shift();
        if(ball){
            ball.show= false;
            el.style.display="none";
        }
    },
    empty(){
        this.selectFoods.forEach((food)=>{
            food.count = 0;
        });
    },
    hideList(){
        this.fold = true;
    },
    pay(){
        if(this.totalPrice<this.minPrice){
            return;
        };
        window.alert(`请支付${this.totalPrice}元`);
    }
    
},
components:{
    cartcontrol
}
}


</script>
<style  lang="stylus" rel="stylesheet/stylus">

.shopCart
    position:fixed
    bottom:0
    left:0
    background:#000
    width:100%
    height:48px
    z-index:50
    .content
        display:flex
        background:#141d27
        .content-left
            flex:1
            .logo
                display:inline-block
                position:relative
                top:-10px
                margin:0 12px
                padding:6px
                width:56px
                height:56px
                box-sizing:border-box
                vertical-align:top
                border-radius:50%
                background:#141d27
                
                .num
                    position:absolute
                    right:0
                    top:0
                    width:24px
                    height:16px
                    line-height:16px
                    text-align:center
                    border-radius:16px
                    font-size:9px
                    font-weight:700
                    color:#fff
                    background:rgb(240,20,20)
                    box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
                .icon
                    width:100%
                    height:100%
                    border-radius:50%
                    background:#2b343c
                    text-align:center
                    &.highlight
                        background:rgb(0,160,220)
                    .icon-shopping_cart
                        line-height:44px
                        font-size:24px
                        color:#80858a
                        &.highlight
                            color:#fff

            .price
                display:inline-block
                vertical-align:top
                margin-top:12px
                line-height:24px
                padding-right:12px
                box-sizing:border-box
                border-right:1px solid rgba(255,255,255,0.1)
                font-size:16px
                font-weight:700
                color:rgba(255,255,255,0.4)
                &.highlight
                    color:#fff
            .desc
                display:inline-block
                vertical-align:top
                line-height:24px
                margin:12px 0 0 12px
                line-height:24px
                color:rgba(255,255,255,0.4)
                font-size:10px
        .content-right
            flex:0 0 105px
            width:105px
            .pay
                height:48px
                line-height:48px
                font-size:12px
                text-align:center
                color:rgba(255,255,255,0.4)
                font-weight:700
                background:rgba(255,255,255,0.2)
                &.not-enough
                    background:#2b333b
                &.enough
                    background:#00b43c
                    color:#fff

    .ball-container
        .ball
            position:fixed
            left:32px
            bottom:22px
            z-index:200
            transition:all 0.5s cubic-bezier(0.49,-0.29,0.75,0.41)
            .inner
                width:16px
                height:16px
                border-radius:50%
                background:rgb(0,160,220)
                transition:all 0.5s linear
    .shopcart-list
        position:absolute
        top:0
        z-index:-1
        left:0   
        width:100%
        transition:all 0.3s linear
        transform:translate3d(0,-100%,0)
        &.fold-enter, &.fold-leave-to 
            transform:translate3d(0,0,0)
        .list-header
            height:40px
            background:#f3f5f7
            line-height:40px
            padding:0 18px
            border-bottom:1px solid rgba(7,17,27,0.1)
            .title
                float:left
                font-size:14px
                color:rgb(7,17,27)
            .empty
                float:right
                font-size:12px
                color:rgb(0,160,220)
        .list-content
            padding:0 18px
            max-height:217px
            background:#fff
            overflow:hidden
            .food
                position:relative
                padding:12px 0
                box-sizing:border-box
                border-bottom:1px solid rgba(7,17,27,0.1)
                .name
                    line-height:24px
                    font-size:14px
                    color:rgb(7,17,27)
                .price
                    position:absolute
                    right:90px
                    bottom:12px
                    line-height:24px
                    font-size:14px
                    color:rgb(240,20,20)
                    font-weight:700
                .cartcontrol-wrapper
                    position:absolute
                    bottom:6px
                    right:0
    .fold-mask
        position:fixed
        top:0
        left:0
        width:100%
        height:100%
        backdrop-filter:blur(10px)
        z-index:-10
        transition:all 0.3s linear
        opacity:1
        background:rgba(7,17,27,0.6)
        &.hide-enter,&.hide-leave-to
            opacity:0
            background:rgba(7,17,27,0)
</style>