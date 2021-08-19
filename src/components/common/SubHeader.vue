Skip to content
Search or jump to…

Pull requests
Issues
Marketplace
Explore

@bilalma
atharmajeed
/
vuejs-webapp
Private
2
2
0
Code
Issues
17
Pull requests
11
Actions
Projects
1
Wiki
Security
Insights
vuejs-webapp/src/components/common/SubHeader.vue
@aaqibsheikh
aaqibsheikh comment setion bug fix v3
Latest commit 51c5834 on 6 Feb
History
1 contributor
286 lines (255 sloc)  11 KB

<template>
  <div v-if="_getDefaultSpace" class="px-20 w-full" style="border-bottom: 1px solid rgb(226, 232, 240);">
    <div class="flex flex-wrap items-center pl-8 py-3 relative">

      <!-- Default Space Details -->
      <div class="w-8/12">
        <div class="flex items-center">
          <div class="relative">
            <h3 class="relative inline-block">
              <span @click="getSpaceScreens()" class="text-lg font-semibold capitalize cursor-pointer text-black-two">{{ _getDefaultSpace.title }}</span>
              <h6 class="text-xs text-black-three absolute -bottom-4 whitespace-no-wrap">{{ _getDefaultSpace.teamName }}</h6>
            </h3>
            <span class="mx-2 cursor-pointer" @click="showTitleDropdown = !showTitleDropdown" v-click-outside="closeTitleDropdown">
              <img class="inline-block mr-1" src="@/assets/arrow-drop.png" width="14" alt="Drop img" />
            </span>


            <!-- Title dropdown  -->
            <div v-if="showTitleDropdown" @onfocusout="showTitleDropdown = false" class="bg-white shadow border border-gray-100 rounded-md w-40 absolute mt-8" style="z-index: 99999; left: 0; top: 0.5rem">
              <div class="text-check-gray text-sm">
                <ul class="py-2 drop-top-arrow">
                  <li class="py-1 flex items-center pl-3 hover:bg-pale-grey-two cursor-pointer" v-ripple="'rgba(0, 0, 0, .05)'">
                    <span class="flex justify-center items-center h-6 w-6 mr-2">
                      <img class="inline-block mr-1" src="@/assets/icon-active.png" width="14" alt="Active img" />
                    </span>
                    <span class="w-5/6 inline-block py-1" to="/">Archive</span>
                  </li>
                  <li class="py-1 flex items-center pl-3 hover:bg-pale-grey-two cursor-pointer" v-ripple="'rgba(0, 0, 0, .05)'" @click="deleteSpace(); showTitleDropdown = !showTitleDropdown">
                    <span class="flex justify-center items-center h-6 w-6 mr-2">
                      <img class="inline-block mr-1" src="@/assets/icon-d.png" width="14" alt="Active img" />
                    </span>
                    <span class="w-5/6 inline-block py-1" to="/">Delete</span>
                  </li>
                  <li class="py-1 flex items-center pl-3 hover:bg-pale-grey-two cursor-pointer" v-ripple="'rgba(0, 0, 0, .05)'" @click="showUpdateSpaceModal(); showTitleDropdown = !showTitleDropdown">
                    <span class="flex justify-center items-center h-6 w-6 mr-2">
                      <img class="inline-block mr-1" src="@/assets/file.png" width="14" alt="Active img" />
                    </span>
                    <span class="w-5/6 inline-block py-1" to="/">Update</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- <div class="flex"> -->
          <template v-for="(spaceUser, index) in _getSpaceUsers">
            <div :key="index" class="cursor-pointer -ml-2 border-2 border-white bg-white-two rounded-full h-8 w-8 flex flex-wrap items-center justify-center" v-if="index < 4">
              <span class="text-xs text-brownish-grey">{{ spaceUser.firstName.slice(0, 2).toUpperCase() }}</span>
            </div>
          </template>
          <!-- </div> -->
          <div @click="showSpaceUserDropdown = !showSpaceUserDropdown" v-click-outside="closeSpaceUserDropdown" class="cursor-pointer -ml-2 border-2 border-white bg-topaz rounded-full h-8 w-8 flex flex-wrap items-center justify-center" v-if="(_getSpaceUsers.length - 4) > 0">
            <span class="text-xs text-white">+{{ _getSpaceUsers.length - 4 }}</span>
          </div>
          <!-- User dropdown -->
          <div v-if="showSpaceUserDropdown" class="bg-white shadow border border-gray-100 rounded-md w-48 absolute mt-6" style="z-index: 99999; left: 8rem; top: 2.1rem;">
            <div class="text-check-gray text-sm">
              <ul class="py-2 drowp-down-e drop-top-arrow">
                <template v-for="(spaceUser, index) in _getSpaceUsers">
                  <li class="py-2 flex items-center pl-3 hover:bg-pale-grey-two" v-ripple="'rgba(0, 0, 0, .05)'" v-bind:key="index" v-if="index >= 4">
                    <span class="flex justify-center items-center h-6 w-6 rounded-full bg-gray-6  mr-2">{{ spaceUser.firstName.slice(0, 2).toUpperCase() }}</span>
                    <router-link class="w-5/6 inline-block py-1" to="/">{{spaceUser.firstName}}</router-link>
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div @click="showInviteUserModal" class="cursor-pointer border-dots rounded-full flex items-center justify-center -mt-2 h-7 w-7 ml-1">
            <img class="inline-block mr-1" src="@/assets/plus-icon.png" width="16" alt="Plus img" />
          </div>
        </div>

        <!-- Team Name -->
        <!-- <h6 class="text-xs text-black-three" v-if="checkTeamName">{{ _getDefaultSpace.teamName }}</h6> -->
      </div>
      <!-- Add new image -->
      <div class="w-2/6 pt-1 relative">
        <button @click="showImageDropdown = !showImageDropdown; focusImageDropdown()" class="bg-savah-green text-white px-4 py-2 rounded-full float-right focus:outline-none">
          <div class="flex items-center">
            <span>
              <font-awesome-icon class="font-thin" :icon="['fas', 'plus']" style="font-size: 12px;" />
            </span>
            <span>
              <div class="align-middle text-xs ml-1"> Add New Image</div>
            </span>
          </div>
        </button>
        <div
            ref="uploadDropdown"
            tabindex="0"
            v-if="showImageDropdown"
            @blur="showImageDropdown=false"
            class="bg-white shadow-lg border border-gray-100 mt-2 rounded-md w-48 absolute mt-10 focus:outline-none"
            style="right: 0;z-index: 99999;"
        >
          <div class="text-check-gray text-sm">
            <ul class="py-4">
              <li class="py-2 px-5 cursor-pointer hover:bg-pale-grey-two" @click="setUploadMode(1); setUploadImage()">
                <font-awesome-icon class="font-thin text-brownish-grey" :icon="['fas', 'tv']" style="font-size: 16px;" />
                <span class="ml-2">Computer</span>
              </li>
              <li class="py-2 px-5 cursor-pointer hover:bg-pale-grey-two" @click="setUploadMode(2)">
                <font-awesome-icon class="font-thin text-bright-blue" :icon="['fab', 'dropbox']" style="font-size: 18px;" />
                <span class="ml-2">Dropbox</span>
              </li>
              <li class="py-2 px-5 cursor-pointer hover:bg-pale-grey-two">
                <font-awesome-icon class="font-thin text-medium-green" :icon="['fab', 'google-drive']" style="font-size: 18px;" />
                <span class="ml-2">Google Drive</span>
              </li>
              <li class="py-2 px-5 cursor-pointer hover:bg-pale-grey-two">
                <font-awesome-icon class="font-thin text-orange-yellow" :icon="['fab', 'sketch']" style="font-size: 18px;" />
                <span class="ml-2">Sketch Plugin</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="cursor-pointer float-right mx-4 text-center" @click="openShareSpaceModal">
          <img class="inline-block" src="@/assets/icon-share.png" width="35" alt="Share img" />
        </div>
      </div>

    </div>
    <ShareSpaceModal v-if="isDomReady" />
    <InviteUserModal v-if="isDomReady" />
    <UpdateSpaceDetailsModal v-if="isDomReady" />
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { EE } from "@/helpers/eventEmitter.js";
import InviteUserModal from '@/components/modal/InviteUserModal';
import ShareSpaceModal from "@/components/modal/ShareSpaceModal";
import UpdateSpaceDetailsModal from "@/components/modal/UpdateSpaceDetailsModal";
export default {
  // ===================================================Components=======================================================
  components: {
    InviteUserModal,
    ShareSpaceModal,
    UpdateSpaceDetailsModal,
  },
  // ===================================================Data=======================================================
  data() {
    return {
      isDomReady: false,
      showTitleDropdown: false,
      showSpaceUserDropdown: false,
      showImageDropdown: false,
    }
  },
  // ===================================================Mounted=======================================================
  mounted() {
    this.isDomReady = true;
  },

  // ===================================================Computed=======================================================
  computed: {
    ...mapGetters("home", {
      _getDefaultSpace: "getDefaultSpace",
      _getSpaceUsers: "getSpaceUsers",
      _getSpaceScreens: "getSpaceScreens",
    }),
    checkTeamName() {
      return (this._getDefaultSpace && this._getDefaultSpace.teamName !== null) ? true : false;
    }
  },
  // ===================================================Methods=======================================================
  methods: {
    ...mapMutations("app", {
      setLoader: 'setLoader',
    }),
    ...mapActions("home", {
      _deleteSpace: "deleteSpace",
    }),
    // Share Space Modal
    openShareSpaceModal() {
      VoerroModal.show('share-space-modal');
    },
    // Close Upload Image Dropdown Modal
    focusImageDropdown() {
      setTimeout(() => {
        if(this.$refs.uploadDropdown) {
          this.$refs.uploadDropdown.focus()
        }
      }, 100);
    },
    // when any space is clicked other then stream
    getSpaceScreens() {
      if(this._getSpaceScreens.length !== 0) {
        EE.emit("isUpload", false);
      }
    },
    // Title Dropdown
    closeTitleDropdown() {
      this.showTitleDropdown = false;
    },
    // Space Users Dropdown
    closeSpaceUserDropdown() {
      this.showSpaceUserDropdown = false;
    },
    // Invite Modal
    showInviteUserModal() {
      VoerroModal.show('invite-user-modal');
    },
    // Update space details modal
    showUpdateSpaceModal() {
      VoerroModal.show('update-space-details-modal');
    },
    // Set Upload Mode
    setUploadMode() {
      this.showImageDropdown = false;
    },
    // Delete default space
    deleteSpace() {
      this.setLoader(true);
      return this._deleteSpace(this._getDefaultSpace.id)
          .then(res => {
            this.setLoader(false);
            this.$toast.open({
              message: "Space deleted",
              type: "success",
              position: "top-right",
              queue: false
            });
            this.$router.push(`/`)
            return res;
          })
          .catch(err => {
            this.setLoader(false);
            throw err;
          });
    },
    setUploadImage() {
      EE.emit('isUpload', true);
    },
  }
}
</script>
<style>
.border-dots {
  border: 1px dotted #1a99aa;
  height: 29px;
  width: 29px;
  line-height: 24px;
  margin-top: 0;
  position: relative;
  top: 4px;
}
.border-dots img {
  position: relative;
  left: 1px;
}
.drop-top-arrow {
  @apply relative;
}
.drowp-down-e li span {
  font-size: 10px;
  font-weight: 600;
}
.drowp-down-e li a {
  font-size: 13px;
}
</style>
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
Loading complete