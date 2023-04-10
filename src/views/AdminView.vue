<template lang="pug">
.row.flex-nowrap
  .col-auto.col-md-1.col-xl-1.px-sm-2.px-0.bg-light
    .d-flex.flex-column.align-items-center.align-items-sm-start.px-3.pt-2.min-vh-100
      RouterLink(to="/admin/users").d-flex.align-items-center.pb-3.mb-md-0.me-md-auto.text-white.text-decoration-none
        span.fs-5.d-none.d-sm-inline.text-primary(:class="{'text-dark': this.$route.name == 'Users Admin'}") Users
      RouterLink(to="/admin/activities").d-flex.align-items-center.pb-1.mb-md-0.me-md-auto.text-white.text-decoration-none
        span.fs-5.d-none.d-sm-inline.text-primary(:class="{'text-dark': this.$route.name == 'Activities Admin'}") Activities
  .col.py-3.me-3
    RouterView
</template>
<script>
import { RouterView, RouterLink } from 'vue-router';
export default {
  name: "AdminView"
}
</script>