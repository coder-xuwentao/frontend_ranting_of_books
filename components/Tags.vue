<template>
  <div class="tag_list" :style="{ flexWrap: flexWrap }">
    <div
      class="tag"
      :class="{ active: activeIdx === item.id }"
      v-for="(item, idx) in list"
      :key="idx"
      @click="clickTag(item.id)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    flexWrap: {
      type: String,
      default: 'wrap',
    },
    list: {
      type: Array,
      default() {
        return [
          { id: 1, name: '历史' },
          { id: 2, name: '爱情' },
        ]
      },
    },
    activeId: {
      type: Number,
      default() {
        return 99999
      },
    },
  },
  data() {
    return {
      activeIdx: 99999,
    }
  },
  watch: {
    activeId(val) {
      this.activeIdx = val
    },
  },
  methods: {
    clickTag(id) {
      this.activeIdx = id
      this.$emit('click', id)
    },
  },
}
</script>

<style scoped>
.tag_list {
  display: flex;
}
.tag.active {
  color: #fff;
  background-color: #17a2b8;
}
.tag {
  cursor: pointer;
  white-space: nowrap;
  margin-right: 0.5rem;
  margin-bottom: 1rem;
  color: #37a;
  background-color: #f5f5f5;
  padding: 0.25rem 0.5rem;
}
</style>
