<template lang="pug">
h6 File Upload
input.form-control(type="file" id="fileUpload" v-on:change="fileUpload($event)" accept="image/*")
template(v-if="previewImage && !showSuccess")
  h6 Preview:
  button.btn.btn-success(v-on:click="uploadImage()") Save Image
  .row 
    img(:src="previewImage" style="width: 20%")
p.text-success(v-if="showSuccess") Your Image uploaded successfully.

</template>

<script>
import axios from 'axios';

export default {
  props: {
    activityId: Number,
    loadActivity: Function
  },
  data() {
    return {
      files: [],
      uploadFile: null,
      previewImage: null,
      showSuccess: false
    }
  },
  methods: {
    uploadImage() {
      let data = new FormData();
      data.append('activityId', this.activityId);
      data.append('file', this.uploadFile);

      let config = {
        header : {
          'Content-Type': 'multipart/form-data'
        }
      }

      axios.post((import.meta.env.DEV? 'http://localhost:3070' : window.location.origin) + '/api/activity/label-file', data, config)
        .then((res) => {
          this.showSuccess = true;
          this.loadActivity();
        })
        .catch((err) => console.log(err));
    },
    fileUpload(e) {
      const image = e.target.files[0];
      this.uploadFile = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e => {
        this.previewImage = e.target.result;
      };
    },
    saveFile() {

    },
    loadFiles() {
      axios.post((import.meta.env.DEV? 'http://localhost:3070' : window.location.origin) + '/api/activity', {activityId: this.activityId})
        .then((res) => {
          this.files = res.data;
        })
        .catch((err) => console.log(err));
    }
  },
  mounted() {

  }
}
</script>