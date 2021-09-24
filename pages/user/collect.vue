<template>
  <main class="page_collect container">
    <div class="user_info">
      <img
        v-if="userInStore.avatar"
        :src="HOST + userInStore.avatar.url"
        class="avatar"
        alt=""
      />
      <h2 class="nickname">{{ userInStore.nickname }}</h2>
      <div>{{ userInStore.username }}</div>
    </div>
    <div class="tab_box">
      <b-tabs class="mt-4" content-class="mt-3" small>
        <b-tab title="我想看" active>
          <div class="books_list">
            <div
              class="col-12 col-md-6"
              v-for="item in listWant"
              :key="item.evaId"
            >
              <div class="item_book">
                <BooksItem :bookItem="item"></BooksItem>
                <div
                  class="icon_box"
                  @click="delItem(item.evaId)"
                  :class="{ active: isDeleting }"
                >
                  <b-icon
                    class="icon"
                    icon="x-square"
                    scale="4"
                    variant="danger"
                  ></b-icon>
                </div>
              </div>
            </div>
          </div>
          <div class="pager">
            <b-pagination
              v-if="listWant.length > 8"
              v-model="wantPager.currentPage"
              :total-rows="wantPager.rows"
              :per-page="wantPager.perPage"
              aria-controls="my-table"
            ></b-pagination>
          </div>
        </b-tab>
        <b-tab title="正在看">
          <div class="books_list">
            <div
              class="col-12 col-md-6"
              v-for="item in listReading"
              :key="item.evaId"
            >
              <div class="item_book">
                <BooksItem :bookItem="item"></BooksItem>
                <div
                  class="icon_box"
                  @click="delItem(item.evaId)"
                  :class="{ active: isDeleting }"
                >
                  <b-icon
                    class="icon"
                    icon="x-square"
                    scale="4"
                    variant="danger"
                  ></b-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="pager">
            <b-pagination
              v-if="listReading.length > 8"
              v-model="readingPager.currentPage"
              :total-rows="readingPager.rows"
              :per-page="readingPager.perPage"
              aria-controls="my-table"
            ></b-pagination></div
        ></b-tab>
        <b-tab title="看过了">
          <div class="books_list">
            <div
              class="col-12 col-md-6"
              v-for="item in listHasRead"
              :key="item.evaId"
            >
              <div class="item_book">
                <BooksItem :bookItem="item"></BooksItem>
                <div
                  class="icon_box"
                  @click="delItem(item.evaId)"
                  :class="{ active: isDeleting }"
                >
                  <b-icon
                    class="icon"
                    icon="x-square"
                    scale="4"
                    variant="danger"
                  ></b-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="pager">
            <b-pagination
              v-if="listWant.listHasRead > 8"
              v-model="hasReadPager.currentPage"
              :total-rows="hasReadPager.rows"
              :per-page="hasReadPager.perPage"
              aria-controls="my-table"
            ></b-pagination></div
        ></b-tab>

        <b-tab title="我的评价">
          <div class="books_list">
            <div
              class="col-12 col-md-6"
              v-for="item in listEvaluations"
              :key="item.id"
            >
              <div>
                <div class="item_book">
                  <RateItem :rateItem="item"></RateItem>
                  <div
                    class="icon_box"
                    @click="delItem(item.id)"
                    :class="{ active: isDeleting }"
                  >
                    <b-icon
                      class="icon"
                      icon="x-square"
                      scale="4"
                      variant="danger"
                    ></b-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pager">
            <b-pagination
              v-if="listReading.length > 8"
              v-model="readingPager.currentPage"
              :total-rows="readingPager.rows"
              :per-page="readingPager.perPage"
              aria-controls="my-table"
            ></b-pagination></div
        ></b-tab>
      </b-tabs>

      <div class="delete_btn" @click="isDeleting = !isDeleting">
        <div class="icon_box">
          <b-icon
            class="icon"
            v-if="!isDeleting"
            icon="x-circle"
            scale="4"
            variant="info"
          ></b-icon>
          <b-icon
            class="icon"
            v-else
            icon="check-circle"
            scale="4"
            variant="success"
          ></b-icon>
        </div>
        <span :class="{ active: isDeleting }" class="hint">删除中...</span>
      </div>
    </div>

    <b-modal id="modal-1" hide-body title="提示" @ok="delOk">
      <p class="">是否删除</p>
    </b-modal>
  </main>
</template>

<script>
import qs from 'qs'
import RateItem from '~/components/RateItem.vue'
export default {
  data() {
    return {
      nickname: 'nickname',
      username: 'username',
      wantPager: {
        currentPage: 3,
        rows: 3,
        perPage: 1,
      },
      readingPager: {
        currentPage: 3,
        rows: 3,
        perPage: 1,
      },
      hasReadPager: {
        currentPage: 3,
        rows: 3,
        perPage: 1,
      },
      listWant: [],
      listReading: [],
      listHasRead: [],
      listEvaluations: [],
      isDeleting: false,
      prepareDelId: -1,
    }
  },
  methods: {
    async getEvaluation() {
      this.listEvaluations = []
      this.listWant = []
      this.listReading = []
      this.listHasRead = []
      const _where = qs.stringify({
        ['user.id']: this.userInStore.id,
      })
      const res = await this.$axios.get(`/evaluations?${_where}`)
      if (res.status === 200) {
        this.listEvaluations = res.data
        res.data.forEach((item) => {
          item.book.evaId = item.id
          switch (item.state) {
            case 1:
              this.listWant.push(item.book)
              break
            case 2:
              this.listReading.push(item.book)
              break
            case 3:
              this.listHasRead.push(item.book)
              break
            default:
              break
          }
        })
      }
    },
    delItem(id) {
      this.prepareDelId = id
      this.$bvModal.show('modal-1')
    },
    async delOk() {
      const id = this.prepareDelId
      const res = await this.$axios.delete(`/evaluations/${id}`)
      if (res.status === 200) {
        this.getEvaluation()
        this.$bvToast.toast('删除成功', {
          variant: 'info',
          solid: true,
          toaster: 'b-toaster-top-center',
          'auto-hide-delay': 1000,
        })
      }
    },
  },
  components: { RateItem },
  mounted() {
    if (!this.tokenInStore) {
      this.$router.push('/user/login')
    }
    this.getEvaluation()
  },
}
</script>

<style scoped>
.page_collect {
  background-color: #fff;
  padding: 1rem;
}
.user_info img {
  width: 4rem;
  height: 4rem;
  float: left;
  margin-right: 1rem;
}
.user_info .nickname {
  font-weight: bold;
}

.books_list {
  display: flex;
  justify-content: space-between;
  align-content: start;
  flex-wrap: wrap;
  min-height: 60vh;
  margin-right: -15px;
  margin-left: -15px;
}
.item_book {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}
.item_book .icon_box {
  cursor: pointer;
  text-align: center;
  width: 0;
  height: 5rem;
  line-height: 5rem;
  flex-shrink: 0;
  overflow: hidden;
  transition: all ease 0.3s;
}
.item_book .icon_box.active {
  width: 5rem;
}
.pager {
  display: flex;
  justify-content: center;
}

.tab_box {
  position: relative;
  padding-bottom: 5rem;
}
.delete_btn {
  cursor: pointer;
  position: absolute;
  right: 0.5rem;
  bottom: 1rem;
  z-index: 100;
  display: flex;
  align-items: center;
}
.delete_btn .icon_box {
  cursor: pointer;
  text-align: center;
  width: 5rem;
  height: 5rem;
  line-height: 5rem;
}
.delete_btn .icon {
}
.delete_btn .hint {
  width: 0;
  white-space: nowrap;
  overflow: hidden;
  transition: width 0.3s ease;
}
.delete_btn .hint.active {
  width: 6rem;
}
</style>
