<template>
  <div id="app">
    <v-header :seller="seller"></v-header> 
    <div class="tab border-1px">
      <div class="tab-item"><router-link to="/goods">商品</router-link></div>
      <div class="tab-item"><router-link to="/gratings">评论</router-link></div>
      <div class="tab-item"><router-link to="/seller">商家</router-link></div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import header from './components/header/header.vue'
const ERR_OK = 0
export default {
  name: 'app',
  data() {
    return {
      seller: {}
    }
  },
  created() {
    this.$http.get('/api/seller').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.seller = response.data
        console.log(this.seller)
      }
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
#app .header{

}
#app .tab{
 display:flex;
 position:relative;

}
#app .tab::after{
  display:block;
  position:absolute;
  left:0;
  bottom:0;
  width:100%;
  border-top:1px solid  rgba(7,17,27,.1);
  content:""
}
#app .tab .tab-item{
  flex:1;
  height:40px;
  line-height:40px;
  text-align: center;
  font-size:14px;
}
</style>
