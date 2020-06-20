import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'Post' }
  },
  {
    path: '/:pasteid(.{24})',
    redirect: to => {
      const { params } = to;
      return { name: 'Viewer', params: { pasteId: params.pasteid } };
    }
  },
  {
    path: '/post',
    name: 'Post',
    component: () => import('../views/Post.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/view/:pasteId',
    name: 'Viewer',
    component: () => import('../views/Viewer.vue')
  },
  {
    path: '*',
    redirect: { name: 'Search' }
  }
]

const router = new VueRouter({
  routes
})

export default router
