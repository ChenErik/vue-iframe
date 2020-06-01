import Vue from 'vue'
import App from './App.vue'
import layer from '../package/index'
Vue.prototype.$layer = layer(Vue)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
