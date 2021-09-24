/*
export default function ({ store, redirect, req, router, app: { $axios } }) {
  // 数据访问前缀
  // request拦截器
  $axios.onRequest((config) => {
    // 将获取到token加入到请求头中
    config.headers.common['Authorization'] = 
  })
  // response拦截器，数据返回后，可以先在这里进行一个简单的判断

 $axios.interceptors.response.use(
    (response) => {
      // return response
      if (response.data.code == 401) {
        // 返回401，token验证失败，清除客户端cookie
        Cookie.remove('token')
        // 重定向到登录页面， 这里做一个判断，容错：req.url 未定义
        if (req.url) {
          redirect('/sign?ref=' + req.url)
        } else {
          redirect('/sign')
        }
      } else if (response.data.code == 404) {
        // 重定向到404页面
        redirect('/')
      } else {
        // 请求接口数据正常，返回数据
        return response
      }
    },
    (error) => {
      if (error.response.status == 500) {
        // http状态500，服务器内部错误，重定向到500页面
        redirect('/500.html')
      }
      if (error.response.status == 404) {
        // http状态500，请求API找不到，重定向到404页面
        redirect('/404.html')
      }
      return Promise.reject(error.response) // 返回接口返回的错误信息
    }
  )
   */
export default function ({ $axios, store, redirect }) {
  $axios.onRequest((config) => {
    // 将获取到token加入到请求头中
    if (store.state.tokenInStore) {
      config.headers.common['Authorization'] = 'Bearer ' + store.state.tokenInStore
    }
  })
  $axios.interceptors.response.use((response) => {
    if (response.status === 401) {
      // 清除token
      localStorage.removeItem("token")
      store.commit('saveToken', '')
      redirect('/user/login')
      return response
    }
    return response
  })
}
