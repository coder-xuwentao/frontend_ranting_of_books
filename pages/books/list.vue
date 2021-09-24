<template>
  <div class="page_books_list container">
    <h2>图书列表</h2>
    <div class="tag_box">
      <Tags
        @click="clickTag"
        :list="listCategories"
        :activeId="activeTagId"
        flexWrap="nowrap"
      ></Tags>
    </div>
    <div class="filter_box">
      <b-dropdown id="dropdown-1" text="排序" class="mb-2" variant="info">
        <b-dropdown-item
          v-for="(item, index) in listDropdown"
          :key="index"
          @click="sortBooks(item.sortWay)"
          >{{ item.name }}</b-dropdown-item
        >
      </b-dropdown>

      <b-button
        size="sm"
        class="mr-2 ml-auto"
        type="button"
        @click="resetFilter"
      >
        重置筛选条件
      </b-button>

      <b-form class="search_box" @submit.stop.prevent="doSearch">
        <b-form-input
          size="sm"
          class="ml-sm-2"
          placeholder="Search"
          style="width: 15rem"
          v-model="searchItem"
        ></b-form-input>

        <b-button size="sm" class="my-2 my-sm-0" type="submit">
          <b-icon icon="search"></b-icon>
        </b-button>
      </b-form>
    </div>

    <template>
      <div class="author" v-if="'author.id' in queryBooks._where">
        <img class="author_cover" :src="HOST + listBooks[0].author.cover.url" />
        <div class="author_desc">{{ listBooks[0].author.description }}</div>
      </div>
      <strong>拥有以下作品:</strong></template
    >
    <div class="books_list">
      <div
        class="col-12 col-md-6"
        v-for="item in limitListBooks"
        :key="item.id"
      >
        <div>
          <BooksItem :bookItem="item"></BooksItem>
        </div>
      </div>
    </div>

    <div class="pager" v-if="listBooks.length > 8">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  components: {},
  data() {
    return {
      hasAuthor: true,
      // 分页器
      perPage: 8,
      currentPage: 1,

      author_desc: '描述描述描述',
      hasAuthor: false,
      listCategories: [],
      queryBooks: {
        _start: 0,
        _sort: 'id',
        _where: {},
      },
      listBooks: [
        { author: { cover: { url: '' }, description: '' }, cover: { url: '' } },
      ],
      listDropdown: [
        { sortWay: 'id:DESC', name: '默认' },
        { sortWay: 'rate', name: '评分' },
        { sortWay: 'publication_date', name: '发布时间' },
      ],
      searchItem: '',
    }
  },
  methods: {
    async getCategories() {
      let res = await this.$axios.get(`/categories`)
      if (res.status === 200) {
        this.listCategories = [{ id: 99999, name: '默认' }, ...res.data]
      }
    },
    async getBooks() {
      let query = qs.stringify(this.queryBooks)
      let res = await this.$axios.get(`/books?${query}`)
      if (res.status === 200) {
        this.listBooks = res.data
      }
    },
    clickTag(id) {
      if (id === 99999) {
        Reflect.deleteProperty(this.queryBooks._where, 'categories.id')
      } else {
        this.queryBooks._where['categories.id'] = id
      }
      this.getBooks()
    },
    sortBooks(sortWay) {
      if (this.queryBooks._sort.endsWith('DESC')) {
        this.queryBooks._sort = sortWay + ':ASC'
      } else {
        this.queryBooks._sort = sortWay + ':DESC'
      }
      this.getBooks()
    },
    doSearch() {
      this.queryBooks._where['name_contains'] = this.searchItem
      this.getBooks()
    },
    resetFilter() {
      this.queryBooks = {
        _start: 0,
        _sort: 'id',
        _where: {},
      }
      this.getBooks()
    },
  },
  computed: {
    rows() {
      return this.listBooks.length
    },
    limitListBooks() {
      let list = [...this.listBooks]
      return list.splice(this.perPage * (this.currentPage - 1), this.perPage)
    },
    activeTagId() {
      if (this.queryBooks._where['categories.id']) {
        console.log(this.queryBooks._where['categories.id'])
        return this.queryBooks._where['categories.id']
      } else {
        return 99999
      }
    },
  },
  watch: {},
  mounted() {
    if (Object.keys(this.$route.query).length) {
      this.queryBooks = Object.assign(
        {},
        this.queryBooks,
        qs.parse(this.$route.query)
      )
    }
    this.getCategories()
    this.getBooks()
  },
}
</script>

<style scoped>
.page_books_list {
  padding: 1rem;
  background-color: #fff;
}
.books_list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}
.pager {
  display: flex;
  justify-content: center;
}
.tag_box {
  margin-bottom: 1rem;
  overflow: auto;
}
.books_list .score {
  color: #9b9b9b;
}
.tag_box::-webkit-scrollbar {
  height: 10px;
  width: 8px;
  background: white;
}
.tag_box::-webkit-scrollbar-corner, /* 滚动条角落 */
.tag_box::-webkit-scrollbar-thumb,
.tag_box::-webkit-scrollbar-track {
  border-radius: 4px;
}
.tag_box::-webkit-scrollbar-corner,
.tag_box::-webkit-scrollbar-track {
  /* 滚动条轨道 */
  background-color: rgba(180, 160, 120, 0.1);
  box-shadow: inset 0 0 1px rgba(180, 160, 120, 0.5);
}
.tag_box::-webkit-scrollbar-thumb {
  /* 滚动条手柄 */
  background-color: #17a2b8;
}
@media (max-width: 600px) {
  .tag_box::-webkit-scrollbar {
    display: none;
  }
}
.author {
  overflow: hidden;
  margin-bottom: 1rem;
}
.author_cover {
  width: 135px;
  height: 183px;
  float: left;
  margin-right: 1rem;
}

.filter_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.filter_box .search_box {
  display: flex;
  align-items: center;
}
.author_desc {
  text-indent: 2em;
}
</style>
