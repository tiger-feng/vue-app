<template>
<div class="cartcontrol">
    <transition name="move">
        <div v-show="food.count>0" class="cartcontrol-decrease" @click="decreaseCart($event)">
            <span class="inner icon-remove_circle_outline"></span>
        </div>
     </transition>
    <div v-show="food.count>0" class="cartcontrol-count">{{food.count}}</div>
    <div class="cartcontrol-add icon-add_circle" @click="addCart($event)"></div> 
    
</div>
</template>

<script type="text/ecmascript-6">
 import Vue from 'vue'
export default{
   
    props:{
        food:{
            type:Object
        }
    },
    methods:{
        addCart(event){
            if(!event._constructed){
                return;
            }
            if(!this.food.count){
                Vue.set(this.food,"count",1)
            }else{
                this.food.count++;
            }
            this.$emit('add',event.target)
        },
        decreaseCart(event){
            if(!event._constructed){
                return;
            }
            if(this.food.count){
                this.food.count--;
            }
        }
    }
}
</script>
<style  lang="stylus" rel="stylesheet/stylus">
.cartcontrol
    font-size:0
    .cartcontrol-decrease
        display:inline-block
        padding:6px
        transition: all 0.4s linear
        transform:translate3d(0,0,0)
        opacity:1
        .inner
            display:inline-block
            font-size:24px
            color:rgb(0,160,220)
            transition:all 0.4s linear
            transform:rotate(0)  
        &.move-enter, &.move-leave-to /* .fade-leave-active in below version 2.1.8 */ 
            transform:translate3d(24px,0,0)
            opacity:0
            .inner
                transform:rotate(180deg)


    .cartcontrol-count
        display:inline-block
        vertical-align:top
        font-size:10px
        line-height:24px
        width:12px
        color:rgb(147,153,159)
        padding-top:6px
        text-align:center
    .cartcontrol-add
        font-size:24px
        padding:6px
        color:rgb(0,160,220)
        display:inline-block
          
</style>
