<template>
  <div class="w-full">
    <Sidebar  />
    <Header />
    <SubHeader v-if="checkSearchScreens" />
    <div class="px-20 w-full">
      <ScreenView v-if="!isUpload" class="mb-10" ref="screenview" />
      <ImageUpload v-else />

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { EE } from "@/helpers/eventEmitter.js";
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import SubHeader from '@/components/common/SubHeader'
import ScreenView from "@/components/Widgets/ScreenView.vue";
import ImageUpload from "@/components/Widgets/ImageUpload.vue";

export default {
  // ===================================================Components=======================================================
  components: {
    Sidebar,
    Header,
    SubHeader,
    ScreenView,
    ImageUpload,
  },
  
  // ===================================================Data=======================================================
  data() {
    return {
      pageSize: 15,
      keywords: [],
      isUpload: false,
      newSpace: false,
      requestSearch: false,
      requestSpace: false,
      requestUsers: false,
      searchController: null,
      spaceController: null,
      userController: null,
      noMoreSearchScreens: false,
      noMoreSpaceScreens: false,
    }
  },
  // ===================================================Created=======================================================
  created() {
    // console.log('Created')
    this._setLoader(true);
    this.resetSearchScreens();
    this.resetSpaceScreens();
    this._fetchAllSpaces().then( ()=> {
      this._fetchMetaData().then( () => {
        EE.emit('fetchMetaDataCompleted');
      });
      this._fetchAllCompanyTeams();
      this.fetchScreens(this.$route.params.id || null);
    });
  },

  // ===================================================Mounted=======================================================
  mounted() {
    this.keywords = [];
    // if user search screens from search dropdown 
    EE.on('searchScreens', async (keywords) => {

      await this.resetSearchScreens();
      EE.emit("noMoreScreens", false);
      this.keywords = keywords;
      this.noMoreSearchScreens = false;

      if(keywords.length !== 0) {
        this.fetchSearchScreens();
      } else  {
        // Abort Previous Fetch calls if their response is not yet received
        this.searchController.abort();
        this.requestSearch = false;
        
        if(!this._getDefaultSpace) {
          this.fetchSearchScreens();
        } else {
          if(this._getSpaceScreens.length !== 0) {
            this.isUpload = false;
          } else {
            this.isUpload = true;
          }
        }
      }
    });

    // If all files are uploaded
    EE.on("allFilesUploaded", (uploadedFilesLength) => {
      if(uploadedFilesLength !== 0) {
        // console.log('All Files Uploaded');
        this.resetSpaceScreens();     // Reset Space Screens in store
        this.resetSearchScreens();    // Reset Search Screens in store
        this.isUpload = false;        // set isUpload flag value
        this.noMoreSearchScreens = false;
        this.noMoreSpaceScreens = false;
        EE.emit("noMoreScreens", false);
        this.fetchScreens(this.$route.params.id);    // Fetch Space Screens again afte uploading
      } else {
        this.isUpload = this._getSearchScreens.length === 0 ?  true : false;
      }
    });
    
    // Event handler for New Space Created
    EE.on("newSpaceCreated", () => {
      // console.log("new Space Created");
      this.newSpace = true;     // set newSpace flag value
      this.isUpload = true;     // set isUpload flag value
      EE.emit("isUpload", true);
    });

    // Flag for ImageUpload component
    EE.on("isUpload", async (data) => {
      this.isUpload = data;     // set isUpload flag value
    });

    // Load more event handler
    EE.on("loadMore", () => {
      if( this._getSearchScreens.length !== 0 ) {
        !this.noMoreSearchScreens ? this._setLoader(true) : '';
        this.fetchSearchScreens();
      } else if( this._getDefaultSpace && this._getSearchScreens.length === 0 ) {
        this.fetchSpaceScreens(this._getDefaultSpace.id);
      }
    });
  },

  // ===================================================Before Destroy =======================================================
  beforeDestroy() {
    // console.log('Home Before Destroy');
    EE.removeAllListeners();
  },

  // ===================================================Destroy =======================================================
  destroyed() {
    // console.log('Home Destroy');
  },

  // ===================================================Before Route Update=======================================================
  beforeRouteUpdate (to, from, next) {
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>beforeRouteUpdate Params', to.params);
    // console.log('search')
    EE.emit('clearSearch');
    this._setFilters([]);
    this._setSearchFilters([]);
    this.keywords = [];
    this.isUpload = false;
    this.noMoreSearchScreens = false;
    this.noMoreSpaceScreens = false;
    EE.emit("noMoreScreens", false);
    this.resetSearchScreens();
    this.resetSpaceScreens();

    setTimeout(() => {
      this.fetchScreens(to.params.id || null);
    }, 500);

    next();
  },

  // ===================================================Before Route Leave=======================================================
  beforeRouteLeave(to, from, next) {
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>beforeRouteLeave Params', to.params);
    EE.removeAllListeners();
    this.resetSearchScreens();
    this.resetSpaceScreens();
    next();
  },

  // ===================================================computed=======================================================
  computed: {
    ...mapGetters("home", {
      _getSpaces: "getSpaces",
      _getSearchScreensPageNumber: "getSearchScreensPageNumber",
      _getSpaceScreensPageNumber: "getSpaceScreensPageNumber",
      _getDefaultSpace: "getDefaultSpace",
      _getSearchScreens: "getSearchScreens",
      _getSpaceScreens: "getSpaceScreens",

    }),

    checkSearchScreens() {
      return (this._getSearchScreens.length === 0) && (this.keywords.length === 0) ? true : false; 
    },
    getSpacesCount(){
      return this._getSpaces.length;
    }

  },

  // ===================================================methods=======================================================
  methods: {
    ...mapMutations("app", {
      _setLoader: "setLoader",
    }),
    ...mapMutations("home", {
      _setDefaultSpace: "setDefaultSpace",
      _setMetaData: "setMetaData",
      _setPageNumber: "setPageNumber",
      _setSpaceScreens: "setSpaceScreens",
      _setSearchScreens: "setSearchScreens",
      _setSpaceScreensPageNumber: "setSpaceScreensPageNumber",
      _setSearchScreensPageNumber: "setSearchScreensPageNumber",
      _setSpaceUsers: "setSpaceUsers",
      _setFilters: "setFilters",
      _setSearchFilters: "setSearchFilters",
    }),

    ...mapActions("home", {
      _fetchAllSpaces: "fetchAllSpaces",
      _fetchAllCompanyTeams: "fetchAllCompanyTeams",
      _fetchMetaData: "fetchMetaData",
      _fetchAllSearchScreens: "fetchAllSearchScreens",
      _fetchAllScreensOfDefaultSpace: "fetchAllScreensOfDefaultSpace",
      _fetchAllUsersofDefaultSpace: "fetchAllUsersofDefaultSpace",
    }),
    
    // FETCH Screens
    async fetchScreens(spaceId) {
      this._setLoader(true);

      if (typeof spaceId !== 'undefined' && spaceId) {    // if we have space id
        this.fetchSpaceUser(spaceId);
        this.fetchSpaceScreens(spaceId);
      
      } else {    // If we do not have space id 
        // Set Default Space to null
        await this._setDefaultSpace(null);  
        this.fetchSearchScreens();
      }

    },

    // FETCH Screens for search
    async fetchSearchScreens() {
      const pageNumber = await this._getSearchScreensPageNumber;
      
      // Abort Previous Fetch calls if their response is not yet received
      if(this.requestSearch) {
        this.searchController.abort();
        this.requestSearch = false;
      }

      if(!this.noMoreSearchScreens && !this.requestSearch) {
        // Create an instance of Controller for every fetch call.
        this.searchController = new AbortController();

        this.requestSearch = true;
        this._fetchAllSearchScreens({keywords: this.keywords, page: pageNumber, pageSize: 15, signal: this.searchController.signal}).then( async (res) => {
          if(res) {
            this._setLoader(false);
            EE.emit('searchScreenResponse');
            await this.searchScreenPage(res, pageNumber);  // Manage page number of Search screens
            this.requestSearch = false;
          }
        })
        .catch( () => {
          this._setLoader(false);
        });
      }
    },

    // FETCH Screens for space
    async fetchSpaceScreens(spaceId) {
      // filter space
      let filteredSpace = await this.filterSelectedSpace(spaceId);
      const pageNumber = await this._getSpaceScreensPageNumber;

      // Abort Previous Fetch calls if their response is not yet received
      // if(this.requestSpace) {
      //   this.spaceController.abort();
      // }

      if(!this.noMoreSpaceScreens && !this.requestSpace) {
        this._setLoader(true);
        // console.log('Fetch is called');
        // Create an instance of Controller for every fetch call.
        this.spaceController = new AbortController();
        
        if(!this.newSpace) {
          this.requestSpace = true;
          // get all screens of current space 
          await this._fetchAllScreensOfDefaultSpace({spaceId: filteredSpace.id, page: pageNumber, pageSize: this.pageSize, signal: this.spaceController.signal})
          .then( async (res) => {
            // console.log('Response', res);
            this.requestSpace = false;
            if(res) {
              // if response has 0 screens
              // if(res.length === 0) { this.isUpload = true }
              await this.spaceScreenPage(res, pageNumber);   // Manage page number of space screens
              this._setLoader(false);
              if(this._getSpaceScreens.length === 0) { this.isUpload = true }
              // console.log('Space Screens', res);
            }
          });
        }
      }
      this.newSpace = false;
    },

    // Increase the page number if response length is 15 otherwise set noMoreScreens flag to true
    async spaceScreenPage(screens, pageNumber) {
      if(screens.length === 15) {
        await this._setSpaceScreensPageNumber(++pageNumber);
      } else {
        this.noMoreSpaceScreens = true;
        EE.emit("noMoreScreens", true);
      }
      return;
    },

    // Increase the page number if response length is 15 otherwise set noMoreScreens flag to true
    async searchScreenPage(screens, pageNumber) {
      if(screens.length === 15) {
        await this._setSearchScreensPageNumber(++pageNumber)
      } else {
        this.noMoreSearchScreens = true;
        EE.emit("noMoreScreens", true);
      }
    },

    // RESET Search screens 
    async resetSearchScreens() {
      await this._setSearchScreens('');
      await this._setSearchScreensPageNumber(0);
      return;
    },

    // RESET space screens 
    async resetSpaceScreens() {
      if(this.keywords.length === 0) {
        await this._setDefaultSpace(null); // Set Filtered Space as Default Space in store
        await this._setSpaceScreensPageNumber(0);
        await this._setSpaceScreens('');
        await this._setSpaceUsers('');
      }
      return;
    },

    // Filter Space from all Spaces through space Id
    async filterSelectedSpace(spaceId) {
      let spaces = await this._getSpaces; // get all spaces from store
      const filteredSpace = spaces.filter( space => { return space.id === spaceId }); // filter the space from spaces
      await this._setDefaultSpace(filteredSpace[0]); // Set Filtered Space as Default Space in store
      return filteredSpace[0];
    },

    // FETCH Space default Users
    fetchSpaceUser(spaceId) {
      // Abort Previous Fetch calls if their response is not yet received
      if(this.requestUser) {
        this.userController.abort();
      }

      // Create an instance of Controller for every fetch call.
      this.userController = new AbortController();

      // get space users by using space id in url
      this.requestUser = true;
      this._fetchAllUsersofDefaultSpace({spaceId: spaceId, signal: this.userController.signal})
      .then(res => {
        if(res) {
          this._setLoader(false);
          this.requestUser = false;
          if (res.length === 0) {
            this.toaster("There's no user in the selected space.", "success");
          }
        }
      })
    },

    // Toaster 
    toaster(message, type) {
      this.$toast.open({
        message: message,
        type: type,
        position: "top-right",
        queue: false
      })
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
.welcome-page {
	/*background-image: url(../images/Welcome-page.jpg);*/
	background-repeat: no-repeat;
	background-position: top center;
	background-size: cover;
	height: 100%;
}
.welcome-box-holder {
	max-width: 650px;
	margin: 65px auto 25px;
	/* background: url(../images/welcome-box-bg.png); */
	padding: 100px 20px;
	border: #ddd solid 1px;
}

.welcome-box-holder-full-width {
	/*max-width: 650px;*/
	margin: 65px auto 25px;
	/* background: url(../images/welcome-box-bg.png); */
	padding: 100px 20px;
	border: #ddd solid 1px;
}
.welcome-title {
	text-align: center;
	display: block;
	font-size: 30px;
	color: #1f1f1f;
	margin-bottom: 40px;
}
.welcome-box-nav {
	list-style: none;
	margin: 0 auto;
	max-width: 360px;
	padding: 0;
	text-align: center;
}
.welcome-box-nav > li {
	display: inline-block;
	vertical-align: top;
	font-size: 20px;
	margin-bottom: 50px;
	text-align: left;
}
.welcome-box-nav > li > a {
	text-decoration: none !important;
	outline: none !important;
}
.welcome-box-nav > li > a > span {
	display: block;
	color: #98db6b;
}
.welcome-box-nav > li > a > em {
	font-style: normal;
	display: block;
	color: #777777;
	font-size: 14px;
}
.welcome-box-nav > li > a > span.red-color {
	color: #df6c4f;
}
.welcome-box-nav > li.video-icon {
	/* background-image: url("../images/play-video-icon.png"); */
	background-position: left top;
	background-repeat: no-repeat;
	padding-left: 60px;
}
.welcome-box-nav > li.mobile-icon {
	/* background-image: url("../images/mobile-icon.png"); */
	background-position: left top;
	background-repeat: no-repeat;
	padding-left: 60px;
}
.welcome-box-nav > li.invite-icon {
	/*background-image: url("https://maxcdn.icons8.com/windows8/PNG/32/Business/invite-32.png");*/
	/* background-image: url("https://maxcdn.icons8.com/Color/PNG/48/Users/group_foreground_selected-48.png"); */
	background-position: left top;
	background-repeat: no-repeat;
	padding-left: 60px;
}
.welcome-box-nav > li.createteam-icon {
	/* background-image: url("../images/createteam40.png"); */
	background-position: left top;
	background-repeat: no-repeat;
	padding-left: 60px;
}
</style>
