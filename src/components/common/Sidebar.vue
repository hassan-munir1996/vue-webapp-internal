<template>
  <div>
    <!-- Without Hover -->
    <nav class="main-menu cursor-pointer ease-in-out transition-all duration-300" @mouseover="hover = true" @mouseleave="hover = false" :class="[hover ? 'sidebar-shadow bg-white translate-x-0':'bg-gray-150 translate-x-full']">
      <div class="text-left whitespace-no-wrap">
        <div class="text-left bg-white px-4 flex items-center" style="height: 68px;" @click="$router.push('/')">
          <img src="@/assets/ic-logo-savah.svg" alt="elegant admin template" class="mt-4 mb-3 inline-block" />
          <div   class="inline-block logo-text leading-tight px-5">
            Savah
            <small class="block">version 1.0</small>
          </div>
          <div @click="$router.push('secure/projects.do')" class="goBack" data-tooltip="go back">
            <img  src="@/assets/ic-transition-slide-left-active@3x.png"   class="mt-4 mb-3 inline-block ml-7 Rectangle-Copy-2" />
          </div>
        </div>
        <div id="btnCreateSpace" v-ripple="'rgba(0, 0, 0, 0.05)'" class="py-4 px-4 border-t border-b border-white-three" @click="show" style="max-height: 67px">
          <span class="inline-block sidebar-icon border border-white-two rounded-full" style="font-size: 25px; font-weight: normal; line-height: 30px;">+</span>
          <span  class="ml-5 text-black-two text-lg">Create New Space</span>
        </div>
        <div v-ripple="'rgba(0, 0, 0, 0.05)'" class="py-3 px-4" @click="getAllSpaceScreens">
          <span class="text-white font-bold inline-block sidebar-icon border border-gray-100 rounded-full uppercase color0">St</span>
          <span class="ml-5 text-warm-grey-two text-sm">Stream</span>
        </div>
        <div v-ripple="'rgba(0, 0, 0, 0.05)'" class="py-3 px-4" v-for="(space, index) in spaces" :key="index" @click="getSpaceScreens(space)">
          <span :class="['color'+(index + 1)]" class="text-white font-bold inline-block sidebar-icon border border-gray-100 rounded-full uppercase">{{ space.title.slice(0, 2).toUpperCase() }}</span>
          <span class="ml-5 text-warm-grey-two text-sm">{{ space.title }}</span>
        </div>
      </div>
    </nav>
    <CreateNewSpaceModal v-if="isDomReady" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { EE } from "@/helpers/eventEmitter.js";
import CreateNewSpaceModal from '@/components/modal/CreateNewSpaceModal';
export default {

  // ===================================================Components=======================================================
  components: {
    CreateNewSpaceModal
  },

  // ===================================================Data=======================================================
  data: function() {
    return {
      hover: false,
      isDomReady: false,
    };
  },

  // ===================================================Mounted=======================================================
  mounted() {
    this.isDomReady = true;
  },

  // ===================================================Computed=======================================================
  computed: {
    ...mapGetters("home", {
      spaces: "getSpaces",
      _getSpaceScreens: "getSpaceScreens"
    }),
  },
  
  // ===================================================Methods=======================================================
  methods: {

    // show create new space modal
    show() {
      // eslint-disable-next-line no-undef
      VoerroModal.show('create-new-space-modal');
      EE.emit("createNewSpace");
    },

    // when stream is clicked
    getAllSpaceScreens() {
      if (this.$route.path !== `/`) this.$router.replace(`/`)
    },

    // when any space is clicked other then stream
    getSpaceScreens(space) {
      if (this.$route.path !== `/${space.id}`) {
        this.$router.replace(`/${space.id}`)
      } else {
        if(this._getSpaceScreens.length !== 0) {
          EE.emit("isUpload", false);
        }
      }
    },
  },
};
</script>

<style>
.Rectangle-Copy-2 {
  width: 36px;
  height: 36px;
  margin: 8px;
  padding: 10px;
  border-radius: 6px;
  background-color: #1a99aa
}
.main-menu:hover {
  width: 250px;
  /* overflow: visible; */
}

.main-menu {
  background: #f9f9f9;
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  left: 0;
  width: 70px;
  overflow-x: hidden;
  /* -webkit-transition: width .05s ease; */
  transition: width .10s ease;
  /* -webkit-transform: translateZ(0) scale(1, 1); */
  z-index: 1000;
}



.logo-text {
  font-size: 14px;
  font-weight: bold;
}

.box {
  padding: 13px;
}

.sidebar-icon {
  width: 35px;
  height: 35px;
  font-size: 11px;
  line-height: 35px;
  text-align: center;
}

.color0 {
  background-color: #86989b;
}

.color1 {
  background-color: #fd816a;
}

.color2 {
  background-color: #6a78fd;
}

.color3 {
  background-color: #d06afd;
}

.color4 {
  background-color: #fd6a8d;
}

.color5 {
  background-color: #53ddac;
}

.color6 {
  background-color: #d06afd;
}

.color7 {
  background-color: #fd6a8d;
}

.color8 {
  background-color: #86989b;
}

.color9 {
  background-color: #fd816a;
}

.bg-gray-150 {
  background: #f9f9f9;
}

.sidebar-shadow {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
 [data-tooltip] {
   position: relative;
   cursor: default;
 }
 .goBack:before,
 .goBack:hover::after{
   --scale: 0;
   position: absolute;
   bottom: -.50rem;
   left:50%;
   background: #555;
   content: attr(data-tooltip);
   width: 70px;
   color: #fff;
   transform: translateX(-50%) scale(var(--scale));
   transition: opacity 0.3s;
   border-radius: 3px;
   text-align: center;
   box-sizing: border-box;

 }
 .goBack:hover::before{
   --scale: 1;
 }



</style>
