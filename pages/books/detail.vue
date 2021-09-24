<template>
  <div class="page_book_detail container">
    <main class="main">
      <h3 class="title">{{ detailBook.name }}</h3>
      <div class="book_info">
        <img class="image" :src="HOST + detailBook.cover.url" alt="" />
        <div class="book_attrs">
          <div class="item">
            <span class="key">作者：</span
            ><a href="javascript:;" @click="toAuthor" class="value">{{ detailBook.author.name }}</a>
          </div>
          <div class="item">
            <span class="key">出版社：</span
            ><span class="value">{{ detailBook.publisher }}</span>
          </div>
          <div class="item">
            <span class="key">出版日期：</span
            ><span class="value">{{ detailBook.publication_date }}</span>
          </div>
          <div class="item">
            <span class="key">定价：</span
            ><span class="value">{{ detailBook.price }}元</span>
          </div>
          <div class="item">
            <span class="key">评价数：</span
            ><span class="value">{{ detailBook.evaluations.length }}人</span>
          </div>
          <div class="item">
            <span class="key">分类：</span
            ><span class="value"
              ><Tags :list="detailBook.categories" @click="clickTag"></Tags
            ></span>
          </div>
        </div>
        <div class="rate_stars">
          <div class="hint">当前评分 {{ detailBook.rate }}</div>
          <b-form-rating
            no-border
            class="p-0"
            color="#FFB712"
            :value="detailBook.rate / 2"
            readonly
            inline
          ></b-form-rating>
        </div>
      </div>
      <div class="interact">
        <b-button
          class="m-2"
          variant="outline-warning"
          size="sm"
          @click="showModal('want')"
          >想读</b-button
        >
        <b-button
          class="m-2"
          variant="outline-warning"
          size="sm"
          @click="showModal('reading')"
          >在读</b-button
        >
        <b-button
          class="m-2"
          variant="outline-warning"
          size="sm"
          @click="showModal('hasRead')"
          >读过</b-button
        >
        <div class="stars_giving ml-2">
          <div class="hint">评价：</div>
          <b-form-rating
            no-border
            class="p-0"
            color="#FFB712"
            inline
            v-model="my_rate_value"
            @change="givingStars($event, false)"
          ></b-form-rating>
          <div class="rate_desc">{{ desc_rating }}</div>
        </div>
      </div>

      <div class="description">
        <h2>
          <span>内容简介</span>
          · · · · · ·
        </h2>
        <div v-html="description"></div>
      </div>

      <div class="author_intro">
        <h2>
          <span>作者简介</span>
          · · · · · ·
        </h2>
        <div v-html="author_intro"></div>
      </div>

      <div class="comment">
        <h2>
          <span>评论</span>
          · · · · · ·
        </h2>
        <div class="list_chat">
          <div
            class="item_chat"
            v-for="item in limitListEvalutions"
            :key="item.id"
          >
            <img
              v-if="item.user.avatar"
              class="image"
              :src="HOST + item.user.avatar.url"
            />
            <img v-else class="image" src="/favicon.ico" />
            <div class="info">
              <div class="top_box">
                <div class="title">{{ item.user.nickname }}</div>
                <div class="time">
                  {{ new Date(item.published_at).toLocaleString() }}
                </div>
              </div>
              <div class="bottom_box">
                <div class="desc">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <div class="pager_box" v-if="listEvalutions.length > 5">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>
        </div>
      </div>
    </main>

    <aside class="aside">
      <h2>
        <span>谁在读这本书</span>
        · · · · · ·
      </h2>
      <div
        class="who_reading"
        v-for="item in [...listEvalutions].splice(0, 3)"
        :key="item.id"
      >
        <img
          v-if="item.user.avatar"
          class="image"
          :src="HOST + item.user.avatar.url"
        />
        <img v-else class="image" src="/favicon.ico" />
        <div class="name">{{ item.user.nickname }}</div>
        <div class="when">
          {{ before_time(new Date(item.published_at)) }}
          <span class="pl-1">{{ getCommentState(item.state) }}</span>
        </div>
      </div>
      <ul>
        <li>{{ distributionState.want }}人想读</li>
        <li>{{ distributionState.reading }}人在读</li>
        <li>{{ distributionState.hasRead }}人读过</li>
      </ul>
    </aside>

    <!-- 模态窗 -->
    <b-modal
      v-model="modalShow"
      :title="state_comment"
      @ok="handleOkModal"
      @hidden="handleCloseModal"
    >
      <div class="stars_giving" v-if="state !== 'want'">
        <span>给个评价吧（可选）</span>
        <b-form-rating
          no-border
          class="p-0"
          color="#FFB712"
          v-model="my_rate_value"
          inline
        ></b-form-rating>
        <span class="rate_desc">{{ desc_rating }}</span>
      </div>
      <div class="comment">
        <div>评论：</div>
        <textarea
          name="comment"
          id="comment"
          style="width: 100%"
          rows="5"
          v-model="textComment"
        ></textarea>
      </div>
    </b-modal>
  </div>
</template>

<script>
import qs from 'qs'
import { before_time } from '@/plugins/helper'
export default {
  data() {
    return {
      my_rate_value: 0,
      description:
        '<p>世界经典名著，百年传世科幻经典，维度概念的先驱，堪称“空间”启蒙书。</p><p>世界经典名著，百年传世科幻经典，维度概念的先驱，堪称“空间”启蒙书。</p><p>世界经典名著，百年传世科幻经典，维度概念的先驱，堪称“空间”启蒙书。</p>',
      author_intro:
        '<p>埃德温·A.艾勃特Edwin A. Abbott(1838-1926)</p><p>神学家、小说家、莎士比亚文学研究者。毕业于剑桥大学，26岁就任伦敦城市学校校长。他一生著述甚丰，其中小说《平面国》虽然篇幅简短，却在百年来深受读者喜爱，影响深远，成为传世之作。</p>',
      // 分页器
      perPage: 5,
      currentPage: 1,
      // 分页器
      modalShow: false,
      // 评论状态
      state: '',
      state_comment: '',
      // 评分描述
      textComment: '',
      queryBooks: {},
      detailBook: {
        id: 0,
        name: '三体Ⅲ',
        author: { name: '刘慈欣' },
        categories: [{ name: '科幻', id: 1 }],
        cover: { url: '/uploads/s28823469_71337ad150.jpg' },
        description:
          '与三体文明的战争使人类第一次看到了宇宙黑暗的真相，地球文明像一个恐惧的孩子，熄灭了寻友的篝火，在暗夜中发抖。自以为历经沧桑，其实刚刚蹒跚学步；自以为悟出了生存竞争的秘密，其实还远没有竞争的资格。\n\n使两个文明命悬一线的黑暗森林打击，不过是宇宙战场上一个微不足道的插曲。真正的星际战争没人见过，也不可能见到，因为战争的方式和武器已经远远超出人类的想象，目睹战场之日，即是灭亡之时。\n\n宇宙的田园时代已经远去，昙花一现的终极之美最终变成任何智慧体都无法做出的梦，变成游吟诗人缥缈的残歌；宇宙的物竞天择已到了最惨烈的时刻，在亿万光年暗无天日的战场上，深渊最底层的毁灭力量被唤醒，太空变成了死神广阔的披风。\n\n太阳系中的人们永远不会知道这一切，最后直面真相的，只有两双眼睛。',
        evaluations: [],
        number_of_pages: 513,
        price: 38,
        publisher: '',
        publication_date: '2010-11-01',
        rate: 9.2,
      },
      listEvalutions: [
        {
          user: {
            avatar: { url: '/uploads/s28823469_71337ad150.jpg' },
            nickname: '小明',
          },
          rate: 8,
          id: 1,
          name: '评论者',
          description:
            '再发奋学习也写不出三体来，再狂奔也追不上大刘一小手指甲。人生不用努力了，被大刘牌智子封锁了。',
          published_at: '2021-09-15T13:35:55.000Z',
        },
      ],
    }
  },
  methods: {
    // 模态
    showModal(state) {
      const map_state = new Map([
        ['want', '我想要读这本书'],
        ['reading', '我正在读这本书'],
        ['hasRead', '我读过这本书'],
      ])
      this.state = state
      this.state_comment = map_state.get(state)
      this.modalShow = !this.modalShow
    },
    async handleOkModal() {
      const map_state = new Map([
        ['want', '1'],
        ['reading', '2'],
        ['hasRead', '3'],
      ])
      const stateIdx = map_state.get(this.state)
      const reqData = {
        rate: this.my_rate_value * 2,
        state: stateIdx,
        book: this.detailBook.id,
        user: this.userInStore.id,
        description: this.textComment,
      }
      const resEva = await this.$axios.post('/evaluations', reqData)
      let sumRate = 0
      this.listEvalutions.forEach((item) => {
        sumRate += item.rate
      })
      const avgRate =
        (sumRate + this.my_rate_value * 2) / this.listEvalutions.length
      const resAvg = await this.$axios.put('/books/' + this.detailBook.id, {
        rate: avgRate,
      })
      if (resAvg.status === 200 && resEva.status === 200) {
        this.$bvToast.toast('评价成功', {
          variant: 'info',
          solid: true,
          toaster: 'b-toaster-top-center',
          'auto-hide-delay': 1000,
        })
        this.getBook()
        this.getEvaluations()
      }
    },
    handleCloseModal() {
      this.my_rate_value = 0
      this.state_comment = ''
      this.state = ''
    },
    // 模态
    givingStars(event, isInModal = true) {
      this.my_rate_value = event
      this.state="hasRead"
      if (!isInModal) {
        this.showModal('hasRead')
      }
    },
    async getBook() {
      let res = await this.$axios.get(`/books/${this.$route.params.id}`)
      if (res.status === 200) {
        this.detailBook = res.data
      }
    },
    async getEvaluations() {
      let query = qs.stringify({
        _where: {
          ['book.id']: this.$route.params.id,
        },
        _sort: 'published_at:ASC',
      })
      let res = await this.$axios.get(`/evaluations?${query}`)
      if (res.status === 200) {
        this.listEvalutions = res.data
      }
    },
    clickTag(id) {
      this.$router.push({
        path: '/books/list',
        query: {
          _where: {
            'categories.id': id,
          },
        },
      })
    },
    before_time,
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
    toAuthor(){
      this.$router.push({
        path: '/books/list',
        query: {
          _where: {
            'author.id': this.detailBook.author.id,
          },
        },
      })
    }
  },
  computed: {
    rows() {
      return this.listEvalutions.length
    },
    desc_rating() {
      const map_rate = new Map([
        [1, '很差'],
        [2, '较差'],
        [3, '还行'],
        [4, '推荐'],
        [5, '力荐'],
      ])
      return this.my_rate_value ? map_rate.get(this.my_rate_value) : ''
    },
    limitListEvalutions() {
      let list = [...this.listEvalutions]
      return list.splice(this.perPage * (this.currentPage - 1), this.perPage)
    },
    distributionState() {
      let obj = {
        want: 0,
        reading: 0,
        hasRead: 0,
      }
      this.listEvalutions.forEach((item) => {
        switch (item.state) {
          case 1:
            obj.want++
            break
          case 2:
            obj.reading++
            break
          case 3:
            obj.hasRead++
            break
        }
      })
      return obj
    },
  },
  mounted() {
    this.getBook()
    this.getEvaluations()
  },
}
</script>

<style scoped>
.page_book_detail {
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
.aside {
  flex-basis: 30%;
  background-color: #fff;
  margin-left: 1rem;
  overflow: hidden;
  padding: 0.5rem;
}
@media (max-width: 600px) {
  .page_book_detail {
    flex-wrap: wrap;
  }
  .aside {
    flex-basis: 100%;
    margin-left: 0;
  }
}

.title {
  font-weight: bold;
}
.book_info .image {
  width: 135px;
  height: 198px;
  margin-right: 0.5rem;
}

.book_info {
  display: flex;
  flex-wrap: wrap;
}
.book_attrs {
  font-size: 16px;
  margin-right: auto;
}
.book_attrs .item {
  padding: 0.125rem;
}
.book_attrs .key {
  color: #666666;
}
.book_info .rate_stars {
  margin-top: 0.5rem;
}
@media (max-width: 600px) {
  .book_info .rate_stars {
    flex-basis: 100%;
    margin-left: 0;
  }
}
.book_info .hint {
  font-size: 14px;
  color: #666666;
}
.interact {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
}
.interact .stars_giving {
  display: flex;
  align-items: center;
}
.book_info .hint {
  font-size: 14px;
  color: #666666;
}
.rate_desc {
  padding-left: 0.5rem;
  font-size: 12px;
  color: #666666;
}
.description {
  margin-top: 2rem;
}
.description h2,
.author_intro h2,
.comment h2,
.aside h2 {
  color: #007722;
  font-size: 18px;
}

/* 聊天列表 */
.item_chat {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #fff;
}

.item_chat .image,
.who_reading .image {
  width: 4rem;
  height: 4rem;
}
.item_chat .image {
  margin-right: 1rem;
  margin-bottom: auto;
}

.item_chat .info {
  overflow: hidden;
  flex: 1;
}

.item_chat .top_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item_chat .title {
  font-size: 18px;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.item_chat .time {
  font-size: 14px;
  color: #999;
  white-space: nowrap;
}

.item_chat .bottom_box {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item_chat .desc {
  font-size: 14px;
  color: #999;
}

.pager_box {
  display: flex;
  justify-content: center;
}

/* 侧边栏 */
.who_reading {
  margin-top: 1rem;
  overflow: hidden;
  border-bottom: 1px dashed #000;
}
.who_reading .reader_cover {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  margin-right: 0.5rem;
  float: left;
}
.who_reading .comment {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.who_reading {
  padding-bottom: 1rem;
  overflow: hidden;
}
.who_reading .image {
  margin-right: 1rem;
  float: left;
}

.aside > ul {
  margin-left: 1rem;
}
.aside > ul > li {
}
</style>
