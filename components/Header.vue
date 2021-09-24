<template>
  <header class="bg-info">
    <div class="container navbar_container">
      <b-navbar toggleable="lg" type="dark" class="p-0">
        <b-navbar-brand href="/">
          <img class="logo_header" src="/img/litsy_logo.png" alt="" />
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-form class="ml-2" @submit.prevent="doHeadSearch">
              <b-form-input
                size="sm"
                class="ml-sm-2"
                placeholder="Search"
                style="width: 15rem"
                v-model="searchVal"
              ></b-form-input>

              <b-button size="sm" class="my-2 my-sm-0" type="submit">
                <b-icon icon="search"></b-icon>
              </b-button>
            </b-nav-form>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto pl-2 pr-2">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>用户</em>
              </template>
              <template v-if="!isLogin">
                <b-dropdown-item v-if="!tokenInStore" href="/user/login"
                  >登录</b-dropdown-item
                >
                <b-dropdown-item v-if="!tokenInStore" href="/user/register"
                  >注册</b-dropdown-item
                >
                <b-dropdown-item v-else @click="signout">退出</b-dropdown-item>
                <b-dropdown-item href="/user/collect">个人首页</b-dropdown-item>
              </template>
              <b-dropdown-item v-else>退出</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </header>
</template>

<script>
import qs from 'qs'
export default {
  data() {
    return {
      isLogin: false,
      searchVal: '',
    }
  },
  methods: {
    signout() {
      this.$store.commit('allClear')
    },
    doHeadSearch() {
      this.$router.push(
        '/books/list?' +
          qs.stringify({
            _where: {
              name_contains: this.searchVal,
            },
          })
      )
    },
  },
  components: {},
}
</script>

<style scoped>
.logo_header {
  height: 2.5rem;
}
.navbar_container {
  padding: 0.5rem 0;
}
</style>
