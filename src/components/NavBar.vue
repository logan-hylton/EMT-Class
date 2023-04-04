<script>
import { RouterLink, RouterView } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue';
export default {
  name: "NavBar",
  setup() {
    const auth0 = useAuth0();
    return {
      isAuthenticated: auth0.isAuthenticated,
      isLoading: auth0.isLoading,
      user: auth0.user,
      login() {
        auth0.loginWithRedirect();
      },
      logout() {
        auth0.logout({
          logoutParams: {
            returnTo: window.location.href
          }
        });
      }
    }
  }
}
</script>

<template lang="pug">
header
  nav.navbar.navbar-expand-lg.navbar-light.bg-light
    div.navbar-brand()
    RouterLink.navbar-brand(to='/') GCEAS EMT Class
    button.navbar-toggler(type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation')
      span.navbar-toggler-icon
    #navbarSupportedContent.collapse.navbar-collapse
      ul.navbar-nav.mr-auto(v-if="this.isAuthenticated")
        li.nav-item
          RouterLink.nav-link(to='/') Home 
        li.nav-item
          RouterLink.nav-link(to='/admin') Admin
        li.nav-item(v-if="this.isAuthenticated && !this.isLoading")
          a.nav-link(@click="logout()" style="cursor: pointer") Logout
RouterView(v-if="this.isAuthenticated && !this.isLoading")
.spinner-border(role="status" v-if="this.isLoading")
.container.text-center(v-if="!this.isAuthenticated && !this.isLoading") 
  h2 Please login to continue
  button.btn.btn-primary(@click="login()") Login
</template>
