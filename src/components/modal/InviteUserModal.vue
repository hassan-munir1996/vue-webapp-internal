<template>
  <!-- invite-user-modal -->
  <modal id="invite-user-modal">
    <div slot="body">
      <div class="modal-header-e px-6 py-4">
        <h3 class="text-xl font-semibold text-heading-color-e">Invite People</h3>
      </div>
      <div>
        <div class="flex flex-wrap w-4/5 pt-5 pb-2 m-auto">
          <div class="w-full px-3 mb-4">
            <label class="block tracking-wide text-sm font-bold mb-2 text-heading-color-e">Email Address
              <span class="tooltips-custom relativer inline-block ">
                <img class="inline-block mr-1" src="@/assets/icon-tooltips.png" width="15" alt="Q img" />
                <span class="tooltiptext-custom   invisible w-2/4 bg-gray-800 text-white absolute text-xs font-light h-8 rounded p-2 text-center -space-y-4 ">Use a comma to separate email address</span>
              </span>
            </label>
            <tag-selector class="vue-tage-list" name="tags" v-model="tags" :regex="/.+@.+/" regexError="Input valid email address" />
          </div>
          <div class="w-full px-3 mb-4">
            <label class="select-arrow relative block text-sm tracking-wide text-heading-color-e font-semibold mb-2">Select Role</label>
            <select class="h-10 text-gray-900 bg-input-bg-e appearance-none block w-full border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="spaceTeam" v-model="role">
              <option value="Collaborator">Collaborator</option>
              <option value="Manager">Manager</option>
              <option value="Reviewer">Reviewer</option>
            </select>
          </div>
        </div>
        <div class="w-full block footer-border-top pt-4 pb-6 px-6">
          <div class="flex flex-wrap items-center justify-end">
            <button @click="close" class="h-8 text-btn-color-non-active w-20 focus:outline-none rounded-md border mr-4  border-btn-border font-medium  text-sm">
              Cancel
            </button>
            <button type="button" @click="inviteUsers" class="w-20 h-8 focus:outline-none rounded-md border-2 border-savah-green bg-savah-green text-white font-medium text-sm">
              Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import TagSelector from "vue-tag-selector";

export default {
  name: "InviteUserModal",
  components: {
    TagSelector
  },
  props: {
    view: Boolean
  },
  data() {
    return {
      tags: [],
      role: 'Collaborator',
    }
  },
  computed: {
    ...mapGetters("home", {
      _getDefaultSpace: "getDefaultSpace",
    }),
  },
  methods: {
    ...mapActions("home", {
      _inviteUsers: "inviteUsers"
    }),

    resetModal() {
      this.tags = [];
      this.role = null;
    },

    close() {
      VoerroModal.hide('invite-user-modal');
      this.resetModal();
    },

    tagValidator(tag) {
      // Individual tag validator function
      return /.+@.+/.test(tag) && tag.length > 5
    },
    
    inviteUsers() {
      let data = {
        "emails": this.tags,
        "projectId": this._getDefaultSpace.id,
        "role": this.role,
        "teamId": this._getDefaultSpace.teamId
      }
      if (this.tags.length == 0) {
        this.$toast.warning("Please input emails");
        return;
      }
      if (this.role == null) {
        this.$toast.warning("Please select role");
        return;
      }
      this._inviteUsers(data).then((res) => {
        if (res.message == "UpgradeAccount") {
          this.$toast.open({
            message: res.message,
            position: "top-right",
            type: "warning",
            queue: false
          });
        } else {
          VoerroModal.hide('invite-user-modal');
          this.tags = [];
          this.role = 'Collaborator';
          this.$toast.open({
            message: "Invited successfully",
            position: "top-right",
            type: "success",
            queue: false
          });
        }
      }).catch(err => {
        this.$toast.open({
          message: "Couldn't invite users for this space. Try again" + err,
          type: "error",
          position: "top-right",
          queue: false
        });
        throw err;
      })
    }
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
