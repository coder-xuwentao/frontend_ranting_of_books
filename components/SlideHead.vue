<template>
  <div class="slide_head">
    <h5>{{ title }}</h5>
    <NuxtLink class="p-1" :class="{'ml-auto':!hasHandle}" to="/books/list">更多</NuxtLink>
    <div class="dot_list" v-if="hasHandle">
      <div
        class="dot_item"
        :class="{ active: activeIndex === item }"
        v-for="item in 4"
        :key="item"
      ></div>
    </div>

    <div v-if="hasHandle" class="btn_left" @click="handlePrev">
      <b-icon icon="caret-left-fill"></b-icon>
    </div>
    <div v-if="hasHandle" class="btn_right" @click="handleNext">
      <b-icon icon="caret-right-fill"></b-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: '',
    hasHandle: {
      type:Boolean,
      default:true,
    },
  },
  data() {
    return {
      activeIndex: 1,
      timer: null,
    }
  },
  methods: {
    handlePrev() {
      if (this.activeIndex === 1) {
        this.activeIndex = 4
      } else {
        this.activeIndex--
      }
      this.$emit('changeSlide', 'prev',this.activeIndex)
    },
    handleNext() {
      if (this.activeIndex === 4) {
        this.activeIndex = 1
      } else {
        this.activeIndex++
      }
      
      this.$emit('changeSlide', 'next',this.activeIndex)
    },
  },
  mounted() {},
}
</script>

<style scoped>
h5 {
  font-weight: bold;
}
.slide_head {
  display: flex;
  align-items: center;
}
.dot_item {
  width: 0.5rem;
  height: 0.5rem;
  margin: 0.5rem;
  background-color: #ccc;
  border-radius: 50%;
}
.dot_item.active {
  background-color: #9b9a8e;
}
.dot_list {
  margin-left: auto;
  display: flex;
}
[class^='btn_']:hover,
[class^='btn_']:active {
  opacity: 0.7;
}
[class^='btn_'] {
  margin: 0 0.25rem;
  width: 1.5rem;
  text-align: center;
  color: #fff;
  background-color: #9b9a8e;
  border-radius: 50%;
}
</style>
