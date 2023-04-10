<template lang="pug">
.card
  .card-body
    h5.card-title {{ this.activity.Name }}
    h6.card-subtitle.mb-2.text-body-secondary {{ this.activity.Type }}
    p.card-text {{ this.activity.Description }}
    RouterLink.btn.btn-primary.col-6(:to="this.route") Start Activity
    
</template>

<script>
import { RouterLink } from 'vue-router';
export default {
  props: {
    activity: Object
  },
  data() {
    return {
      route: this.$route.name
    }
  },
  created() {
    this.route = "activity/" + this.activity.ActivityId;
  }
}
</script>