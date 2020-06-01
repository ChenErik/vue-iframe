<template>
  <!-- <div class="vi-content">123</div> -->
  <base-iframe :options="options">
    <div :id="contentId" class="vl-notify-content" :style="contentStyle" />
  </base-iframe>
</template>

<script>
import iframe from './components/iframe/iframe'
export default {
  components: {
    'base-iframe': iframe
  },
  data() {
    return {
      options: {},
      contentId: 'vlc' + new Date().getTime()
    }
  },
  computed: {
    contentStyle() {
      return {
        height: parseInt(this.options.area[1]) - 50 + 'px',
        minHeight: 'inherit',
        overflow: 'auto'
      }
    }
  },
  created() {
    this.options = this.$data
  },
  mounted() {
    this.getContent()
  },
  methods: {
    getContent() {
      this.$nextTick(() => {
        let propsData = { ...this.options.content.data }
        propsData['layerid'] = this.options.id
        let instance = new this.options.content.Content({
          // 具体参数信息，请参考vue源码
          parent: this.options.content.parent,
          propsData: propsData
        })
        instance.vm = instance.$mount()
        document.getElementById(this.contentId).appendChild(instance.vm.$el)
        this.options.layer.instancesVue[this.options.id].iframe = instance.vm
      })
    }
  }
}
</script>

<style lang="less">
@import "./css/iconfont.css";
@import "./css/index.less";
</style>
