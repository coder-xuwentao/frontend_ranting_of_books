export default function ({ store }) {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  if (token && user&& user!=="undefined") {
    store.commit('saveToken', token)
    store.commit('saveUser', JSON.parse(user))
  }
}
