import { mapState } from 'vuex'
const host = 'http://localhost:1337'

export default {
  data() {
    return {
      HOST:host,
    }
  },
  computed:{
    ...mapState(["tokenInStore","userInStore"])
  },
}
