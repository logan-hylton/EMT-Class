<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template lang="pug">
header
  nav.navbar.navbar-expand-lg.navbar-light.bg-light
    div.navbar-brand()
    RouterLink.navbar-brand(to='/') GCEAS EMT Class
    button.navbar-toggler(type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation')
      span.navbar-toggler-icon
    #navbarSupportedContent.collapse.navbar-collapse
      ul.navbar-nav.mr-auto
        li.nav-item.active
          RouterLink.nav-link(to='/') Home 
        li.nav-item
          RouterLink.nav-link(to='/admin') Admin
RouterView
</template>