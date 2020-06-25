<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "Router-Viewer",
  mounted: function() {
    let body = document.body;
    body.style.backgroundColor = this.$pastebin.config.backgroundColor;
    this.$pastebin.setTitle("Home");
  }
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  background-color: #B3D8FF;
}
</style>
