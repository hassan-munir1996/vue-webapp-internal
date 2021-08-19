<template>
  <div>
    <!-- <ul class="flex flex-wrap items-center justify-end relative">
      <li class="px-3 cursor-pointer text-xs" v-ripple="'rgba(0, 0, 0, .05)'">
        <div>Projects</div>
      </li>
      <li class="px-3 cursor-pointer text-xs" v-ripple="'rgba(0, 0, 0, .05)'">
        <div>Team</div>
      </li>
      <li class="px-3 cursor-pointer text-xs" v-ripple="'rgba(0, 0, 0, .05)'">
        <div>Help</div>
      </li>
      <li class="px-3 cursor-pointer text-xs" v-click-outside="closeProfileDropDown">
        <img :src="require('@/assets/profile.jpg')" class="w-8 rounded-full inline-block" />
        <span class="pl-2" @click="showProfileDropDown = !showProfileDropDown">
          <font-awesome-icon :icon="['fas', 'sort-down']" />
        </span>
        <div v-if="showProfileDropDown" class="bg-white shadow-lg border border-gray-100 mt-2 rounded-md w-64 absolute" style="right: 1rem; z-index: 99999;">
          <div class="flex flex-wrap items-center px-6 py-5">
            <img :src="require('@/assets/profile.jpg')" class="w-16 rounded-full inline-block" />
            <div class="inline-block ml-4">
              <h2 class="text-black text-sm">Andrew Adam</h2>
              <p class="text-xs text-gray-500">andrew@gmail.com</p>
              <button type="button" class="bg-savah-green text-xs text-white py-1 px-2 mt-1 rounded uppercase">Upgrade</button>
            </div>
          </div>
          <div class="text-black text-sm mb-4">
            <ul>
              <li class="hover:bg-pale-grey-two" v-ripple="'rgba(0, 0, 0, .05)'">
                <router-link to="/" class="block py-1 mx-8">Edit Profile</router-link>
              </li>
              <li class="hover:bg-pale-grey-two" v-ripple="'rgba(0, 0, 0, .05)'">
                <router-link to="/" class="block py-1 mx-8">Getting Started</router-link>
              </li>
              <li class="hover:bg-pale-grey-two" v-ripple="'rgba(0, 0, 0, .05)'">
                <router-link to="/" class="block py-1 mx-8">Blog</router-link>
              </li>
              <li class="hover:bg-pale-grey-two" v-ripple="'rgba(0, 0, 0, .05)'">
                <router-link to="/" class="block py-1 mx-8">Design Insights</router-link>
              </li>
              <li class="hover:bg-pale-grey-two" v-ripple="'rgba(0, 0, 0, .05)'">
                <router-link to="/" class="block py-1 mx-8">Product Updates</router-link>
              </li>
              <li class="hover:bg-pale-grey-two" v-ripple="'rgba(0, 0, 0, .05)'">
                <router-link to="/" class="block py-1 mx-8">Sign Out</router-link>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul> -->
  </div>
</template>

<script>
export default {

  // ===================================================Data=======================================================
  data() {
    return {
      showProfileDropDown: false,
    }
  },

  // ===================================================Methods=======================================================
  methods: {
    closeProfileDropDown() {
      this.showProfileDropDown = false;
    },
  }
}
</script>
