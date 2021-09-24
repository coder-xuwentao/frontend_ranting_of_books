<template>
  <div>
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      controls
      indicators
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <!-- Text slides with image -->
      <b-carousel-slide
        :img-src="HOST+item.cover[0].url"
        v-for="item in listAd"
        :key="item.id"
        @click="location.href=item.url"
      ></b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slide: 0,
      sliding: null,
      listAd:[]
    }
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true
    },
    onSlideEnd(slide) {
      this.sliding = false
    },

    async getListAd() {
      let res = await this.$axios.get(`/advertisings`)
      if (res.status === 200) {
        this.listAd = res.data
      }
    },
  },
  mounted() {
    this.getListAd()
  },
}
</script>