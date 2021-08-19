<template>
  <div>
    <!-- Header -->
    <Header :title="currentSpace.title" :spaceTitle="currentSpace.spaceTitle"  />
    <!-- Section -->
    <section class="bg-black-three relative c_height" :class="[fullPreviewScreen ? '': '']">
      <!-- Comment Sidebar -->
      <Comment v-if="commentBox" :space="currentSpace" :feedbacks="feedbacks" :selectedSpace="selectedSpace" :spacesList="getSpaces" />
      <!-- Main Content -->
      <Content :class="[!fullPreviewScreen && !verticalPreviewScreen && !horizontalPreviewScreen ? 'c_height' : '']" />
    </section>
  </div>
</template>
<script>
import Header from '@/components/pages/screen/Header'
import Content from '@/components/pages/screen/Content'
import Comment from '@/components/pages/screen/Comment'
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  components: {
    Header,
    Content,
    Comment
  },
  data() {
    return {}
  },

  // ===================================================Before Destroy =======================================================
  beforeDestroy() {
    this._setScreenTab('play');
    this._setCommentBox(false);
    this._setScreenStatus(null);
    this._setScreenDescription(null);
    this._setFullPreviewScreen(false);
    this._setVerticalPreviewScreen(false);
    this._setHorizontalPreviewScreen(false);
    this._setScreenVersions([]);
    this._setSelectedSpace(null);
    this._setSelectedSpaceImages([]);
    this._setSelectedSpaceImageDetail([]);
    this._setSelectedSpaceUsers([]);
    this._setCompanyTeams([]);
    this._setMetaData([]);
    this._setFeedbackList([]);
    this._setCurrentUser([]);
    this._setPageNumber(0);
  },

  computed: {
    ...mapGetters("screen", {
      currentSpace: "getSelectedSpaceImageDetail",
      feedbacks: "getFeedbackList",
      screenVersions: "getScreenVersions",
      currentUser: "getCurrentUser",
      selectedSpaceImages: "getSelectedSpaceImages",
      selectedSpace: "getSelectedSpace",
      getSpaces: "getSpaces",
      commentBox: 'getCommentBoxBool',
      fullPreviewScreen: 'getFullPreviewScreen',
      verticalPreviewScreen: 'getVerticalPreviewScreen',
      horizontalPreviewScreen: 'getHorizontalPreviewScreen',
    }),
    feedbacksList() {
      return this.$store.state.app.feedbackList;
    }
  },
  async beforeRouteLeave(to, from, next) {
    await this._setSearchScreens('');
    await this._setDefaultSpace(null);
    next();
  },
  async mounted() {
  
    let data = {};
    // get all users and tags
    this._getMetaData().then((res) => {
      const keys = Object.keys(res);
      keys.forEach((item) => {
        if (res[item]) {
          data[item] = this.getKeyValuePairs(res[item], item);
        }
      });
      this.metaData = data;
    });
    await this._getCurrentUser();
    this._getSpaces().then(async res => {

      res.filter(space => {
        if (space.id === this.$route.params.projectId) {
          this._selectSpace(space)
        }
      })

      await this._getSpaceImages({ page: '', pageSize: '', spaceId: this.$route.params.projectId });
      await this._getSpaceImageDetail({ screenId: this.$route.params.screenId, projectId: this.$route.params.projectId }).then(res => {
        if(res && res.status && res.status !== 500) {
          this.setScreenStatus(res.status);
          this.setScreenDescription(res.description);
        }
      }).catch( () => {});
      await this.getFeedbackList();
      await this.getScreenVersions();
    });
   document.addEventListener('keydown', this._keyListener);
  },
  methods: {
    _keyListener(e) {
      var code = e.which || e.keyCode;
      if(code == 37){
        document.getElementById("prevArrow").click()
      }else if(code == 39){
        document.getElementById("nextArrow").click()
      }
    },
    ...mapMutations("home", {
      _setSearchScreens: "setSearchScreens",
      _setDefaultSpace: "setDefaultSpace",
    }),
    ...mapMutations("screen", {
      setLoader: 'setLoader',
      setFeedbackList: 'setFeedbackList',
      setScreenStatus: 'setScreenStatus',
      setNextScreenArrow: 'setNextScreenArrow',
      setPreviousScreenArrow: 'setPreviousScreenArrow',
      setScreenDescription: 'setScreenDescription',

      _setScreenTab: "setScreenTab",
      _setCommentBox: "setCommentBox",
      _setScreenStatus: "setScreenStatus",
      _setScreenDescription: "setScreenDescription",
      _setFullPreviewScreen: "setFullPreviewScreen",
      _setVerticalPreviewScreen: "setVerticalPreviewScreen",
      _setHorizontalPreviewScreen: "setHorizontalPreviewScreen",
      _setScreenVersions: "setScreenVersions",
      _setSelectedSpace: "setSelectedSpace",
      _setSelectedSpaceImages: "setSelectedSpaceImages",
      _setSelectedSpaceImageDetail: "setSelectedSpaceImageDetail",
      _setSelectedSpaceUsers: "setSelectedSpaceUsers",
      _setCompanyTeams: "setCompanyTeams",
      _setMetaData: "setMetaData",
      _setFeedbackList: "setFeedbackList",
      _setCurrentUser: "setCurrentUser",
      _setPageNumber: "setPageNumber",

    }),

    ...mapActions("screen", {
      _getSpaces: "getSpaces",
      _getCurrentUser: 'getCurrentUser',
      _getSpaceImageDetail: "getSpaceImageDetail",
      _getFeedbackList: "getFeedbackList",
      _getScreenVersions: "getScreenVersions",
      _getFeedbackListByStatus: "getFeedbackListByStatus",
      _createScreen: "createScreen",
      _createFeedBack: "createFeedBack",
      _createFeedBackReply: "createFeedBackReply",
      _deleteFeedBack: "deleteFeedBack",
      _deleteFeedBackReply: "deleteFeedBackReply",
      _editFeedBack: 'editFeedBack',
      _changeFeedBackStatus: 'changeFeedBackStatus',
      _updateScreenStatus: 'updateScreenStatus',
      _getSpaceImages: "getSpaceImages",
      _getMetaData: 'getMetaData',
      _selectSpace: "selectSpace",
    }),
    getFeedbackList() {
      this._getFeedbackList({ screenId: this.$route.params.screenId, projectId: this.$route.params.projectId }).then(() => {}).catch(() => {});
    },
    getScreenVersions() {
      this._getScreenVersions({ screenId: this.$route.params.screenId, projectId: this.$route.params.projectId }).then(() => {}).catch(() => {});
    },
    getKeyValuePairs(array, type) {
      let data = [];
      array.forEach((item) => {
        if (type === 'users') {
          data.push({
            text: `${item.userName}`,
            value: item.userName,
            type: 'createdBy',
          });
        } else {
          const text = type == 'tags' ? `${item}` : item;
          data.push({
            text: text,
            value: item,
            type: type == 'times' ? 'updatedOn' : type,
          });
        }
      });
      return data;
    },
  },
  watch: {
    '$route.params.screenId': async function() {

      this.setLoader(true);
      this._getSpaceImageDetail({ screenId: this.$route.params.screenId, projectId: this.$route.params.projectId }).then(res => {
        this.setLoader(false);
        if(res && res.status && res.status !== 500) {
          this.setScreenStatus(res.status);
          this.setScreenDescription(res.description);
        }
      }).catch(() => { this.setLoader(false); });


      // Check to show next button arrow or not
      const length = this.selectedSpaceImages.length;
      let key;
      this.selectedSpaceImages.find((img, index) => {
        if (img.id === this.$route.params.screenId) {
          key = index;
        }
      });

      if (key + 1 <= length) {
        // let nextId = this.selectedSpaceImages[key + 1];
        let checkNext = this.selectedSpaceImages[key + 2]
        if (checkNext === undefined) {
          this.setNextScreenArrow(false);
        } else {
          this.setNextScreenArrow(true);
        }
      }

      // Check to show back button arrow or not
      this.selectedSpaceImages.find((img, index) => {
        if (img.id === this.$route.params.screenId) {
          key = index;
        }
      });

      if (key - 1 <= length || key - 1 !== -1) {
        // let backId = this.selectedSpaceImages[key - 1];
        let checkBack = this.selectedSpaceImages[key - 2]
        if (checkBack === undefined) {
          this.setPreviousScreenArrow(false);
        } else {
          this.setPreviousScreenArrow(true);

        }
      }

      await this.getFeedbackList();
      await this.getScreenVersions();
    }
  },
}

</script>
<style>
.c_height {
  min-height: calc(100vh - 3.75rem);
}

</style>
