<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuList">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text"><span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="goods-wrapper" ref="goodsList">
      <ul>
        <li v-for="item in goods" class="good-item">
          <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h1 class="name">{{food.name}}</h1>
                  <div class="desc">{{food.description}}</div>
                  <div class="extra">
                    <span class="sellCount">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="new">￥{{food.price}}</span><span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @add="_drop"  :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import shopcart from "../shopCart/shopcart";
import cartcontrol from "../cartcontrol/cartcontrol"
const ERR_OK = 0;
export default {
  props:{
    seller:{
      type:Object
    }
  },
  data() {
    return {
      goods:[],
      listHeight:[],
      scrollY:0
    };
  },
  computed:{
    currentIndex(){
      for(let i = 0;i<this.listHeight.length;i++){
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i+1];
        if(!height2||(this.scrollY >= height1&&this.scrollY<height2)){
          return i;
        }
      }
      return 0;
    },
    selectFoods(){
      let foods = [];
      this.goods.forEach((good)=>{
        good.foods.forEach((food)=>{
          if(food.count){
            foods.push(food);
          }
        })
      });
      return foods;
    }
  },
  created(){
    this.classMap=["decrease","discount","special","invoice","guarantee"];
    this.$http.get('/api/goods').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
   
    
  },
  methods:{
    selectMenu(index,event){
      if(!event._constructed){
        return;
      }
      let goodList = this.$refs.goodsList.getElementsByClassName("good-item");
      let el = goodList[index];
      this.goodScroll.scrollToElement(el,300);
    },
    _initScroll(){
      this.menuScroll = new BScroll(this.$refs.menuList,{click:true});
      this.goodScroll = new BScroll(this.$refs.goodsList,{probeType:3,click:true});
      this.goodScroll.on('scroll',(pos)=>{
        if (pos.y <= 0) {
          this.scrollY = Math.abs(Math.round(pos.y)); 
        }
        
      })
    },
    _calculateHeight(){
        let goodList = this.$refs.goodsList.getElementsByClassName("good-item");
        let height = 0;
        this.listHeight.push(height);
        for(let i = 0;i<goodList.length;i++){
          let item = goodList[i];
          height+=item.clientHeight;
          this.listHeight.push(height); 
        }
    },
    _drop(target){
      // 异步执行，优化动画
      this.$nextTick(()=>{
        this.$refs.shopcart.drop(target);
      })
    }
  },
  components:{
    shopcart,
    cartcontrol
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin";
.goods
  position:absolute
  top:174px
  bottom:46px
  display:flex
  overflow:hidden
  .menu-wrapper
    flex:0 0 80px
    width:80px
    background-color:#f3f5f7
    .menu-item
      display:table
      width:56px
      height:54px
      padding:0 12px
      &.current
        position:relative
        z-index:10
        margin-top:-1px
        background:#fff
        font-weight:700
        .text
          border-bottom:0
      .icon
        display:inline-block
        width:12px
        height:12px
        background-size:12px 12px
        background-repeat:no-repeat
        vertical-align:top
        margin-right:2px
        line-height:14px
        &.decrease
          bg-image("decrease_3")
        &.discount
          bg-image("discount_3")
        &.guarantee
          bg-image("guarantee_3")
        &.invoice
          bg-image("invoice_3")
        &.special
          bg-image("special_3")
      .text
        display:table-cell
        vertical-align:middle
        font-size:12px
        width:56px
        // color:rgb(240,20,20)
        border-bottom:1px solid rgba(7,17,27,0.1)
  .goods-wrapper
    flex:1
    .title
      height:26px
      line-height:26px
      font-size:12px
      padding:0 0 0 14px
      background-color:#f3f5f7
      color:rgb(147,153,159)
      border-left:2px solid #d9dde1
    .food-item
      display:flex
      margin:18px
      border-bottom:1px solid rgba(7,17,27,0.1)
      padding-bottom:18px
      &:last-child
        border-bottom:0px
        padding-bottom:0
      .icon
        flex:0 0 57px
        margin-right:10px
      .content
        flex:1
        position:relative
        .name 
          font-size:14px
          color:rgb(7,17,27)
          line-height:14px
          margin:2px 0 8px 0
          height:14px
        .desc
          font-size:10px
          color:rgb(147,153,159)
          line-height:12px
          margin-bottom:8px
        .extra
          font-size:10px
          color:rgb(147,153,159)
          line-height:10px
          // margin-bottom:8px
          .sellCount
            display:inline-block
            margin-right:12px
        .price
          font-weight:700
          line-height:24px
          .new
            margin-right:8px
            font-size:14px
            color:rgb(240,20,20)
          .oldPrice
            font-size:10px
            text-decoration:line-through
            color:rgb(147,153,159)
        .cartcontrol-wrapper
          position:absolute
          right:0
          bottom:-7px

</style>
