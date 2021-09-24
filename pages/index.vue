<template>
  <div class="page_index container">
    <main class="main">
      <SlideAd></SlideAd>
      <div class="mt-4">
        <SlideHead title="最新评论" @changeSlide="changeSlide_1"></SlideHead>
        <hr style="margin-top: 0" />
        <NuxtLink
          v-if="listNewComment.length"
          :to="'/books/detail/' + listNewComment[commentIdx].book.id"
          class="new_valuations"
        >
          <img
            :src="HOST + listNewComment[commentIdx].book.cover.url"
            class="image cover"
          />
          <div class="desc">
            <div class="name">
              {{ listNewComment[commentIdx].user.nickname }}
            </div>
            <div class="comment">{{ listNewComment[commentIdx].description }}</div>
          </div>
        </NuxtLink>
      </div>
      
      <div class="mt-3">
        <SlideHead
          title="新书速递"
          @changeSlide="changeSlide($event, 'slide_1')"
          :hasHandle="false"
        ></SlideHead>
        <hr style="margin-top: 0" />
        <div>
          <div class="newbooks_list">
            <div
              class="book_card"
              v-for="item in listNewBooks"
              :key="item.id"
              @click="$router.push('/books/detail/' + item.id)"
            >
              <img :src="HOST + item.cover.url" class="image" />
              <div>
                <small>{{ item.author.name }}</small>
              </div>
              <div>
                <i>{{ item.name }}</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <aside class="aside">
      <h5 style="font-weight: bold">热门标签</h5>
      <hr />
      <Tags :list="listCategories" @click="clickTag"></Tags>

      <h5 style="font-weight: bold">高分推荐</h5>
      <div class="rate_list">
        <div
          class="book_card"
          v-for="item in listRateBooks"
          :key="item.id"
          @click="$router.push('/books/detail/' + item.id)"
        >
          <img :src="HOST + item.cover.url" class="image" />
          <div class="info">
            <small>{{ item.name }}</small
            ><strong>{{ item.rate }}</strong>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import qs from 'qs'
import SlideHead from '~/components/SlideHead.vue'
export default {
  components: { SlideHead },
  data() {
    return {
      listNewBooks: [],
      listNewComment: [
        {
          book: { id: 1, cover: { url: '' } },
          user: { nickname: '1' },
          description: '',
        },
      ],
      commentIdx: 0,
      queryNewBooks: {
        _start: 0,
        _limit: 12,
        _sort: 'publication_date:DESC',
      },
      queryNewComment: {
        _limit: 4,
        _sort: 'published_at:DESC',
      },
      queryRateBooks: {
        _limit: 4,
        _sort: 'rate:DESC',
      },
      listCategories: [],
      listRateBooks: [],
    }
  },
  methods: {
    changeSlide_1(direct, slideIdx) {
      this.commentIdx = slideIdx - 1
    },
    async getNewBooks() {
      let query = qs.stringify(this.queryNewBooks)
      let res = await this.$axios.get(`/books?${query}`)
      if (res.status === 200) {
        this.listNewBooks = res.data
      }
    },
    async getNewComments() {
      let query = qs.stringify(this.queryNewComment)
      let res = await this.$axios.get(`/evaluations?${query}`)
      if (res.status === 200) {
        this.listNewComment = res.data
      }
    },
    async getRateBooks() {
      let query = qs.stringify(this.queryRateBooks)
      let res = await this.$axios.get(`/books?${query}`)
      if (res.status === 200) {
        this.listRateBooks = res.data
      }
    },
    async getCategories() {
      let res = await this.$axios.get(`/categories`)
      if (res.status === 200) {
        this.listCategories = res.data
      }
    },
    clickTag(id) {
      this.$router.go({
        path: '/books/list',
        query: {
          _where: {
            'categories.id': id,
          },
        },
      })
    },
  },
  mounted() {
    this.getNewBooks()
    this.getNewComments()
    this.getCategories()
    this.getRateBooks()
  },
}
</script>

<style scoped>
.page_index {
  display: flex;
}
.main {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0%;
  padding: 0.5rem;
  min-height: 90vh;
  background-color: #fff;
  overflow: hidden;
}
aside {
  flex-basis: 30%;
  background-color: #fff;
  margin-left: 1rem;
  overflow: hidden;
  padding: 0.5rem;
}
@media (max-width: 600px) {
  .page_index {
    flex-wrap: wrap;
  }
  aside {
    flex-basis: 100%;
    margin-left: 0;
  }
}

.newbooks_list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.book_card {
  cursor: pointer;
}
.book_card .image {
  width: 115px;
  height: 165px;
}
@media (min-width: 992px) and (max-width: 1200px) {
  .newbooks_list .book_card:last-child {
    margin-right: auto;
    margin-left: 15px;
  }
}
@media (max-width: 600px) {
  .newbooks_list .book_card .image {
    width: 150px;
    height: 200px;
  }
}

@media (max-width: 337px) {
  .newbooks_list .book_card {
  }
  .newbooks_list .book_card .image {
    width: 280px;
    height: 360px;
  }
}
.new_valuations {
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  border: 1px solid #ccc;
}
.new_valuations .name {
  font-weight: bold;
  white-space: nowrap;
  margin-bottom: 1rem;
}
.new_valuations .comment{
  text-indent: 2em;
}
.new_valuations .cover {
  width: 115px;
  height: 165px;
  margin-right: 1rem;
}

.rate_list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.rate_list .book_card .image {
  width: 140px;
  height: 185px;
}

.rate_list .info {
}
.rate_list .info strong {
  color: #ffac2d;
  float: right;
}
</style>
