<template lang="pug">
.container(v-for="file in activity.files")
  img(:src="file.FilePath" alt="Image couldn't load.")

</template>

<script>
export default {
  props: {
    activity: Object,
    labels: [Object]
  }
}
</script>