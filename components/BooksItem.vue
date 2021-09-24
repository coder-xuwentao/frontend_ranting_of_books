<template>
  <div>
    <div
      class="books_item"
      @click="$router.push({path:`/books/detail/${bookItem.id}`})"
    >
      <img :src="HOST + bookItem.cover.url" alt="" />
      <div class="title">{{ bookItem.name }}</div>
      <b-form-rating
        no-border
        class="p-0"
        style="background: none"
        color="#FFB712"
        v-model="rate_value"
        readonly
        inline
      ></b-form-rating>
      <span class="score">{{ bookItem.rate }}</span>
      <div class="author" v-if="bookItem.author">{{ bookItem.author.name }}</div>
      <div class="desc">
        {{ bookItem.description }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bookItem: {
      type: Object,
      default() {
        return {
          id:1,
          name: '素食',
          rate: '9.0',
          author: {name:'作者'},
          description: '一场噩梦之后，妻子却突然开始拒绝吃肉，拒绝为家人准备荤菜，甚至到最后，她开始拒绝自己的“人类”身份，把自己当成了一株植物……',
          cover:{url:"#"}
        }
      },
    },
  },
  data() {
    return {}
  },
  methods: {},
  computed: {
    rate_value(){
      return Number(this.bookItem.rate)/2
    }
  },
}
</script>

<style scoped>
.books_item {
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 1rem;
}
.books_item img {
  width: 100px;
  height: 140px;
  margin-right: 1rem;
  float: left;
}
.books_item .author {
  font-size: 12px;
  margin: 0.5rem 0;
}
.books_item .desc {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
