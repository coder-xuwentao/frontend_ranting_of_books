<template>
  <div class="rate_item" @click="$router.push('/books/detail/'+rateItem.book.id)">
    <div class="book float-right">
      <img :src="HOST + rateItem.book.cover.url" alt="" />
    </div>
    <div class="top">
      <i class="name"> {{ rateItem.book.name }} </i>
      <b-form-rating
        no-border
        class="p-0 stars_box"
        color="#FFB712"
        inline
        :value="parseInt(rateItem.rate / 2)"
        readonly
      ></b-form-rating>
      <span class="datetime"> {{  new Date(rateItem.published_at).toLocaleString().split(" ")[0] }} </span>
      <span class="read_state"> {{ getCommentState(rateItem.state) }} </span>
    </div>
    <div class="desc"><i>我的评论：</i><br />{{ rateItem.description }}</div>
  </div>
</template>

<script>
export default {
  props: {
    rateItem: {
      type: Object,
      default() {
        return {
          book: {
            name: '三国演义',
            cover: {
              url: '#',
            },
            id:1
          },
          state: 2,
          rate: 10,
          published_at: '2009-9-9',
          description:
            '唐国强的诸葛亮是永远无法被超越的唐国强的诸葛亮是永远无法被超越的了了',
        }
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    getCommentState(state) {
      switch (state) {
        case 1:
          return '想读'
        case 2:
          return '在读'
        case 3:
          return '读过'

        default:
          break
      }
    },
  },
  components: {},
}
</script>

<style scoped>
.rate_item {
  width: 100%;
  overflow: hidden;
  cursor: pointer;
}
.rate_item .datetime {
  color: #aaa;
  font-size: 14px;
}
.rate_item .book > img {
  margin-left: 1rem;
  margin-bottom: 1rem;
  width: 115px;
  height: 149px;
}
.rate_item .top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.rate_item .top > .name {
  margin-right: 0.5em;
}
.rate_item .book_title {
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  text-align: center;
}
.rate_item .stars_box {
  margin-right: auto;
}
.rate_item .read_state {
  margin-left: 0.5em;
}
.rate_item .desc {
  font-size: 13px;
  margin-top: 0.975rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
