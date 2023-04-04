<script>
import { RouterView, RouterLink } from 'vue-router';
export default {
  name: "AdminView",
  methods: {
    getRoute(route) {
      return this.$route.name === 'admin' ? 'admin/' + route : route;
    }
  }
}
</script>
<template lang="pug">
.row.flex-nowrap
  .col-auto.col-md-1.col-xl-1.px-sm-2.px-0.bg-light
    .d-flex.flex-column.align-items-center.align-items-sm-start.px-3.pt-2.min-vh-100
      a.d-flex.align-items-center.pb-3.mb-md-0.me-md-auto.text-white.text-decoration-none
        span.fs-5.d-none.d-sm-inline.text-dark Admin
      ul#menu.nav.nav-pills.flex-column.mb-sm-auto.mb-0.align-items-center.align-items-sm-start
        li.nav-item
          RouterLink.nav-link.align-middle.px-0(:to="getRoute('users')")
            span.ms-1.d-none.d-sm-inline Users
        li.nav-item
          RouterLink.nav-link.align-middle.px-0(:to="getRoute('activities')")
            span.ms-1.d-none.d-sm-inline Activities
      hr
  .col.py-3
    RouterView
</template>