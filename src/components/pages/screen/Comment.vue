<template>
  <!-- Comments Sidebar -->
  <aside class="flex flex-col bg-white text-black-three absolute right-0 top-0 h-full z-20 w-1/4 overflow-scroll overflow-x-hidden" id="scroll-style">
    <div class="w-full bg-pale-gray py-3 px-6 flex items-center justify-between h-14">
      <!-- <div class="text-lg font-medium space-title">{{ space.title }}</div> -->
      <!-- Resolve & Resolved Radio button -->
      <div class="flex flex-wrap items-center">
        <!-- <div class="mr-3" v-if="feedbacks.length">
          <input type="radio" name="radio" class="hidden resolveRadioButton" :value="false" v-model="selectAnswer" />
          <label class="flex items-center cursor-pointer" @click="toggleStatus(false); resolveStatus=false;">
            <span class="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" v-bind:class="{ 'bg-savah-green' : resolveStatus === false}"></span>
            Resolve
          </label>
        </div> -->
        <div v-if="feedbacks.length !== 0">
          <input type="checkbox" class="hidden resolveRadioButton" :value="!resolveStatus" v-model="selectAnswer" />
          <label class="flex items-center cursor-pointer" @click="resolveStatus=!resolveStatus;toggleStatus(!resolveStatus); ">
            <span class="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" v-bind:class="{ 'bg-savah-green': resolveStatus === true}"></span>
            Resolved</label>
        </div>
      </div>
      <!-- **************************** -->
      <img class="cursor-pointer" src="@/assets/close.svg" @click="closeCommentBox" />
    </div>
    <!-- User image, screen description -->
    <div class="w-full px-6 border-b border-light-gray">
      <div class="flex flex-wrap items-center w-full">
        <img v-if="space.createdByAvatar" :src="space.createdByAvatar" class="h-12 w-12 mr-4 rounded-full size40" />
        <img v-else src="@/assets/dummy_avatar.jpg" class="h-12 w-12 mr-4 rounded-full size40" />
        <div class="relative">
          <h3 class="font-semibold">{{ space.createdBy }}</h3>
          <span v-if="selectedSpace">Shared in {{ selectedSpace.title }}</span>
          <div class="inline-block cursor-pointer ml-2" v-click-outside="closeSpacesDropDown">
            <span @click="showSpacesDropDown = !showSpacesDropDown">
              <font-awesome-icon :icon="['fas', 'sort-down']" />
            </span>
            <div v-if="showSpacesDropDown" class="bg-white shadow-lg border border-gray-300 mt-2 rounded-md w-48 absolute right-0 py-3" style="z-index: 99999">
              <div class="text-black text-sm">
                <ul>
                  <li class="hover:bg-pale-grey-two" v-ripple="'rgba(0, 0, 0, .05)'" v-for="(space, index) in spacesList" :key="index">
                    <span class="block py-2 mx-5" v-if="selectedSpace && space.title !== selectedSpace.title">{{ space.title }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="my-4 w-full block">
          <vue-tribute ref="tribute" :options="options">
            <div 
              v-show="_getImageDetailStatus"
              v-html="screenDescription"
              ref='description'
              class="textArea rounded-md"
              id="wrapper"
              @keyup="checkTribute"
              @focusout="onEdit"
              placeholder="Add a description, tags and annotate user."
            >
            </div>
          </vue-tribute>
        </div>
      </div>
    </div>
    <!-- ************************ -->
    <div class="flex-grow flex flex-col">
      <!-- Comment Area -->
      <div class="p-4 w-full flex-grow" id="scroll-style" v-if="feedbacks.length">
        <div v-for="(feedback, index) in feedbacks" :key="feedback.feedBackId">
          <!-- {{feedback.title}} -->
          <template>
            <div class="grid grid-rows-1 grid-flow-col row-gap-2 mt-1">
              <div class="row-span-3 col-span-1 w-12">
                <img :src="feedback.user.profilePic" alt="user" class="img-circle m-auto rounded-full" width="30" />
              </div>
              <div class="row-span-1 col-span-12 text-sm font-medium">
                <div class="mt5">
                  {{ feedback.user.firstName + ' ' + feedback.user.lastName }}
                </div>
                <div class="bg-pale-gray border border-light-gray rounded-lg p-2 mt-2">
                  <div class="text-sm font-medium inline-block">
                    {{ feedback.title }}
                    <template v-if="feedback.user.id !== null">
                      <img @click="openEditFeedbackBox(index, feedback, null)" v-if="currentUser.id !== feedback.user.id" class="inline-block cursor-pointer" src="@/assets/edit.svg" width="16" height="16" alt="" />
                    </template>
                  </div>
                  <div class="flex justify-between text-xs mt-3">
                    <div class="text-gray-500">
                      {{ feedback.createdOnStr }}
                    </div>
                    <div>
                      <div class="flex cursor-pointer">
                        <template v-if="feedback.user.id !== null">
                          <div @click="deleteFeedback(feedback.feedBackId)" class="mr-3 text-red-500 delete" v-if="currentUser.id == feedback.user.id">
                            Delete
                          </div>
                        </template>
                        <div class="mr-3 text-gray-500" @click="changeFeedBackStatus(feedback)">
                          {{ feedback.completed ? 'Resolved' : 'Resolve' }}
                        </div>
                        <div class="text-savah-green" @click="openFeedbackReplyBox(index)">
                          Reply
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="feedback && feedback.comments && feedback.comments.length > 0">
            <div v-for="(comment) in feedback.comments" :key="comment.commentId" class="grid grid-rows-1 grid-flow-col row-gap-2 mt-5" :class="[true ? 'lg:pl-20 md:pl-8 pl-32' : '']">
              <template v-if="comment.user">
                <div class="row-span-3 col-span-1 w-12">
                  <img :src="comment.user.profilePic" alt="user" class="img-circle m-auto rounded-full" width="30" />
                </div>
                <div class="row-span-1 col-span-12 text-sm font-medium">
                  <div class="mt5">
                    {{ comment.user.firstName + ' ' + comment.user.lastName }}
                  </div>
                  <div class="bg-pale-gray border border-light-gray rounded-lg p-2 mt-2">
                    <div class="text-sm font-medium inline-block">
                      {{ comment.comment }}
                    </div>
                    <div class="flex justify-between text-xs mt-3">
                      <div class="text-blue-gray">{{ comment.createdOn }}</div>
                      <div>
                        <div class="flex cursor-pointer">
                          <template v-if="comment.user.id !== null">
                            <div @click="
                                deleteFeedbackReply(
                                  feedback.feedBackId,
                                  comment.commentId
                                )
                              " class="mr-3 text-red-500 delete" v-if="currentUser.id == comment.user.id">
                              Delete
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="w-full mt-6" v-if="hasReply === index">
            <textarea v-model="feedbackReply" class="appearance-none block w-full text-black-three savah-border rounded-lg py-3 px-4 leading-tight font-normal textArea" placeholder="Add a reply"></textarea>
            <div class="flex justify-end">
              <div class="bg-savah-green rounded-lg px-3 py-2 cursor-pointer text-white mt-3" @click="createFeedbackReply(feedback)">
                Leave Reply
              </div>
            </div>
          </div>
          <div class="w-full mt-6" v-if="hasEdit === index">
            <textarea v-model="editFeedbackTitle" class="appearance-none block w-full text-black-three savah-border rounded-lg py-3 px-4 leading-tight font-normal textArea" placeholder="Doe"></textarea>
            <div class="flex justify-end">
              <div class="bg-savah-green rounded-lg px-3 py-2 cursor-pointer text-white mt-3" @click="editFeedBack">
                Edit
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex-grow flex flex-wrap items-center justify-center">
        <img src="@/assets/empty-comment.png" class="inline-block" />
      </div>
      <div class="bg-white w-full p-4 border-t border-light-gray self-end">
        <div class="w-full">
          <textarea v-model="title" required v-on:keyup="checkForSuggestion" class="appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none bg-white text-sm textArea" placeholder="Add new comment"></textarea>
          <ul v-if="suggestionsList.length > 0 && title.length > 0" class="suggestions">
            <li v-for="(suggestion, index) in suggestionsList" :key="index">
              {{ suggestion }}
            </li>
          </ul>
          <div class="flex justify-end">
            <div @click="createFeedBack" class="bg-savah-green rounded-lg px-3 py-2 cursor-pointer text-white mt-3 ">
              Leave Comment
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import VueTribute from 'vue-tribute';

export default {
  props: ['space', 'feedbacks', 'selectedSpace', 'spacesList'],
  components: {
    VueTribute
  },

  mounted() {
    // console.log('tribute', this.$refs.tribute);
    this.options.collection[0].values = this.userSuggestionValues;
    this.options.collection[1].values = this.tagsSuggestionValues;
  },

  beforeDestroy() {
    // this.$refs.tribute.detach(document.getElementById("wrapper"));
  },

  data() {
    return {
      options: {
        collection: [
          {
            trigger: "@",
            values: this.userSuggestionValues,
            positionMenu: true,
            menuContainer: document.getElementById('wrapper'),
            selectTemplate: function(item) {
              if (this.range.isContentEditable(this.current.element)) {
                return (
                  '<span class="text-topaz font-bold">@' +
                  item.original.value +
                  '</span>'
                );
              }
              return "@" + item.original.value;
            },
            selectClass: '',
            containerClass: 'tribute-container shadow-md border border-gray-300 bg-white rounded-md py-4 z-30',
            itemClass: 'px-4 py-1 cursor-pointer hover:bg-pale-grey-two',
          },
          {
            trigger: "#",
            values: this.tagsSuggestionValues,
            menuItemLimit: 5,
            positionMenu: true,
            menuContainer: document.getElementById('wrapper'),
            selectTemplate: function(item) {
              if (this.range.isContentEditable(this.current.element)) {
                return (
                  '<span class="text-topaz font-bold">#' +
                  item.original.value +
                  '</span>'
                );
              }

              return "#" + item.original.value;
            },
            selectClass: '',
            containerClass: 'tribute-container shadow-md border border-gray-300 bg-white rounded-md py-4 z-30',
            itemClass: 'px-4 py-1 cursor-pointer hover:bg-pale-grey-two',
          }
        ]
      },
      title: null,
      hasEdit: null,
      hasReply: null,
      resolveStatus:null,
      selectAnswer: null,
      feedbackReply: null,
      editFeedbackTitle: '',
      suggestionsList: [],
      isEditingFeedback: null,
      showSpacesDropDown: false,
      isEditingFeedbackReply: null,
    }
  },

  computed: {
    ...mapGetters('screen', {
      currentUser: 'getCurrentUser',
      commentBox: 'getCommentBoxBool',
      screenDescription: 'getScreenDescription',
      _getMetaData: 'getMetaData',
      _getImageDetailStatus: "getImageDetailStatus",
    }),

    userSuggestionValues() {
      // console.log()
      return this._getMetaData['users'] ? this._getMetaData['users'].map(user =>  {return {key: user.userName, value: user.userName}} ) : [];
    },

    tagsSuggestionValues() {
      return this._getMetaData['tags'] ? this._getMetaData['tags'].map(tag =>  {return {key: tag, value: tag}} ) : [];
    },
  },

  methods: {
    ...mapMutations('screen', {
      setLoader: 'setLoader',
      setCommentBox: 'setCommentBox',
      setScreenDescription: 'setScreenDescription',
    }),

    ...mapActions('screen', {
      _editFeedBack: 'editFeedBack',
      _createFeedBack: 'createFeedBack',
      _deleteFeedBack: 'deleteFeedBack',
      _getFeedbackList: 'getFeedbackList',
      _updateScreenStatus: 'updateScreenStatus',
      _createFeedBackReply: 'createFeedBackReply',
      _deleteFeedBackReply: 'deleteFeedBackReply',
      _getFeedbackListByStatus: 'getFeedbackListByStatus',
      _changeFeedBackStatus: 'changeFeedBackStatus',
    }),

    checkTribute() {
      // console.log('tribute', this.$refs.tribute.tribute, this.$refs.tribute.tribute.currentMentionTextSnapshot)
    },

    toggleCommentBox() {
      this.setCommentBox(true)
    },

    closeCommentBox() {
      this.setCommentBox(false)
    },

    closeSpacesDropDown() {
      this.showSpacesDropDown = false
    },

    async onEdit(event) {

      // regex for extracting # unique tags
      let tagsSet = new Set();
      event.target.innerHTML.match(/#\w+/gi)?.forEach(tag => tagsSet.add(tag));

      // regex for extracting @ unique users
      let usersSet = new Set();
      event.target.innerHTML.match(/(@)(?:\S+) \w+/gi)?.forEach(tag => usersSet.add(tag))
      
      // console.log('users', [...tagsSet], [...usersSet]);

      this._updateScreenStatus({
          id: this.$route.params.screenId,
          projectId: this.$route.params.projectId,
          description: event.target.innerHTML,
          tags: [...tagsSet],
          users: [...usersSet],
        })
        .then((res) => {})
        .catch((err) => {})
    },

    toggleStatus(status) {
      this.selectAnswer = status
      this.setLoader(true)
      const data = {
        status: status,
        projectId: this.$route.params.projectId,
      }
      this._getFeedbackListByStatus(data)
        .then(() => {
          this.setLoader(false)
        })
        .catch(() => {
          this.setLoader(false)
        })
    },

    openEditFeedbackBox(index, feedback, comment) {
      this.hasEdit = index
      this.hasReply = null
      if (comment !== null) {
        this.editFeedbackTitle = comment.comment
        this.isEditingFeedbackReply = {
          feedBackId: feedback.feedBackId,
          commentId: comment.commentId,
        }
        this.isEditingFeedback = null
      } else {
        this.editFeedbackTitle = feedback.title
        this.isEditingFeedback = { feedBackId: feedback.feedBackId }
        this.isEditingFeedbackReply = null
      }
    },

    deleteFeedback(feedBackId) {
      this._deleteFeedBack({
          feedBackId: feedBackId,
          projectId: this.$route.params.projectId,
          screenId: this.$route.params.screenId,
        })
        .then(() => {
          // return res
        })
        .catch(() => {})
    },

    deleteFeedbackReply(feedBackId, commentId) {
      this._deleteFeedBackReply({
          commentId: commentId,
          feedBackId: feedBackId,
          projectId: this.$route.params.projectId,
          screenId: this.$route.params.screenId,
        })
        .then(() => {
          // return res
        })
        .catch(() => {})
    },

    changeFeedBackStatus(feedback) {
      let status = feedback.completed ? false : true
      this._changeFeedBackStatus({
          id: feedback.feedBackId,
          projectId: this.$route.params.projectId,
          screenId: this.$route.params.screenId,
          completed: status,
          title: feedback.title,
        })
        .then(() => {
          this.getFeedbackList()
          // return res
        })
        .catch(() => {})
    },

    getFeedbackList() {
      this._getFeedbackList({
        screenId: this.$route.params.screenId,
        projectId: this.$route.params.projectId,
      }).then(() => {})
    },

    openFeedbackReplyBox(index) {
      this.hasReply = index
      this.hasEdit = null
    },

    createFeedbackReply(feedback) {
      this._createFeedBackReply({
          title: this.feedbackReply,
          projectId: this.$route.params.projectId,
          screenId: this.$route.params.screenId,
          feedBackId: feedback.feedBackId,
        })
        .then(() => {
          this.feedbackReply = null
          this.hasReply = null
        })
        .catch(() => {
          // console.log('err', err);
        })
    },

    editFeedBack() {
      if (this.isEditingFeedback !== null) {
        this._editFeedBack({
            id: this.isEditingFeedback.feedBackId,
            projectId: this.$route.params.projectId,
            screenId: this.$route.params.screenId,
            title: this.editFeedbackTitle,
          })
          .then(() => {
            this.editFeedbackTitle = null
            this.getFeedbackList()
            // return res
          })
          .catch(() => {})
      }

      if (this.isEditingFeedbackReply !== null) {
        this._editFeedBack({
            // commentId: this.isEditingFeedbackReply.commentId,
            feedBackId: this.isEditingFeedbackReply.feedBackId,
            projectId: this.$route.params.projectId,
            screenId: this.$route.params.screenId,
            title: this.editFeedbackTitle,
          })
          .then(() => {
            this.editFeedbackTitle = null
            this.getFeedbackList()
            // return res
          })
          .catch(() => {})
      }
    },

    createFeedBack() {
      if (this.title) {
        this._createFeedBack({
            title: this.title,
            projectId: this.$route.params.projectId,
            screenId: this.$route.params.screenId,
            completed: false,
          })
          .then(() => {
            this.title = null
            // return res
          })
          .catch(() => {})
      }
    },

    checkForSuggestion(e) {
      if (e.keyCode === 51) {
        if (this.space.tags) {
          this.suggestionsList = this.space.tags
        } else {
          this.suggestionsList = []
        }
      } else if (e.keyCode === 50) {
        // eslint-disable-next-line no-undef
        Get('/api/v1/company/users')
          .then(() => {
            // console.log('users', res)
          })
          .catch((err) => {
            return err
          })
      }
    },
  },
}

</script>
<style scoped>
.bg-pale-gray{
  background : #f9f9fb;
}
.mt5{
  margin-top : 5px;
}
.size40{
  width: 40px;
  height: 40px;
}
.space-title {
  width: calc(100% - 225px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
