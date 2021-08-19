<template>
  <header class="h-14 bg-black grid grid-cols-3 text-white px-4">
    <div>
      <div class="flex items-center justify-start h-full">
        <div class="cursor-pointer" @click="goHome">
          <img src="@/assets/ic-logo-savah-white.svg" alt="logo" class="mr-6" />
        </div>
        <div class="cursor-pointer" @click="goHome">
          <img src="@/assets/ic-home.svg" alt="icon" />
        </div>
        <div>
          <img class="ml-6" src="@/assets/ic-arrow-breadscrumb.svg" />
        </div>
        <div>
          <div class="ml-6 text-sm cursor-pointer" @click="goHome">{{spaceTitle}}</div>
        </div>
        <div>
          <img class="ml-6" src="@/assets/ic-arrow-breadscrumb.svg" />
        </div>
        <div class = "tooltip">
<!--          //screen title-->
          <div v-if="title.length<12">{{title}}</div>
          <span class  ="tooltiptext">{{title}}</span>
          <div v-if="title.length>=12"> {{ title.substring(0,12)+".." }}</div>
<!--          <div class="ml-6 text-sm cursor-pointer">{{title}}</div>-->
        </div>
        <div>
          <CreateNewScreen />
        </div>
      </div>
    </div>
    <div>
      <ScreenTabs />
    </div>
    <div>
      <div class="flex items-center justify-end h-full">
        <div v-if="tab !== 'history' && (_getMetaData.hasOwnProperty('tags') || _getMetaData.hasOwnProperty('users'))">
          <div class="flex content-center flex-wrap h-full">
            <div class="bg-savah-green rounded-lg px-3 py-2 cursor-pointer" @click="toggleCommentBox">{{countFeedbacks}} Comments</div>
          </div>
        </div>
        <div class="border-r border-black-three h-full ml-4"></div>
        <StatusIcon />
        <form enctype="multipart/form-data">
          <input class="hidden" @change="fileseleted" type="file" ref="uploadScreen" />
        </form>
        <img class="ml-4 cursor-pointer" src="@/assets/ic-upload.svg" @click="$refs.uploadScreen.click()" />
        <img class="ml-4" src="@/assets/ic-help.svg" />
      </div>
    </div>
  </header>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import StatusIcon from '@/components/Widgets/StatusIcon';
import ScreenTabs from '@/components/pages/screen/ScreenTabs';
import CreateNewScreen from '@/components/pages/screen/CreateNewScreen';
import { EE } from "@/helpers/eventEmitter.js";

export default {
  props: ['title', 'spaceTitle'],
  components: {
    ScreenTabs,
    StatusIcon,
    CreateNewScreen,
  },

  data() {
    return {
      showComment: false,
    }
  },

  mounted() {
    EE.on("imageDetails", (data) => {
      this.showComment = data;
    });
  },

  computed: {
    ...mapGetters('screen', {
      tab: 'getScreenTab',
      feedbacks: "getFeedbackList",
      commentBox: 'getCommentBoxBool',
      _getMetaData: 'getMetaData',
    }),
    countFeedbacks() {
      return this.feedbacks.length > 0 ? this.feedbacks.length : 0;
    }
  },
  methods: {
    ...mapMutations('screen', {
      setLoader: 'setLoader',
      setCommentBox: 'setCommentBox'
    }),
    ...mapActions('screen', {
      _createScreen: "createScreen",
    }),
    goHome() {
      this.$router.push(`/${this.$route.params.projectId}`)
    },
    toggleCommentBox() {
      this.setCommentBox(!this.commentBox);
    },
    fileseleted(evt) {
      this.setLoader(true);
      const formData = new FormData();
      formData.append("file", evt.target.files[0]);
      this._createScreen({ file: formData, projectId: this.$route.params.projectId }).then(res => {
        this.$router.push({ path: `/project/${this.$route.params.projectId}/screen/${res.id}` });
        this.$toast.open({
          message: "Screen created successfuly",
          type: "success",
          position: "top-right",
          queue: true
        })
        this.setLoader(false);
        this.showUploadVersionDropDown = false;

        return res
      }).catch(err => {
        this.setLoader(false);
        this.showUploadVersionDropDown = false;
        this.$toast.open({
          message: "Couldn't create screen. Try again." + err,
          type: "error",
          position: "top-right",
          queue: true
        })
      })

    },
  }
}

</script>
<style>
.tooltip {
  position: relative;
  display: inline-block;
  font-size: .875rem;
  margin-left: 1.6rem;
  cursor:pointer;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>