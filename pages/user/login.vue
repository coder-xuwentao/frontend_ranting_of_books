<template>
  <main class="page_login">
    <form
      class="form"
      name="fm"
      method="post"
      action="#"
      @submit.prevent="submit"
    >
      <section class="logo_box">
        <img src="/img/litsy_logo_2.png" alt="" />
      </section>
      <p v-if="isEmailIdentify">
        <span>邮箱：</span>
        <a
          class="toggle_login"
          @click="isEmailIdentify = !isEmailIdentify"
          href="javascript:;"
          >切换用户名登录</a
        >
        <input
          name="email"
          type="email"
          required
          v-model="formData.email"
          class="email w-100"
        />
      </p>
      <p v-else>
        <span>用户名：</span>
        <a
          class="toggle_login"
          @click="isEmailIdentify = !isEmailIdentify"
          href="javascript:;"
          >切换邮箱登录</a
        >
        <input
          name="username"
          ref="username"
          type="text"
          required
          v-model="formData.username"
          class="username w-100"
          pattern="^[a-zA-Z0-9]{4,16}$"
          @invalid="
            showInvalidHint('username', '请输入4-16位下划线、字母、数字')
          "
          @input="handleInput('username')"
        />
      </p>
      <p>
        密码：
        <input
          name="password"
          type="password"
          required
          v-model="formData.password"
          ref="password"
          class="password w-100"
          pattern="^[a-zA-Z0-9]{6,16}$"
          @invalid="
            showInvalidHint('password', '请输入6-16位下划线、字母、数字')
          "
          @input="handleInput('password')"
        />
      </p>

      <p class="btn_group">
        <input type="submit" class="submit" value="提交" />
        <input type="button" class="reset ml-3" @click="reset" value="重置" />
        <input
          type="button"
          class="to_register"
          @click="$router.push('/user/register')"
          value="注册"
        />
      </p>
    </form>
  </main>
</template>

<script>
export default {
  data() {
    return {
      isEmailIdentify: true,
      formData: { password: '', email: '', username: '' },
    }
  },
  methods: {
    showInvalidHint(ref, str) {
      this.$refs[ref].setCustomValidity(str)
    },
    handleInput(ref) {
      this.$refs[ref].setCustomValidity('')
    },
    async submit() {
      const { email, username, password } = this.formData
      const identifier = email ? email : username
      const res = await this.$axios.post('/auth/local', {
        identifier,
        password,
      })
      if (res.status === 200) {
        const token = res.data.jwt
        const user = res.data.user
        this.$store.commit('signIn', {token, user})
        this.$router.push('/')
      }
      return false
    },
    reset() {
      this.formData = { password: '', email: '' }
    },
  },
}
</script>
<style scoped>
.page_login {
  position: relative;
}
.form {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);

  min-width: 20rem;
  max-width: 25rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 1rem;
}
.form .logo_box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  margin: 0 auto;
  margin-top: -3.5rem;
  margin-bottom: 1rem;
  background-color: #fff;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 4px 2px #ccc;
}
.form .logo_box > img {
  width: 4rem;
  height: 4rem;
}
@media (max-width: 400px) {
  .page_login {
    padding-top: 5rem;
    background-color: #fff;
  }
  .form {
    position: static;
    transform: translate(0%, 0%);
  }
}
.toggle_login {
  float: right;
}
.btn_group {
  display: flex;
}
.to_register {
  margin-left: auto;
}
</style>