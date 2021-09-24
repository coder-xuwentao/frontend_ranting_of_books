export const state = () => ({
  tokenInStore: '',
  userInStore: {},
})

export const mutations = {
  saveToken(state, token) {
    state.tokenInStore = token
  },
  saveUser(state, user) {
    state.userInStore = user
  },
  allClear(state) {
    state.tokenInStore = ''
    state.userInStore = {}
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },
  signIn(state, { token, user }) {
    state.tokenInStore = token
    state.userInStore = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },
}
