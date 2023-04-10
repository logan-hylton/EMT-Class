<template lang="pug">
.row.me-5
  .col.text-start 
    h3 Activities Admin 
  .col.text-end
      RouterLink.btn.btn-primary.me-1(to="manage-activity/-1") Create New Activity
.row.me-5.mt-2
  .col-12
    table.table.table-striped.border.rounded.rounded-3(style="width: 100%")
      thead
        tr
          th(scope="col") Name 
          th(scope="col") Type 
          th(scope="col") Description
          th(scope="col") Instructions
          th(scope="col") Options
      tbody
        tr(v-for="activity in activities")
          td {{ activity.Name }}
          td {{ activity.Type }}
          td {{ activity.Description }}
          td {{ activity.Instructions }}
          td 
            .btn-group(role="group")
              RouterLink(:to="'manage-activity/' + activity.ActivityId").btn.btn-warning Edit
              button.btn.btn-danger(@click="deleteActivity(activity.ActivityId)") Delete

</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      activities: []
    }
  },
  methods: {
    loadActivities() {
      axios.post((import.meta.env.DEV? 'http://localhost:3070' : window.location.origin) + '/api/activities')
        .then((res) => this.activities = res.data)
        .catch((err) => console.log(err));
    },
    deleteActivity(activityId) {
      console.log("Delete pressed for activityId " + activityId);
    }
  },
  created() {
    this.loadActivities();
  }
}
</script>