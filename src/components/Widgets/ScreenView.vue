<template>
  <div>

    <!-- Header -->
    <span class="swap">
      <span class="imageDetails">
        <div class="text-brownish-grey-two text-base" v-if="filteredSpaceImages && filteredSpaceImages.length > 0">
          {{filteredSpaceImages.length}} Images
          <span v-if="_getSearchScreens.length == 0">in this space</span>
        </div>
      </span>

      <span class="w-1/2 whitespace-no-wrap flex justify-left items-center">
        <span class="text-xs text-warm-grey mr-2" v-show="screenTags.length > 0">
          FILTER BY
        </span>
        <span v-dragscroll class="no-scroll-bar overflow-scroll">
          <button class="focus:outline-none sub-menu rounded-full capitalize text-sm px-3 py-1 m-1" @click="_addOrRemoveFilter(keyword)" v-for="(keyword, index) in screenTags" :key="'filter'+index" :class="[_selectedSpaceFilters.includes(keyword) ? 'subMenuHover': '']">
            {{keyword}}
          </button>
        </span>
      </span>
    </span>

    <!-- Content -->
    <div class="flex flex-wrap">
      <div  class="w-full">
        <div ref="masonry" class="grid" fit-width="true" v-masonry transition-duration="0.1s" :gutter="2" item-selector=".item">
          <div v-masonry-tile class="item" :id="index" :key="index" v-for="(image, index) in filteredSpaceImages">
            <div class="s-width">
              <div class="relative overflow-hidden">

                <!-- <img
                  :src="image.thumbnailURL"
                  @onerror="this.onerror=null;this.src='http://via.placeholder.com/350x650';"
                  @load="$event.target.parentElement.parentElement.classList.remove('hidden')"
                  class="w-full rounded-md cursor-pointer"
                /> -->
                <div v-images-loaded:on.progress="imageProgress">
                  <img :src="image.thumbnailURL" @load="$redrawVueMasonry()" @error="setAltImg($event, image.url)" class="rounded-md cursor-pointer" />
                </div>

                <div v-bind:class="[hover, 'box-overlay']" @click="goToScreen(image)" class="absolute cursor-pointer top-0 w-full h-full opacity-0 hover:opacity-100 transition duration-500 ease-in-out">
                  <div class="relative flex flex-wrap items-center justify-between">
                    <div>
                      <div v-tooltip="'New'" v-if="transformStatus(image.status) === 'new'" :class="[transformStatus(image.status) === 'new' ? 'w-2 h-2 bg-new mx-2 rounded-full p-1 border border-white' : '']"></div>
                      <div v-tooltip="'In Progress'" v-if="transformStatus(image.status) === 'inprogress'" :class="[transformStatus(image.status) === 'inprogress' ? 'w-2 h-2 bg-progress mx-2 rounded-full p-1 border border-white' : '']"></div>
                      <div v-tooltip="'Need Review'" v-if="transformStatus(image.status) === 'needsreview'" class="w-2 h-2" :class="[transformStatus(image.status) === 'needsreview' ? 'w-2 h-2 bg-review mx-2 rounded-full p-1 border border-white' : '']"></div>
                      <div v-tooltip="'Approved'" v-if="transformStatus(image.status) === 'approved'" class="w-2 h-2" :class="[transformStatus(image.status) === 'approve' ? 'w-2 h-2 bg-topaz mx-2 rounded-full p-1 border border-white' : '']"></div>
                      <div v-tooltip="'On hold'" v-if="transformStatus(image.status) === 'onhold'" class="w-2 h-2" :class="[transformStatus(image.status) === 'onhold' ? 'w-2 h-2 bg-onhold mx-2 rounded-full p-1 border border-white' : '']"></div>
                    </div>
                    <div class="p-2">
                      <font-awesome-icon class="focus:outline-none text-sm text-white mr-2" v-tooltip="'Share'" :icon="['fas', 'share']" @click.stop.prevent="" />
                      <font-awesome-icon class="focus:outline-none text-sm text-white mr-2" v-tooltip="'Upload'" :icon="['fas', 'upload']" @click.stop.prevent="" />
                      <font-awesome-icon class="focus:outline-none text-sm text-white mr-2" v-tooltip="'File'" :icon="['fas', 'file']" @click.stop.prevent="" />
                      <font-awesome-icon class="focus:outline-none text-sm text-white mr-2" v-tooltip="'Trash'" :icon="['fas', 'trash']" @click.stop.prevent="deleteScreen(image)" />
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center pl-4 pb-3 absolute bottom-0">
                    <h2 class="text-white text-base w-full">{{image.title}}</h2>
                    <div class="flex flex-wrap items-center">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center flex-auto bg-white-two text-xs">{{image.createdBy.slice(0, 2).toUpperCase()}}</div>
                      <span class="text-white text-sm pl-2">{{image.comments}} comments {{image.revisions}} revisions <br> Uploaded {{image.updatedOn}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap items-center text-black-two text-opacity-50 my-2" >
                <template v-if="image.tags">
                  <div v-if="image.description.length<50" v-html="image.description"></div>
                  <div  v-if="image.description.length>50" class ="description">
                    <div v-if="!readMore[image.id]" v-html="image.description.substring(0, 50) + '..'"></div>
                    <div v-if="readMore[image.id]" v-html="image.description"></div>
                    <button  class="hover:text-topaz" @click="showMore(image.id)" v-if="!readMore[image.id]">Show more</button>
                    <button  class="hover:text-topaz" @click="showLess(image.id)" v-if="readMore[image.id]">Show less</button>
                  </div>
<!--                    <div class  ="description">
                  <span v-if="image.description.length<50">{{image.description}}</span>
                  <div v-if="image.description.length>=50"> {{ image.description.substring(0,50)+".." }}</div>
                  </div>-->

                  <div  class="text-sm mr-2 font-medium hover:text-topaz cursor-pointer flex items-start" v-for="tag in image.tags" :key="tag">{{tag}}</div>
                </template>
                <!-- <div class="block w-full text-black text-sm" v-if="image.description">
                  <read-more more-str="read more" less-str="read less" :text="image.description" link="#" :max-chars="100"></read-more>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer / No more Screens -->
    <div v-if="noScreens" class="w-full text-black text-2xl text-center py-10">
      There are not any more designs
    </div>

    <DeleteScreenModal v-if="isDomReady" />
  </div>
</template>
<script>
import { EE } from "@/helpers/eventEmitter.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import DeleteScreenModal from '@/components/modal/DeleteScreenModal';
import imagesLoaded from 'vue-images-loaded';
import { dragscroll } from 'vue-dragscroll';


export default {

  // ===================================================Components=======================================================
  components: {
    DeleteScreenModal
  },

  // ===================================================Directives=======================================================
  directives: {
    imagesLoaded,
    dragscroll
  },
  // ===================================================Data=======================================================
  data() {
    return {
      hover: false,
      isDomReady:false,
      colors: [
        "red",
        "blue",
        "green",
        "indigo",
        "purple",
        "teal",
        "orange",
        "brown",
        "deep-orange",
        "blue-grey",
        "cyan"
      ],
      currentColor: "",
      isUpload: false,
      noMoreScreens: false,
      searchKeywords: [],
      searchResponse: false,
      screenTags: {},
      description: {},
      readMore: {}
    };
  },

  // ===================================================Created=======================================================
  created () {

  },

  // ===================================================Mounted=======================================================
  mounted() {
    window.addEventListener('scroll', this.scrollBottomTrigger);
    this.isDomReady = true;
    // Flag for ImageUpload component
    EE.on("isUpload", async (data) => {
      this.isUpload = data;     // set isUpload flag value
    });

    // No More Screens event Handler
    EE.on("noMoreScreens", (data) => {
      !data ? this.searchKeywords = [] : '';
      this.noMoreScreens = data;
    })

    // if user search screens from search dropdown
    EE.on('searchScreens', async (keywords) => {
      this.searchKeywords = [];
      if(keywords.length !== 0) {
        this.searchKeywords = keywords;
      }
    });

    // search Api response handler
    EE.on("searchScreenResponse", () => {
      this.searchResponse = true;
      this.filteredSpaceImages;
    })
  },

  // ===================================================Before Destroy =======================================================
  beforeDestroy() {
    // console.log('Screen View Before Destroy');
    window.removeEventListener("scroll", this.scrollBottomTrigger, false);
    EE.removeAllListeners(["isUpload", "noMoreScreens"]);
  },

  // ===================================================Destroy =======================================================
  destroyed() {
    // console.log('Screen View Destroy');
  },

  // ===================================================Computed=======================================================
  computed: {
    ...mapGetters("home", {
      _getMetaData: "getMetaData",
      _defaultSpace: "getDefaultSpace",
      _getSearchScreens: "getSearchScreens",
      _getSpaceScreens: "getSpaceScreens",
      _getSpaceScreensPageNumber: "getSpaceScreensPageNumber",
      _getSearchScreensPageNumber: "getSearchScreensPageNumber",
      _selectedSpaceFilters: "getSelectedSpaceFilters",
      _getSearchFilters: "getSearchFilters",

    }),
    // Filter Screens according to the selected tags
    filteredSpaceImages() {
      let screens = null;
      // set screens
      if(this._getSearchScreens.length !== 0) {
        screens = this._getSearchScreens;
      } else {
        if(this.searchKeywords.length === 0 && this._getSpaceScreens.length !== 0) {
          screens = this._getSpaceScreens;
        } else {
          if(this.searchResponse) {
            screens = this._getSearchScreens;
          } else {
            screens = null;
          }
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.searchResponse = false;
        }
      }
this.setScreenTags(screens);
      // Filter Screens from screen view tags
      if(this._selectedSpaceFilters.length !== 0) {
        let filtered = []
        screens.forEach( (screen) => {
          if(screen.tags !== null) {
            for(var i = 0; i < screen.tags.length; i++) {
              if( this._selectedSpaceFilters.indexOf(screen.tags[i]) > -1) {
                filtered.push(screen);
                break;
              }
            }
          }
        });
        return filtered;
      } else {
        return screens;
      }

    },
    // No more Screens
    noScreens() {
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>No More Screens' , this._selectedSpaceFilters.length !== 0 && this.filteredSpaceImages.length === 0 )
      if(this.filteredSpaceImages) {
        if(this._selectedSpaceFilters.length !== 0 && this.filteredSpaceImages.length === 0) {
          return true;
        } else {
          if(this._getSearchScreens.length !== 0) {
            return this._getSearchScreensPageNumber > 0  && this.noMoreScreens ? true : false;

          } else if(this._getSpaceScreens.length !== 0) {
            if(this.filteredSpaceImages.length === 0) {
              return true;
            } else {
              return this._getSpaceScreensPageNumber > 0  && this.noMoreScreens ? true : false;
            }

          } else {
            return this.noMoreScreens;
          }
        }
      } else {
        return false;
      }

    },

    // Keywords
    keywords() {
      let filters = [];
      if(this._getSearchFilters.length !== 0) {
        filters = this._getSearchFilters;
      } else if(this._getMetaData.tags !== undefined) {
        for (let i = 0; i < this._getMetaData.tags.length; i++) {
          filters.push(this._getMetaData.tags[i]);
        }
      }
      return filters;
    }
  },

  // ===================================================Methods=======================================================
  methods: {
    showMore(id) {
      this.$set(this.readMore, id, true);
    },
    showLess(id) {
      this.$set(this.readMore, id, false);
    },
 setScreenTags(screens){
       let tags = []
       if(screens){


        //screens.forEach( (screen) => {
        for(var index = 0; index < screens.length; index++) {
          var screen = screens[index];
          if(screen.tags !== null) {
            for(var i = 0; i < screen.tags.length; i++) {
                tags.push(screen.tags[i]);
              }
          }
        }
        this.screenTags = tags;
       }
    },
    ...mapMutations("app", {
      setLoader: 'setLoader',
    }),

    ...mapActions("home", {
      _addOrRemoveFilter: "addOrRemoveFilter",
    }),

    // Place holder img if img src is broken
    setAltImg(event, url) {
      event.target.src = url;
      event.target.width = 350;
      this.$nextTick(() => this.$redrawVueMasonry());
      this.$redrawVueMasonry(this.$refs.masonry);
    },

    // Check if iamge is loaded or broken
    imageProgress(instance ) {  //imageProgress(instance, image ) {
      // const result = image.isLoaded ? 'loaded' : 'broken';
      // console.log( 'image is ',instance );
      instance.hasAnyBroken ? this.$redrawVueMasonry(this.$refs.masonry) : '';
      // console.log( 'image is ' + image + ' for ' + instance );
    },

    // Load More Screens when scroll reaches bottom of the page
    scrollBottomTrigger() {
      var viewPortHeight = window.innerHeight;
      var scrollTop = document.documentElement.scrollTop;
      var scrollHeight = document.documentElement.scrollHeight;
      if((scrollHeight - scrollTop) <= viewPortHeight && !this.isUpload && this.$route.path.indexOf('screen') === -1) {
        EE.emit('loadMore');
      }
    },

    // Delete Screen Event
    deleteScreen(screen) {
      // eslint-disable-next-line no-undef
      VoerroModal.show('delete-screen-modal');
      EE.emit('deleteScreen', screen);
    },

    // Transform Status
    transformStatus(statusString) {
      // change status color
      let hasSpaces = /\s/g.test(statusString)
      let status = statusString;
      if (hasSpaces) {
        status = status.replace(/\s/g, '');
      }
      return status && status.toLowerCase();
    },

    // Random color
    randomColors() {
      this.currentColor =
        this.colors[Math.floor(Math.random() * this.colors.length)];
    },

    // Go to Screen Detail Page
    goToScreen(image) {
      if(this._getSearchScreens.length === 0) {
        this.$router.push({ path: `/project/${this._defaultSpace.id}/screen/${image.id}` });
      } else {
        this.$router.push({ path: `/stream/${image.spaceId}/screen/${image.id}` });
      }

    },
  },
};
</script>
<style scoped>
.description{
  display: inline-block;
  z-index: 10;
  background-color: white;
}

.grid {
  margin: 0 auto;
}

.s-width {
  width: 14.375rem;
  margin: 0.75rem;
}

img {
  max-width: 350pxpx!important;
  height: auto;
}
.no-scroll-bar::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
.element-item {
  position: relative;
  float: left;
  width: 350px;
  margin: 5px;
  padding: 10px;
  background: #888;
  color: #262524;
}
.grid-size{
  width: 25%;
}

.grid-gutter{
  margin-bottom: 20px;
  margin-right: 20px;
}



.sub-menu {
  border: 1.5px solid transparent;
  outline: none !important;
  transition: 0.5s;
  color: #5d5d5d;
}


.sub-menu:hover {
  border: 1.5px solid #1a99aa;
  transition: 0.5s;
}

.subMenuHover {
  border: 1.5px solid #1a99aa;
  background-color: #1a99aa;
  color: white;
}

.image-status {
  width: 12px;
  height: 12px;
  border: solid 1px white;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 10px;
  left: 10px;
}


.box-overlay {
  background: rgba(0, 0, 0, 0.5);
}
.swap{
  display: inline;
  padding-inline: 30px;
}
.imageDetails{
  float: right;
  padding-top: 28px;
}
.filter{
  float: left;
}

</style>
