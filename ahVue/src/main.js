import Vue from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';

import '@/assets/styles/index.less';

Vue.config.productionTip = false
Vue.use(Antd, VueQuillEditor);

new Vue({
  render: h => h(App, {
    props: {
      locale: zhCN
    }
  }),
}).$mount('#app')
