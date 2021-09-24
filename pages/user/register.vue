<template>
  <main class="page_login">
    <form
      class="form"
      name="fm"
      method="post"
      action="#"
      @submit.prevent="submit"
    >
      <section class="upload_box">
        <div class="input_box">
          <input
            type="file"
            name="avatar"
            id="upload_img"
            @change="handletUploadAvatar"
          />
          <img :src="avatar_img" alt="" />
        </div>
      </section>
      <p v-if="!hasAvatar" style="text-align: center">请上传你的头像</p>
      <p>
        <span>昵称：</span>
        <input
          name="nickname"
          type="text"
          required
          v-model="formData.nickname"
          class="nickname w-100"
          pattern="^[\u4E00-\u9FA5A-Za-z0-9_]+$"
          @invalid="showInvalidHint('nickname', '请输入4-16位字符串')"
          @input="handleInput('nickname')"
          ref="nickname"
        />
      </p>
      <p>
        <span>邮箱：</span>
        <input
          name="email"
          type="email"
          required
          v-model="formData.email"
          class="email w-100"
        />
      </p>
      <p>
        <span>用户名：</span>
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
          @click="$router.push('/user/login')"
          value="已有账户？登录"
        />
      </p>
    </form>
  </main>
</template>

<script>
export default {
  data() {
    return {
      avatar_img: '/img/plus.png',
      hasAvatar: false,
      formData: {
        password: '',
        email: '',
        username: '',
        nickname: '',
        avatarFile: null,
      },
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
      const { email, username, password, nickname, avatarFile } = this.formData
      const avatarFormData = new FormData()
      avatarFormData.append('files', avatarFile)
      const res_upload = await this.$axios.post('/upload', avatarFormData)
      const data = {
        email,
        username,
        password,
        nickname,
        avatar:res_upload.data[0].id,
      }
      const res = await this.$axios.post('/auth/local/register', data)
      if (res.status === 200) {
        this.$router.push('/')
      }
      return false
    },
    reset() {
      this.formData = { password: '', email: '' }
    },
    handletUploadAvatar(event) {
      const file = event.target.files[0]
      const fr = new FileReader()
      const allowType = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']

      this.formData.avatarFile = file

      if (!allowType.includes(file.type)) {
        this.$bvToast.toast('文件应该为图片', {
          variant: 'danger',
          solid: true,
        })
        return
      }

      if (file.size > 1 * 1024 * 1024) {
        this.$bvToast.toast('文件不能超过1m', {
          variant: 'danger',
          solid: true,
        })
        return
      }

      try {
        fr.readAsDataURL(file)
        fr.onloadend = () => {
          // console.log(fr.result);
          this.avatar_img = fr.result
        }
      } catch (error) {
        this.$bvToast.toast('上传文件失败', {
          variant: 'danger',
          solid: true,
        })
      }
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
  top: 40%;
  transform: translate(-50%, -50%);

  min-width: 20rem;
  max-width: 25rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 1rem;
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
.upload_box {
  text-align: center;
  margin-top: -4rem;
  margin-bottom: 1rem;
}
.input_box {
  position: relative;
  display: inline-block;
  background-color: #f3f3f3;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  box-shadow: 0 0 6px 3px #ccc;
  overflow: hidden;
}
.input_box img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.input_box #upload_img {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  opacity: 0;
  width: 100%;
  height: 100%;
}

@media (max-width: 400px) {
  .page_login {
    background-color: #fff;
  }
  .form {
    position: relative;
    top: 0;
    left: 0;
    transform: translate(0%, 0%);
  }
  .upload_box {
    margin-top: 0;
  }
}
</style>