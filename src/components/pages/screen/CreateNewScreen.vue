<template>
  <div class="ml-6 bg-black-three py-2 px-3 rounded-md relative flex items-center justify-center cursor-pointer" v-click-outside="closeDropdown" @click="toggle = !toggle">
    <span>v1</span>
    <span class="text-white ml-2">
      <font-awesome-icon :icon="['fas', 'sort-down']" />
    </span>
    <div v-if="toggle" class="absolute top-0 bg-white w-5 h-5 transform rotate-45 z-50" style="top: 2.5rem;"></div>
    <div v-if="toggle" class="absolute top-0 bg-white w-48 h-10 flex items-center justify-center rounded-md cursor-pointer z-50" style="top: 3rem;" @click="$refs.createScreen.click()">
      <span class="text-topaz mr-2 text-sm">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </span>
      <span class="text-topaz text-sm font-semibold">Upload New Version</span>
    </div>
    <form enctype="multipart/form-data">
      <input class="hidden" @change="fileseleted" type="file" ref="createScreen" />
    </form>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      toggle: false,
    }
  },
  methods: {
    ...mapMutations('screen', {
      setLoader: 'setLoader',
    }),
    ...mapActions('screen', {
      _createScreen: "createScreen",
    }),
    closeDropdown() {
      this.toggle = false;
    },
    fileseleted(evt) {
      const formData = new FormData();
      formData.append("file", evt.target.files[0]);
      this.toggle = false;
      this.setLoader(true);
      this._createScreen({ file: formData, projectId: this.$route.params.projectId, screenId : this.$route.params.screenId })
      .then(res => {
        this.setLoader(false);
        if(res.status === 500 ) {
          this.$toast.open({
            message: "Couldn't create screen. Try again." + err,
            type: "error",
            position: "top-right",
            queue: true
          })
        } else {
          this.$toast.open({
            message: "Screen created successfuly",
            type: "success",
            position: "top-right",
            queue: true
          })
          this.$router.push({ path: `/project/${this.$route.params.projectId}/screen/${res.id}` });
        }
      })
      .catch(err => {
        this.$toast.open({
          message: "Couldn't create screen. Try again." + err,
          type: "error",
            position: "top-right",
          queue: true
        })
      })
      return res;
    },
  }
}

</script>
