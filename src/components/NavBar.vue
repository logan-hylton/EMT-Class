
<template lang="pug">
div(v-if="!this.isLoading")
  header
    nav.navbar.navbar-expand-lg.navbar-light.bg-light
      div.navbar-brand
      RouterLink.navbar-brand(to='/') GCEAS EMT Class
      button.navbar-toggler(type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation')
        span.navbar-toggler-icon
      #navbarSupportedContent.collapse.navbar-collapse
        ul.navbar-nav.mr-auto
          li.nav-item
            RouterLink.nav-link(to='/' :class="{'disabled': this.$route.name == 'home'}") Home 
          li.nav-item
            RouterLink.nav-link(:to="{name: 'default'}" :class="{'disabled': this.$route.fullPath.includes('admin')}" v-if="this.isAdmin") Admin
          li.nav-item
            a.nav-link(@click="logout()" style="cursor: pointer") Logout
  RouterView
</template>

<script>
import axios from 'axios';
export default {
  name: "NavBar",
  data() {
    return {
      isAdmin: import.meta.env.DEV,
      isLoading: import.meta.env.PROD,
    }
  },
  methods: { 
    logout() {
      window.location.pathname = '/emt-logout';
    },
    getUserIsAdmin() {
      axios.post(window.location.origin + '/api/user-is-admin')
        .then((res) => {
          this.isAdmin = res.data.userIsAdmin;
          this.isLoading = false;
        })
        .catch((err) => console.log(err));
    }
  },
  mounted() {
    if (import.meta.env.PROD) this.getUserIsAdmin();
  }
}
</script>