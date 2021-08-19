<template>
  <div class="flex items-center justify-center h-full cursor-pointer">
    <div class="text-center w-24 py-3" @click="toogleTab('play')" :class="[tab == 'play' ? 'bg-savah-green text-white' : 'inactive-text']">
      <div class="flex items-center justify-center flex-wrap h-full">
        <div class="w-full">
          <div>
            <img class="mx-auto" src="@/assets/ic-tab-play-active.svg" v-if="tab == 'play'" />
            <img class="mx-auto" src="@/assets/ic-tab-play.svg" v-else />
          </div>
          <div class="text-xs mt-1 ">PLAY</div>
        </div>
      </div>
    </div>
    <!-- <div class="text-center w-24 py-3" @click="toogleTab('comments')" :class="[tab == 'comments' ? 'bg-savah-green text-white' : 'inactive-text']">
      <div class="flex content-center flex-wrap h-full">
        <div class="w-full">
          <div>
            <img class="mx-auto" src="@/assets/ic-tab-comments-active.svg" v-if="tab == 'comments'" />
            <img class="mx-auto" src="@/assets/ic-tab-comments.svg" v-else />
          </div>
          <div class="text-xs mt-1">COMMENTS</div>
        </div>
      </div>
    </div> -->
    <div class="text-center w-24 py-3" @click="toogleTab('history')" :class="[tab == 'history' ? 'bg-savah-green text-white' : 'inactive-text']">
      <div class="flex content-center flex-wrap h-full">
        <div class="w-full">
          <div>
            <img class="mx-auto" src="@/assets/ic-tab-history-active.svg" v-if="tab == 'history'" />
            <img class="mx-auto" src="@/assets/ic-tab-history.svg" v-else />
          </div>
          <div class="text-xs mt-1">HISTORY</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters('screen', {
      tab: 'getScreenTab'
    }),
  },
  methods: {
    ...mapMutations('screen', {
      setScreenTab: 'setScreenTab',
      setCommentBox: 'setCommentBox'

    }),
    toogleTab(tab) {
      this.setScreenTab(tab);
      this.setCommentBox(false);

    },
  }
}

</script>
