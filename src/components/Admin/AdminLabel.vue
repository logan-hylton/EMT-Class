<template lang="pug">
div(ref="draggableContainer" id="draggable-container" name="draggableContainer" v-if="this.Shape !== ''" )
  div.border.border-dark.d-flex.align-items-center(id="draggable-icon" @mousedown="dragMouseDown" v-bind:style="getStyle()")
    p(v-bind:style="{'color': TextColor, 'margin': 'auto'}") {{ this.Text }}
    
</template>
  
<script>
export default {
  name: 'DraggableContainer',
  props: {
    Shape: String,
    Color: String,
    TextColor: String,
    Text: String,
    Width: Number,
    Height: Number,
    LabelX: Number,
    LabelY: Number
  },
  data() {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      }
    }
  },
  mounted() {
    this.loadLocation();
  },
  methods: {
    loadLocation() {
      console.log(this.Shape);
      if (this.Shape !== '') {
        console.log(this.LabelX);
        console.log(this.LabelY);
        this.$refs.draggableContainer.style.left = (this.LabelX - (this.Width / 2)) + 'px';
        this.$refs.draggableContainer.style.top = (this.LabelY - (this.Width / 2)) + 'px';
      }
    },
    getStyle() {
      if (this.Shape === 'Circle') {
        return {
          margin: '0px',
          width: this.Width + 'px',
          height: this.Width + 'px',
          'border-radius': '50%',
          'font-size': '14px',
          'line-height': this.Width + 'px',
          'text-align': 'center',
          background: this.Color,
          color: this.TextColor
        }
      } else {
        return {
          width: this.Width + 'px',
          height: this.Height + 'px',
          'text-align': 'center',
          background: this.Color,
          color: this.TextColor
        };
      }
    },
    dragMouseDown: function (event) {
      event.preventDefault()
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
    },
    elementDrag: function (event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      this.X = event.clientX
      this.Y = event.clientY
      // set the element's new position:
      this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
      this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
    },
    closeDragElement (event) {
      this.$emit('changeCoordinates', event);
      document.onmouseup = null
      document.onmousemove = null
    }
  }
}
</script>

<style>
#draggable-container {
  position: absolute;
  z-index: 9;
}
#draggable-icon {
  z-index: 10;
  cursor: pointer;
}

</style>
  