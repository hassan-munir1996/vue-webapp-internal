<template>
  <div class="text-white">
    <ScreenArrows v-if="stream" />
    <div class="flex flex-wrap items-center justify-center py-3">
      <div class="w-8 h-8 py-2 px-2 mx-1 text-center rounded-sm bg-black cursor-pointer" @click="verticalPreviewMode">
        <font-awesome-icon :icon="['fas', 'arrows-alt-v']" />
      </div>
      <div class="w-8 h-8 py-2 px-2 mx-1 text-center rounded-sm bg-black cursor-pointer" @click="horizontalPreviewMode">
        <font-awesome-icon :icon="['fas', 'arrows-alt-h']" />
      </div>
      <div class="w-8 h-8 py-2 px-2 mx-1 text-center rounded-sm bg-black cursor-pointer" @click="fullPreviewMode">
        <font-awesome-icon :icon="['fas', 'arrows-alt']" />
      </div>
    </div>
    <div class="flex items-center justify-center container_height" >
      <img :src="currentSpace.url" class="object-cover" width="400" v-if="!fullPreviewScreen && !verticalPreviewScreen && !horizontalPreviewScreen" />
      <img :src="currentSpace.url" class="object-cover h-full" v-if="verticalPreviewScreen" />
      <img :src="currentSpace.url" class="object-cover" v-if="horizontalPreviewScreen" style="min-width: 100%; height: calc(100vh - 117px)" />
      <img :src="currentSpace.url" class="object-cover h-full" v-if="fullPreviewScreen" style="min-width: 100%;" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex"
import ScreenArrows from '@/components/pages/screen/ScreenArrows'

export default {
  components: {
    ScreenArrows
  },
  data() {
    return {

    }
  },
  
  computed: {
    ...mapGetters('screen', {
      currentSpace: "getSelectedSpaceImageDetail",
      fullPreviewScreen: 'getFullPreviewScreen',
      verticalPreviewScreen: 'getVerticalPreviewScreen',
      horizontalPreviewScreen: 'getHorizontalPreviewScreen',
    }),
    stream() {
      return this.$route.path.indexOf('stream') > -1 ? false : true;
    }
  },
  methods: {
    ...mapMutations('screen', {
      setFullPreviewScreen: 'setFullPreviewScreen',
      setVerticalPreviewScreen: 'setVerticalPreviewScreen',
      setHorizontalPreviewScreen: 'setHorizontalPreviewScreen',
    }),
    fullPreviewMode() {
      this.setFullPreviewScreen(!this.fullPreviewScreen);
      this.setVerticalPreviewScreen(false);
      this.setHorizontalPreviewScreen(false);
    },
    verticalPreviewMode() {
      this.setFullPreviewScreen(false);
      this.setVerticalPreviewScreen(!this.verticalPreviewScreen);
      this.setHorizontalPreviewScreen(false);
    },
    horizontalPreviewMode() {
      this.setFullPreviewScreen(false);
      this.setVerticalPreviewScreen(false);
      this.setHorizontalPreviewScreen(!this.horizontalPreviewScreen);
    },
  }

}

</script>