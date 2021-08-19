<template>
  <div>
    <span style="display: none">{{checkArrow}}</span>
    <div id="nextArrow" @click="nextScreenHandler" v-if="nextArrow">
      <NextIcon class="fixed right-0 cursor-pointer" style="top: 50%;" />
    </div>
    <div id="prevArrow" @click="backScreenHandler" v-if="prevArrow">
      <BackIcon class="fixed left-0 cursor-pointer" style="top: 50%;" />
    </div>
  </div>
</template>
<script>
import NextIcon from '@/components/Widgets/NextIcon'
import BackIcon from '@/components/Widgets/BackIcon'
import { mapGetters, mapMutations, mapActions } from "vuex"
export default {
  components: {
    NextIcon,
    BackIcon,
  },
  data() {
    return {
      prevArrow: false,
      nextArrow: false,
      key: ''
    }
  },
  computed: {
    ...mapGetters('screen', {
      selectedSpaceImages: 'getSelectedSpaceImages',
      nextScreen: 'getNextScreenArrow',
      previousScreen: 'getPreviousScreenArrow',
    }, 'app', {
      spaceScreens: "getSpaceScreens",
    }),
    checkArrow() {
      this.key = this.getKey();
      this.checkFirstIndex(this.key);
      this.checkLastIndex(this.key);
      return this.key;
    },
  },
  methods: {
    ...mapMutations('screen', {
      setNextScreenArrow: 'setNextScreenArrow',
      setPreviousScreenArrow: 'setPreviousScreenArrow',
    }),

    getKey() {
      let key;
      this.selectedSpaceImages.find((img, index) => {
        if (img.id === this.$route.params.screenId) {
          key = index;
        }
      });
      // console.log('Key', key);
      return key;
    },

    checkFirstIndex(key) {
      if(key === 0 || key === undefined) {
        return this.prevArrow = false;
      } else {
        return this.prevArrow = true;
      }
    },
    checkLastIndex(key) {
      if(this.selectedSpaceImages[key + 1] === undefined) {
        return this.nextArrow = false;
      } else {
        return this.nextArrow = true;
      } 
    },

    async nextScreenHandler() {
      this.$router.push({ path: `/project/${this.$route.params.projectId}/screen/${this.selectedSpaceImages[this.key + 1].id}` });
    },
    async backScreenHandler() {
      this.$router.push({ path: `/project/${this.$route.params.projectId}/screen/${this.selectedSpaceImages[this.key - 1].id}` });
    },

  }
}

</script>
