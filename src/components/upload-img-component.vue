<template>
  <div class="page-wrapper">
    <div class="container-fluid">
      <div class="row page-titles">
        <div class="col-md-6">
          <div class="pull-left">
            <div class="dropdown dropedown-bg">
              <button
                type="button"
                class="dropdown-toggle"
                data-toggle="dropdown"
              >{{selectedSpace.title?selectedSpace.title:'Space'}}</button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#">
                  <i class="fa fa-archive spaceDropDown" aria-hidden="true"></i>
                  Archive
                </a>
                <a @click="deleteSpace" class="dropdown-item" href="#">
                  <i class="fa fa-trash spaceDropDown" aria-hidden="true"></i>
                  Delete
                </a>
              </div>
            </div>
          </div>
          <div class="pull-left">
            <div class="header-list">
              <ul>
                <li v-for="(user, index) in selectedSpaceUser" :key="index" class="list-cricle-e">
                  <a>{{user.firstName[0].toUpperCase()+user.lastName[0].toUpperCase()}}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="pull-left">
            <div class="add-plus">
              <a href="javascript:void(0)">
                <i
                  data-toggle="modal"
                  data-target="#inviteUserModal"
                  class="fa fa-plus"
                  aria-hidden="true"
                ></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-md-6 add-new text-right">
          <ul>
            <li>
              <a href="javascript:void(0)" class="freshBtn">
                <i class="fa fa-share" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <router-link :to="{name:'upload-image'}" class="add-newBtn">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>Add New Image</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

    
    </div>
  </div>
</template>
<script>
import { EE } from "@/helpers/eventEmitter.js";
import { Get } from "@/helpers/api-helper.js";
export default {
  components: {
  
  },
  data() {
    return {
      selectedSpace: {},
      selectedSpaceUser: [],
      
    };
  },
  created() {
    EE.on("selectedSpace", space => {
      this.selectedSpace = space;
      this.getImagesOfSpace(space);
      this.getUsersOfSpace(space);
    });
  },
  methods: {
    getImagesOfSpace(space) {
      Get(`/api/v1/space/${space.id}/screens`).then(res => {
        return res;
      });
    },
  
    getUsersOfSpace(space) {
      Get(`/api/v1/space/${space.id}/users`).then(res => {
        if (res && res.length > 0) {
          this.selectedSpaceUser = res;
        }
      });
    },
    deleteSpace() {
      alert(this.selectedSpace.title);
    }
  }
};
</script>
<style scoped>


.dropzone-custom-title {
  margin-top: 0;
  color: #00b782;
}

.subtitle {
  color: #314b5f;
}
</style>