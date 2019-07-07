import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '@/pages/About'
import Tools from '@/pages/Tools'
import Cal from '@/pages/Cal'
import AssetsViewer from '@/pages/AssetsViewer'
import Assist from '@/pages/Assist'
import MixinOAuth from '@/pages/MixinOAuth'
import Monitor from '@/pages/Monitor'
import Home from '@/pages/Home'
import NodeDetail from '@/pages/NodeDetail'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/nodes/:id', component: NodeDetail },
  { path: '/monitor', component: Monitor },
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