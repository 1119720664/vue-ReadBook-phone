<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "eBookRead",
    mounted(){
      const filename = this.$route.params.filename
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
