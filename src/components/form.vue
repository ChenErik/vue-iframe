<template>
  <div class="main">
    <span>{{ info.name }}</span>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    layerid: {
      type: String,
      default: ''
    },
    lydata: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        name: ''
      }
    }
  },
  mounted() {
    this.form = this.info
  },
  methods: {
    quxiao() {
      this.$layer.close(this.layerid)
    }
  }
}
</script>

<style lang="css">
</style>
