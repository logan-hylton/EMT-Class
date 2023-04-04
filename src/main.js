import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAuth0 } from "@auth0/auth0-vue";
import authConfig from "../auth-config.json";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/js/bootstrap.js';

import './assets/main.css'

const app = createApp(App)
app.use(router)
app.use(
  createAuth0({
    domain: authConfig.domain,
    clientId: authConfig.clientId,
    authorizationParams: {
      redirect_uri: window.location.href,
    },
    useRefreshTokens: authConfig.useRefreshTokens,
    cacheLocation: authConfig.cacheLocation
  })
)

app.mount('#app')
