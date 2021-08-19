<template>
  <!-- create-new-space-modal -->
  <modal id="create-new-space-modal">
    <div slot="body">
      <div class="modal-header-e px-6 py-4">
        <h3 class="text-xl font-semibold text-heading-color-e">Create New Space</h3>
      </div>
      <form @submit.prevent="createSpace">
        <div>
          <div class="flex flex-wrap w-4/5 pt-5 pb-2 m-auto">
            <div class="w-full px-3 mb-4">
              <label class="block tracking-wide text-sm font-bold mb-2 text-heading-color-e">Title</label>
              <input ref="inputTitle" v-validate="'required'" class="text-sm h-10 appearance-none block w-full bg-input-bg-e text-gray-800  border border-gray-200 rounded py-2 px-4 leading-tight font-light focus:outline-none focus:bg-white focus:border-savah-green" type="text" v-model="space.title" placeholder="Add title here" id="spaceName" name="spaceName" data-vv-as="space name"/>
              <div class="validate-error-msg">
                <span class="caption text-red-600 " v-if="errors.has('spaceName')">{{
                  errors.first('spaceName')
                  }}</span>
              </div>
            </div>
            <div class="w-full px-3 mb-4">
              <label class="block tracking-wide text-sm font-bold mb-2 text-heading-color-e mb-2">Description</label>
              <textarea  rows="{3}" v-model="space.description" name="description" placeholder="Enter Space description." class="resize-none h-20 text-sm text-gray-800 appearance-none block w-full bg-input-bg-e text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"></textarea>
              <div class="validate-error-msg">
                <span class="caption" v-if="errors.has('description')">{{
                  errors.first('description')
                  }}</span>
              </div>
            </div>
            <div class="w-full px-3 mb-4">
              <label class="select-arrow relative block text-sm tracking-wide text-heading-color-e font-semibold mb-2">Select Team</label>
              <select v-validate="'required'" class="h-10 text-gray-900 bg-input-bg-e appearance-none block w-full border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" v-model="space.team" name="spaceTeam" data-vv-as="space team">
                <option class="text-gray-800 text-sm" selected> All</option>
                <option v-for="(team, index) in companyTeamList" :key="index" :value="team.uuid">{{team.title}}</option>
              </select>
              <div class="validate-error-msg">
                <span class=" text-red-600 caption" v-if="errors.has('spaceTeam')">{{
                    errors.first('spaceTeam')
                  }}</span>
              </div>
            </div>
          </div>
          <div class="w-full block footer-border-top pt-4 pb-6 px-6">
            <div class="flex items-center justify-end">
              <button @click="close" type="button" class="h-8 text-btn-color-non-active w-20 focus:outline-none rounded-md border mr-4  border-btn-border font-medium  text-sm">
                Cancel
              </button>
              <button type="submit" class="w-20 h-8 focus:outline-none rounded-md border-2 border-savah-green bg-savah-green text-white font-medium text-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </modal>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { EE } from "@/helpers/eventEmitter.js";
export default {

  // ===================================================Data=======================================================
  data() {
    return {
      space: {
        title: "",
        description: "",
        team: ""
      },
    };
  },

  // ===================================================Created=======================================================
  created() {
    window.VoerroModalEvent.$on('show', () => {
      this.$validator.reset();
    });
  },

  // ===================================================Mounted=======================================================
  mounted() {

    // Auto focus on title input when create new space is clicked
    EE.on("createNewSpace", () => {
      setTimeout(() => {
        if(this.$refs.inputTitle) {
          this.$refs.inputTitle.focus();
        }
      }, 100);
    });
  },

  // ===================================================Before Destroy =======================================================
  beforeDestroy() {
    // console.log('Create new space Modal Before Destroy');
    EE.removeAllListeners(["createNewSpace"]);
  },

  // ===================================================Computed=======================================================
  computed: {
    ...mapGetters("home", {
      companyTeamList: "getCompanyTeams"
    }),
  },

  // ===================================================Methods=======================================================
  methods: {

    ...mapMutations("app", {
      _setLoader: 'setLoader',
    }),

    ...mapActions("home", {
      _createSpace: "createSpace",
    }),

    close() {
      VoerroModal.hide('create-new-space-modal');
    },

    async createSpace() {
      
      // Validate all fields before creating new space
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          this._setLoader(true);

          // Create new space if all fields are valid
          await this._createSpace(this.space).then(res => {
            this._setLoader(false);
            this.toaster("Space created successfuly", "success");
            this.$router.replace(`/${res.id}`);
            EE.emit("newSpaceCreated");
            VoerroModal.hide('create-new-space-modal');
            this.space = {}
          }).catch(err => {
            this._setLoader(false);
            this.toaster("Couldn't create space. Try again." + err, "error");
            VoerroModal.hide('create-new-space-modal');
          })
        }
      });
    },

    toaster(message, type) {
      this.$toast.open({
        message: message,
        type: type,
        position: "top-right",
        queue: true
      })
    },
  }
};

</script>
<style>
.modal-box {
  border-radius: 15px !important;
  width: 530px;
}

.modal-header {
  border: none !important;
}

.modal-header {
  display: none !important;
}

.modal-body {
  padding: 0 !important;
}

.modal-header-e {
  border-bottom: 1px solid #e0e0e0;
}

.footer-border-top {
  border-top: 1px solid #e0e0e0;
}

.select-arrow::after {
  position: absolute;
  content: "";
  width: 8px;
  height: 8px;
  background-color: transparent;
  border-left: 2px solid #2b3035;
  border-bottom: 2px solid #2b3035;
  bottom: -30px;
  right: 13px;
  transform: rotate(-45deg);
}

::-webkit-input-placeholder {
  /* Edge */
  color: #a9a9a9 !important;
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #a9a9a9 !important;
}

::placeholder {
  color: #a9a9a9 !important;
}

.tag-selector--item {
  margin-right: 5px !important;
}

</style>
