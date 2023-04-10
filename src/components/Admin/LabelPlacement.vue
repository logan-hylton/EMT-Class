<script setup>
import axios from 'axios';
import AdminLabel from './AdminLabel.vue';
</script>

<template lang="pug">
.row 
  .col-md-4.col-sm-12 
    form.form
      .row.form-row 
        label.form-label.ps-0 Image Size:
        input.form-range(type="range" min="300" max="900" v-bind:disabled="imageSizeSaved" v-model="imageWidth" v-on:change="updateCoordinates()") 
      .row.form-row.pt-2 
        button.btn.btn-success(type="button" v-on:click="this.saveImageSize()" v-if="!imageSizeSaved") Save Image Size
        button.btn.btn-warning(type="button" v-on:click="imageSizeSaved = false" v-if="imageSizeSaved") Edit Image Size
      .row.form-row.pt-3
        h6.ps-0 Labels:
        button.btn.btn-primary(type="button" v-on:click="newLabel()") Add a New Label
      .row.form-row.pt-2
        button.btn.btn-success(type="button" v-if="this.labels.length > 0" v-on:click="this.saveLabels()") Save Labels
      .row.form-row.pt-2(v-if="this.labels.length > 0")
        .scroll.ps-0.pe-0(data-bs-spy="scroll" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" tabindex="0")
          .row.ms-1.me-1.pb-2(v-for="label in labels")
            .card.p-0
              .card-header.ms-0.me-0
                input.form-control(type="text" placeholder="Name" v-model="label.name")
              .card-body.pt-2
                .row.form-row.p-1.pt-0
                  label.form-label.ps-0 Shape:
                  select.form-select(v-model="label.shape")
                    option(value="") Please Select a Type
                    option(value="Rectangle") Rectangle
                    option(value="Circle") Circle
                .row.form-row.p-1(v-if="label.shape !== ''") 
                  .col-md-6.p-0
                    label.form-label.ps-0 Width:
                    input.form-range(type="range" min="20", max="150" v-model="label.width")
                  .col-md-6(v-if="label.shape == 'rectangle'")
                    label.form-label.ps-0 Height:
                    input.form-range(type="range" min="20" max="150" v-model="label.height")
                .row.form-row.p-1.d-flex.align-items-center
                  .col-md-2.p-0.align-middle
                    label.form-label.ps-0.pb-0 Color:
                  .col-md-3.p-0
                    input.form-control.form-control-color(type="color" title="Choose your color" v-model="label.color")
                  .col-md-3.p-0 
                    label.form-label.ps-0.pb-0 TextColor:
                  .col-md-3.p-0
                    input.form-control.form-control-color(type="color" title="Choose your text color" v-model="label.textColor")
                .row.form-row.p-1 
                  label.form-label.ps-0.pb-0.mb-1 Text:
                  input.form-control(type="text" v-model="label.text")
      



  .col-md-1.col-sm-1
    template(v-for="(label, index) in labels")
      AdminLabel(@changeCoordinates="this.updateLabelCoordinates(index, $event)" :Shape="label.shape" :Color="label.color" :TextColor="label.textColor" :Text="label.text" :Width="label.width" :Height="label.height" :LabelX="label.X" :LabelY="label.Y" )
      br
  .col-md-7.col-sm-11
    img(:src="filePath" :style="{'width': imageWidth + 'px'}" id="image" v-on:click="imageClick" ref="image")
p {{ labels }}
</template>

<style>
.scroll {
  height: 70vh;
  overflow: auto;
}
</style>

<script>

export default {
  props: {
    filePath: String,
    LabelFileId: Number,
    activityId: Number,
    ImageWidth: Number
  },
  data() {
    return {
      imageCoordinates: () => document.getElementById('image').getBoundingClientRect(),
      imageX: null,
      imageY: null,
      imageWidth: 300,
      imageHeight: null,
      imageSizeSaved: false,
      labels: []
    }
  },
  methods: {
    imageClick(e) {
      console.log(e);
    },
    newLabel() {
      this.labels.push({
        labelId: null,
        name: "",
        shape: "",
        width: 20,
        height: 20,
        color: "#ffffff",
        text: "",
        textColor: "#000000",
        X: null,
        Y: null
      })
    },
    saveLabels() {
      let imageCoordinates = this.imageCoordinates();
      let labelsRequestData = {
        ActivityId: this.activityId,
        Labels: this.labels.map(l => {
          return {
            Name: l.name,
            Shape: l.shape,
            Width: l.width,
            Height: l.shape == 'circle' ? l.width : l.height,
            Color: l.color,
            TextColor: l.textColor,
            Text: l.text,
            X: l.X - imageCoordinates.left,
            Y: l.Y - imageCoordinates.top
          };
        })
      };
      
      axios.put((import.meta.env.DEV? 'http://localhost:3070' : window.location.origin) + '/api/activity/labels', labelsRequestData)
        .then((res) => {
          this.loadLabels();
        })
        .catch((err) => {
          console.log(err);
        })
    },
    saveImageSize() {
      axios.put((import.meta.env.DEV? 'http://localhost:3070' : window.location.origin) + '/api/activity/label-file/image-width', 
        {
          LabelFileId: this.LabelFileId,
          ImageWidth: this.imageWidth
        }
      ).then((res) => {
        this.imageSizeSaved = true;
      }).catch((err) => console.log(err));
    },
    updateCoordinates() {
      let coordinates = this.imageCoordinates();
      this.imageX = coordinates.x;
      this.imageY = coordinates.y;
      this.imageWidth = coordinates.width;
      this.imageHeight = coordinates.height;
    },
    updateLabelCoordinates(index, e) {
      this.labels[index].X = e.x;
      this.labels[index].Y = e.y;
    },
    loadLabels() {
      let coordinates = document.getElementById('image').offsetTop;
      console.log(coordinates);
      axios.post((import.meta.env.DEV? 'http://localhost:3070' : window.location.origin) + '/api/activity/labels', {ActivityId: this.activityId})
        .then((res) => {
          let imageCoordinates = this.imageCoordinates();
          console.log(coordinates);
          let data = res.data.map(l => {
            return {
              activityId: l.ActivityId,
              labelId: l.LabelId,
              name: l.Name,
              shape: l.Shape,
              width: l.Width,
              height: l.Height,
              color: l.Color,
              textColor: l.TextColor,
              text: l.Text,
              X: l.X + imageCoordinates.x,
              Y: l.Y + imageCoordinates.y
            }
          });
          this.labels = data;
          console.log(this.labels);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  },
  mounted() {
    if (this.ImageWidth != null) {
      this.loadLabels();
      this.imageWidth = this.ImageWidth;
      this.imageSizeSaved = true;
    }
  }
}
</script>