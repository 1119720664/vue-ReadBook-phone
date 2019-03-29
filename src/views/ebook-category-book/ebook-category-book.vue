<template>
  <div class="category-book">
    <title-view :label="categoryText(data.category)" :btn="$t('home-seeAll')" @click="showBookCategory"></title-view>
    <div class="category-book-list">
      <div class="category-book-item" v-for="(item,index) in data.list" :key="index" @click="showBookDetail(item)">
        <div class="img-wrapper">
          <img class="img" :src="item.cover"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
