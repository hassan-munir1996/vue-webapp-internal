<template>
  <!-- invite-user-modal -->
  <modal id="delete-screen-modal">
    <div slot="body" class="p-3">
      <!-- <div class="modal-header-e px-6 py-4">
        <h3 class="text-xl font-semibold text-heading-color-e"></h3>
      </div> -->
      <div>
        <div class="m-auto relative">
          <div class="p-3 mb-4 m-auto flex flex-wrap flex-col justify-center items-center">
            <button type="button" @click="close" class="focus:outline-none absolute text-2xl font-semibold text-btn-color-non-active hover:text-gray-900" data-dismiss="modal" aria-hidden="true" style="top: -5px; right:-2px;">×</button>
            
            <h3 class="text-2xl font-semibold text-gray-700 mb-10">Are you sure?</h3>

            <p class="text text-gray-600 text-center tracking-wide">Do you really want to delete this Screen? This process cannot be undone.</p>
            
            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center justify-end mt-12">
                <button @click="close" class=" w-40 h-10 focus:outline-none rounded-md border mr-4 bg-gray-300 border-btn-border font-medium text-gray-700 text-sm">
                Cancel
                </button>
                <button type="button" @click="deleteScreenAction" class="w-40 h-10 focus:outline-none rounded-md border-2 bg-savah-green text-white font-medium text-sm">
                Delete
                </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { EE } from "@/helpers/eventEmitter.js";
export default {
  name: "DeleteScreenModal",
  
  // ===================================================Data=======================================================
  data() {
    return {
        screen: null,
    }
  },

  // ===================================================Mounted=======================================================
  mounted() {
    // Delete Screen button event handler
    EE.on('deleteScreen', (screen) => {
        this.screen = screen;
    });
  },

  // ===================================================Computed=======================================================
  computed: {
      ...mapGetters("home",{
        _getDefaultSpace: "getDefaultSpace",
        _getSpaceScreens: "getSpaceScreens",
        _getSearchScreens: "getSearchScreens",
      }) 
  },

  // ===================================================Methods=======================================================
  methods: {

    ...mapMutations("app", {
      setLoader: 'setLoader',
    }),

    ...mapActions("home", {
      _deleteScreen: "deleteScreen",
    }),

    // Reset Modal Data
    resetModal() {
      this.screen = null;
    },

    // Delete Screen Call
    deleteScreenAction() {
      this.setLoader(true);
      this._deleteScreen({ spaceId: this.screen.id, projectId: this.screen.spaceId })
      .then((res) => {
        this.close();
        this.setLoader(false);
        if (res.status === 200) {

          this.resetScreenView();
          this.toaster("Screen deleted successfully", "success");
        } else {
          this.toaster("Oops! there is some error", "error");
        }
      })
    },

    // Show our Upload Screen component if there are Zero screens in either search or space screens array
    resetScreenView() {
      if(this._getDefaultSpace) {
        if(this._getSpaceScreens.length === 0) {
          EE.emit("isUpload", true);
        }
      } else {
        if(this._getSearchScreens.length === 0) {
          EE.emit("isUpload", true);
        }
      }
    },


    // Toaster
    toaster(message, type) {
      this.$toast.open({
        message: message,
        type: type,
        position: "top-right",
        queue: false
      });
    },

    // Close Modal
    close() {
      // eslint-disable-next-line no-undef
      VoerroModal.hide('delete-screen-modal');
      this.resetModal();
    },
    
  }
};

</script>
<style>
.modal-box {
  border-radius: 5px !important;
  min-width: 30% !important;
}

.modal-header {
  border: none !important;
}

.vue-tage-list .tag-selector--input {
  min-height: 100px;
  padding: 10px 14px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.vue-tage-list:focus {
  border: 1px solid red;
}

.vue-tage-list .tag-selector--item {
  border: 1px solid #dfdfdf;
  padding: 3px 6px;
  border-radius: 3px;
  background-color: #f5f6f7;
}

.tooltips-custom:hover .tooltiptext-custom {
  visibility: visible;
}

.tooltiptext-custom {
  margin-top: -7px;
  margin-left: 8px;
}

.tooltiptext-custom::after {
  position: absolute;
  top: 11px;
  background-color: transparent;
  content: "";
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-right: 6px solid #3a3a3a;
  border-bottom: 5px solid transparent;
  right: 100%;
}

</style>
