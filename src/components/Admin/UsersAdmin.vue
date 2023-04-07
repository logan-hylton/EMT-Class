<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      isLoading: true,
      editing: false
    }
  },
  methods: {
    loadUsersData() {
      axios.post('http://localhost:3070' + '/api/users')
        .then((res) => {
          this.users = res.data;
        })
        .catch((err) => console.log(err));
    },
    saveUsers() {
      this.editing = false;
      axios.put('http://localhost:3070' + '/api/users', {users: this.users})
        .catch((err) => console.log(err));
    },
    discardChanges() {
      this.loadUsersData();
    }
  },
  mounted() {
    this.loadUsersData();
  }
}
</script>

<template lang="pug">
.row.me-5
  .col.text-start 
    h3 Users Admin 
  .col.text-end
      button.btn.btn-success.me-1(@click="this.saveUsers()" :disabled="!editing") Save
      button.btn.btn-warning(@click="this.editing = true" :disabled="editing") Edit
      button.btn.btn-danger.ms-1(v-if="editing" @click="this.discardChanges()") Discard Changes
.row.me-5
  .col-12
    table.table.table-striped(style="width: 100%")
      thead
        tr
          th(scope="col") Email 
          th(scope="col") Admin
      tbody
        tr(v-for="user in this.users")
          td {{ user.email }}
          td.justify-content-center
            .form-check
              input.form-check-input(type="checkbox" v-model="user.admin" :disabled="!editing" :on-change="this.changes = true")
</template>