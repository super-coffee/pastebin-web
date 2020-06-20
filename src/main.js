import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import vueHljs from 'vue-hljs'
import 'highlight.js/styles/atom-one-light.css'
import VueClipboard from 'vue-clipboard2'

Vue.use(vueHljs)
Vue.use(VueClipboard)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
