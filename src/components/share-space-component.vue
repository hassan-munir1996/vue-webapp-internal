<template>
  <div id="shareSpaceModal" class="modal fade" role="dialog">
    <!--    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <strong>Share</strong> <strong style="color: #1a99aa;">Neon World</strong>
          </h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <v-tabs v-model="tab" slider-color="black">
            <v-tab>
              <i class="fa fa-link"> <span>URL</span></i>
            </v-tab>
            <v-tab>
              <i class="fa fa-envelope"> <span>Email</span> </i>
            </v-tab>
            <v-tab>
              <i class="fa fa-code"> <span>Embed</span> </i>
            </v-tab>
            <v-tab>
              <i class="fa fa-mobile"> <span>SMS</span> </i>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              URL sharing unavailable
            </v-tab-item>
            <v-tab-item>
              <div class="email-share">
                <div class="alert alert-primary" role="alert"><i class="fa fa-check"></i> Shared with one person</div>
                <div class="form-group">
                  <label>
                    Email Address
                    <i v-tooltip.right="'Use space to separate email address'" class="fa fa-question-circle"></i>
                  </label>
                  <tag-selector name="tags" v-model="tags" />
                </div>
                <div class="form-group">
                  <div class="checkbox">
                    <label>
                      <input type="checkbox" value /> <small>Add Password protection</small>
                    </label>
                  </div>
                </div>
              </div>
            </v-tab-item>
            <v-tab-item>
              Embed sharing unavailable
            </v-tab-item>
            <v-tab-item>
              SMS sharing unavailable
            </v-tab-item>
          </v-tabs-items>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" data-dismiss="modal">Cancel</button>
          <button class="btn btn-primary">Share</button>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
// import TagSelector from "vue-tag-selector";
export default {
  name: "ShareModal",
  components: {
    // TagSelector
  },
  data() {
    return {
      tags: [],
      tab: 1
    };
  }
};

</script>
<style scoped>
::v-deep .v-slide-group__content {
  border-bottom: solid 1px #e0e0e0;
}

.v-tab.v-tab {
  padding: 0;
}

.fa-question-circle {
  color: gray;
}

span {
  font-family: sans-serif;
}

.email-share {
  margin-top: 20px;
  margin-left: 25px;
  margin-right: 25px;
}

.modal-header {
  padding: 25px;
}

small {
  font-size: 14px;
  position: relative;
  bottom: 4px
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #2b3035;
}

.btn-primary {
  min-width: 80px;
}

.modal-dialog {
  margin-top: 10%;
}

.modal-body {
  padding: 0;
}

.vue-tabs {
  font-size: 12px;
}

label {
  font-size: 14px;
  margin: 0px;
}

.tagSelector {
  font-size: 14px;
  margin: 0px;
}

.form-control {
  font-size: 14px;
}

.tag-selector--item {
  font-size: 12px;
}

.btn-primary,
.btn-primary:hover,
.btn-primary::after,
.btn-primary::before,
.btn-primary:focus {
  background: #1a99aa;
  border: #1a99aa;
}

.btn-cancel {
  background: white;
  color: gray;
  border: 1px solid #e9e9e9;
}

::v-deep button {
  outline: none !important;
}

.alert {
  padding: 7.5px 14px;
  font-size: 14px;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #1a99aa;
}

input[type=checkbox] {
  width: 19px;
  height: 19px;
}

</style>
