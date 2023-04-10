<script setup>
import LabelActivity from '../components/Activity/LabelActivity.vue';
</script>

<template lang="pug">
.container.pt-3
  h3 {{ this.activity.Name }}
  h6 {{ this.activity.Description }}
  p {{ this.activity.Instructions }}
  div(v-if="!loading")
    LabelActivity(v-if="activity.Type == 'Label'" :activity="this.activity")
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      activity: {},
      loading: true
    }
  },
  methods: {
    loadActivity() {
      axios.post((import.meta.env.DEV? 'http://localhost:3070' : window.location.origin) + '/api/activity', { activityId: this.$route.params.id })
        .then((res) => {
          this.activity = res.data;
          console.log(this.activity);
          this.loading = false;
        })
        .catch((err) => console.log(err));
    }
  },
  created() {
    this.loadActivity();
  }
}
</script>