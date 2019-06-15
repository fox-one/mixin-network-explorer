import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '@/pages/About.vue'
import Tools from '@/pages/Tools.vue'
import Cal from '@/pages/Cal.vue'
import AssetsViewer from '@/pages/AssetsViewer.vue'
import Assist from '@/pages/Assist.vue'
import MixinOAuth from '@/pages/MixinOAuth.vue'
import Monitor from '@/pages/Monitor.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Monitor },
  { path: '/about', component: About },
  { path: '/tools', component: Tools },
  { path: '/tools/cal/:name', component: Cal },
  { path: '/tools/assist', component: Assist },
  { path: '/tools/assets-viewer', component: AssetsViewer },
  { path: '/oauth/mixin/callback', component: MixinOAuth }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

export default router