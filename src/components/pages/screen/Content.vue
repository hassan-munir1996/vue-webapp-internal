<template>
  <div>
    <PlayTab v-if="tab === 'play'" />
    <CommentTab v-if="tab === 'comments'" />
    <HistoryTab v-if="tab === 'history'" />
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import PlayTab from '@/components/pages/screen/PlayTab'
import CommentTab from '@/components/pages/screen/CommentTab'
import HistoryTab from '@/components/pages/screen/HistoryTab'

export default {
  components: {
    PlayTab,
    CommentTab,
    HistoryTab
  },
  computed: {
    ...mapGetters('screen', {
      tab: 'getScreenTab',
    }),
  }
}

</script>
