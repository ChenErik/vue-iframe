<template>
  <div id="app">
    <button @click="pageHandle">自定义</button>
  </div>
</template>

<script>
import formComp from './components/form'
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      a: 0
    }
  },
  methods: {
    pageHandle() {
      this.$layer.iframe({
        content: {
          Content: formComp,
          parent: this,
          data: { info: { name: 'ChenErik' }}
        },
        area: ['900px', '600px'],
        title: this.a,
        cancel: () => {
          alert(2110)
        }
      })
      this.a++
      // console.log(id);
      // this.$layer.full(id);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
