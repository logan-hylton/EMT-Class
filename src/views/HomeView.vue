<script setup>
import ActivityCard from '../components/Home/ActivityCard.vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

<template lang="pug">
.container.pt-3
  h3.pb-5 Select an Activity:
  .row
    .col-3(v-if="loading")
      .card
        .card-body
          h5.card-title.placeholder-glow
            span.placeholder.col-6
          p.card-text.placeholder-glow
            span.placeholder.col-7
            span.placeholder.col-4
            span.placeholder.col-4
            span.placeholder.col-6
            span.placeholder.col-8
          button.btn.btn-primary.disabled.placeholder.col-6(tabindex="-1")
    .col-3.text-center(v-else v-for="activity in activities")
      ActivityCard(:activity="activity")

        
</template>

<script>
export default {
  data() {
    return {
      activities: ["test1", "test2", "test3", "test4", "test5"],
      loading: true
    }
  },
  methods: {
    loadActivities() {
      axios.post((import.meta.env.DEV? 'http://localhost:3070' : window.location.origin) + '/api/activities')
        .then((response) => {
          this.activities = response.data;
          this.loading = false;
          console.log(this.activities);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  },
  mounted() {
    this.loadActivities();
  }
}
</script>