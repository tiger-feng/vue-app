import Vue from 'vue'
import Router from 'vue-router'
import Source from 'vue-resource'
import goods from '@/components/goods/goods'
import gratings from '@/components/gratings'
import seller from '@/components/seller'

Vue.use(Router)
Vue.use(Source)
export default new Router({
  routes: [
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/gratings',
      name: 'gratings',
      component: gratings
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ]
})

