<template>
  <!-- update-space-details-modal -->
  <modal v-if="space" id="update-space-details-modal">
    <div slot="body">
      <div class="modal-header-e px-6 py-4">
        <h3 class="text-xl font-semibold text-heading-color-e">Update Space</h3>
      </div>
      <form @submit.prevent="updateSpace">
        <div>
          <div class="flex flex-wrap w-4/5 pt-5 pb-2 m-auto">

            <!-- Space Title -->
            <div class="w-full px-3 mb-4">
              <label class="block tracking-wide text-sm font-bold mb-2 text-heading-color-e">Title</label>
              <input 
                ref="inputTitle" 
                v-validate="'required'"
                class="text-sm h-10 appearance-none block w-full bg-input-bg-e text-gray-800  border border-gray-200 rounded py-2 px-4 leading-tight font-light focus:outline-none focus:bg-white focus:border-savah-green" 
                type="text" 
                v-model="space.title" 
                placeholder="Add title here" 
                id="spaceName" 
                name="spaceName" 
                data-vv-as="space name"
              />
              <div class="validate-error-msg">
                <span class="caption text-xs text-red-600 pl-4" v-if="errors.has('spaceName')">
                  {{ errors.first('spaceName') }}
                </span>
              </div>
            </div>

            <!-- Space Description -->
            <div class="w-full px-3 mb-4">
              <label class="block tracking-wide text-sm font-bold mb-2 text-heading-color-e mb-2">Description</label>
              <textarea
                rows="{3}" 
                v-model="space.description" 
                name="description" 
                placeholder="Update Space Description"
                class="resize-none h-20 text-sm text-gray-800 appearance-none block w-full bg-input-bg-e text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              ></textarea>
              <div class="validate-error-msg">
                <span class="caption" v-if="errors.has('description')">{{
                  errors.first('description')
                  }}</span>
              </div>
            </div>

            <!-- Space Team -->
            <div class="w-full px-3 mb-4">
              <label class="select-arrow relative block text-sm tracking-wide text-heading-color-e font-semibold mb-2">Select Team</label>
              <select 
                v-validate="'required'" 
                class="h-10 text-gray-900 bg-input-bg-e appearance-none block w-full border border-gray-200 rounded py-2 px-4 leading-tight 'focus:outline-none 
                focus:bg-white focus:border-gray-500" 
                v-model="space.teamId" 
                name="spaceTeam" 
                data-vv-as="space team"
              >
                <option class="text-gray-800 text-sm"> All</option>
                <option v-for="(team, index) in companyTeamList" :key="index" :value="team.uuid">{{team.title}}</option>
              </select>
            </div>
            
          </div>
          <div class="w-full block footer-border-top pt-4 pb-6 px-6">
            <div class="flex items-center justify-end">
              <button @click="close" type="button" class="h-8 text-btn-color-non-active w-20 focus:outline-none rounded-md border mr-4  border-btn-border font-medium  text-sm">
                Cancel
              </button>
              <button type="submit" class="w-20 h-8 focus:outline-none rounded-md border-2 border-savah-green bg-savah-green text-white font-medium text-sm">
                Update
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
import _ from 'lodash';
export default {

  // ===================================================Data=======================================================
  data() {
    return {
      space: null,
    };
  },

  // ===================================================Created=======================================================
  created() {
    window.VoerroModalEvent.$on('show', (optionsOrId, options) => {
      this.$validator.reset();
    });
  },

  // ===================================================Mounted=======================================================
  mounted() {
    this.space = _.cloneDeep(this._getDefaultSpace);
  },

  // ===================================================Before Destroy =======================================================
  beforeDestroy() {
    // console.log('Create new space Modal Before Destroy');
    EE.removeAllListeners(["createNewSpace"]);
  },

  // ===================================================Computed=======================================================
  computed: {
    ...mapGetters("home", {
      _getDefaultSpace: "getDefaultSpace",
      companyTeamList: "getCompanyTeams"
    }),
  },

  // ===================================================Methods=======================================================
  methods: {

    ...mapMutations("app", {
      _setLoader: 'setLoader',
    }),

    ...mapMutations("home", {
      _setDefaultSpace: "setDefaultSpace",
      _setUpdateSpace: "setUpdateSpace",
    }),

    ...mapActions("home", {
      _updateSpaceDetails: "updateSpaceDetails",
    }),

    // Close Modal
    close() {
      VoerroModal.hide('update-space-details-modal');
    },

    // Update space details request to server
    async updateSpace() {
      
      // Validate all fields before creating new space
      this.$validator.validateAll().then(async (result) => {
        if (result) {
          this._setLoader(true);

          // Get selected team to set its id and name in space
          const selectedSpaceTeam = this.companyTeamList.find( (team) => {
            return team.uuid === this.space.teamId;
          });
          this.space.teamName = selectedSpaceTeam.title;
          // console.log('selected Team Name', this.space, selectedSpaceTeam);

          // Update space if all fields are valid
          this._updateSpaceDetails(this.space).then( (res) => {
            this._setLoader(false);
            this._setUpdateSpace(res);
            this.toaster("Space updated successfuly", "success");
            // eslint-disable-next-line no-undef
            VoerroModal.hide('update-space-details-modal');

          }).catch(err => {
            this._setLoader(false);
            this.toaster("Couldn't create space. Try again." + err, "error");
            // eslint-disable-next-line no-undef
            VoerroModal.hide('update-space-details-modal');
          });
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
