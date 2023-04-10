<script setup>
import axios from 'axios';
import LabelFileUpload from "./LabelFileUpload.vue";
import LabelPlacement from './LabelPlacement.vue';
</script>

<template lang="pug">
h3 Create Activity 
.accordion(id="createActivitySteps")
  .accordion-item
    h2.accordion-header 
      button.accordion-button.collapsed(type="button" data-bs-toggle="collapse" data-bs-target="#collapseActivityInformation" aria-expanded="true" aria-controls="collapseActivityInformation") Step 1: Activity Information
    .accordion-collapse.collapse(id="collapseActivityInformation" data-bs-parent="#createActivitySteps")
      .accordion-body
        form.row.g-3.mb-3
          .col-md-9.pe-5 
            label.form-label(for="activityName") Activity Name 
            input.form-control(:disabled="stepOneSaved" :class="getStepOneValidation(this.validation.Name)" v-bind:on-change="validateStepOneForm()" type="text" id="activityName" placeholder="Name" v-model="activityData.Name")
            .invalid-feedback(v-if="showValidation && !this.validation.Name") Name is required
          .col-md-3 
            label.form-label(for="activityType") Activity Type 
            select.form-select(:disabled="stepOneSaved" :class="getStepOneValidation(this.validation.Type)" v-bind:on-change="validateStepOneForm()" v-model="activityData.Type" id="activityType")
              option(value="") Select a type
              option(value="Label") Label 
              option(value="MultipleChoice") Multiple Choice 
              option(value="Matching") Matching 
              option(value="TrueFalse") True/False 
              option(value="Quiz") Quiz
            .invalid-feedback(v-if="showValidation && !this.validation.Name") Type is required
          .col-md-6 
            label.form-label(for="activityDescription") Description 
            textarea.form-control(:disabled="stepOneSaved" :class="getStepOneValidation(this.validation.Description)" v-bind:on-change="validateStepOneForm()" id="activityDescription" v-model="activityData.Description" placeholder="Description is limited to 150 characters.")
            .invalid-feedback(v-if="showValidation && !this.validation.Name") Description is required
          .col-md-6 
            label.form-label(for="activityInstructions") Instructions
            textarea.form-control(:disabled="stepOneSaved" :class="getStepOneValidation(this.validation.Instructions)" v-bind:on-change="validateStepOneForm()" id="activityInstructions" v-model="activityData.Instructions" placeholder="Instructions are limited to 150 characters.")
            .invalid-feedback(v-if="showValidation && !this.validation.Name") Instructions is required
        button.btn.btn-success(v-if="!stepOneSaved" @click="saveStepOneData()") Save
        button.btn.btn-warning(v-if="stepOneSaved" @click="stepOneSaved = false") Edit
  template(v-if="this.activityData.Type === 'Label'")
    .accordion-item
      h2.accordion-header 
        button.accordion-button.collapsed(type="button" data-bs-toggle="collapse" data-bs-target="#collapseLabelFileUpload" aria-expanded="true" aria-controls="collapseLabelFileUpload") Step 2: Image Upload
      .accordion-collapse.collapse(id="collapseLabelFileUpload" data-bs-parent="#createActivitySteps")
        .accordion-body
          LabelFileUpload(:activityId="this.activityData.ActivityId" :loadActivity="loadActivity")
    .accordion-item(v-if="this.activityData.files && this.activityData.files.length > 0") 
      h2.accordion-header 
        button.accordion-button(type="button" data-bs-toggle="collapse" data-bs-target="#collapseLabelPlacement" aria-expanded="true" aria-controls="collapseLabelPlacement") Step 3: Label Placement 
      .accordion-collapse.collapse.show(id="collapseLabelPlacement" data-bs-parent="#createActivitySteps")
        .accordion-body 
          LabelPlacement(:activityId="this.activityData.ActivityId" :filePath="this.activityData.files[0].FilePath" :ImageWidth="this.activityData.files[0].ImageWidth" :LabelFileId="this.activityData.files[0].LabelFileId")
p {{ this.activityData }}
</template>

<script>
export default {
  data() {
    return {
      activityData: {
        ActivityId: this.$route.params.id,
        Name: "",
        Type: "",
        Description: "",
        Instructions: "",
      },
      validation: {
        FormValid: undefined,
        Name: undefined,
        Type: undefined,
        Description: undefined,
        Instructions: true,
      },
      stepOneSaved: this.$route.params.id != -1,
      stepOneChanged: false,
      showValidation: false,
      imageUploaded: false,
    }
  },
  methods: {
    getStepOneValidation(validation) {
      return {
        'is-valid': validation === undefined ? false : this.showValidation && validation,
        'is-invalid': validation === undefined ? false : this.showValidation && !validation
      }
    },
    validateStepOneForm() {
      // Validate Name
      let validName = true;
      if (this.activityData.Name == '') {
        validName = false;
      }
      this.validation.Name = validName;

      // Validate Type
      let validType = true;
      if (this.activityData.Type == '') {
        validType = false;
      }
      this.validation.Type = validType;

      // Validate Description
      let validDescription = true;
      if (this.activityData.Description == '') {
        validDescription = false;
      }
      this.validation.Description = validDescription;

      this.validation.FormValid = validName && validType && validDescription;
    },
    saveStepOneData() {
      this.validateStepOneForm();
      this.showValidation = true;
      console.log(this.validation.FormValid);
      if (this.validation.FormValid) {
        axios.put((import.meta.env.DEV? 'http://localhost:3070' : window.location.origin) + '/api/activity', this.activityData)
          .then((res) => {
            if (res.status === 200) {
              this.$router.push({name: 'Manage Activity', params: {id: res.data.activityId}});
              this.activityData.ActivityId = res.data.activityId;
              this.stepOneSaved = true;
            }
          })
          .catch((err) => console.log(err));
      }
    },
    loadActivity() {
      axios.post((import.meta.env.DEV? 'http://localhost:3070' : window.location.origin) + '/api/activity', {activityId: this.$route.params.id})
        .then((res) => {
          if (res.status === 200) {
            this.stepOneSaved = true;
            this.activityData = res.data;
          }
        })
    }
  },
  created() {
    if (this.$route.params.id != -1) {
      this.loadActivity();
    }
  }
}
</script>