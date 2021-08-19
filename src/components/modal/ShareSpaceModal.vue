<template>
  <!-- share-space-modal -->
  <modal id="share-space-modal">
    <div slot="body">
      <div class="px-6 pt-4 pb-6">
        <h3 class="text-xl font-semibold text-heading-color-e">Share <span class="text-savah-green">Neon World</span></h3>
      </div>
      <div>
        <form>
          <div class="tabs border-b border-gray-500 mb-3">
            <ul class="flex px-6 pb-2">
              <li class="pr-5">
                <a class="text-sm b-bottom text-tab-text-color" href="#">
                  <img class="inline-block mr-1" src="@/assets/icon-url.png" width="15" alt="Url img"  />
                  URL
                </a>
              </li>
              <li class="pr-5">
                <a class="text-sm b-bottom b-bottom-active" href="#">
                  <img class="inline-block mr-1" src="@/assets/icon-email.png" width="13" alt="email img" />
                  Email
                </a>
              </li>
              <li class="pr-5">
                <a class="text-sm b-bottom text-tab-text-color" href="#">
                  <img class="inline-block mr-1" src="@/assets/icon-embd.png" width="18" alt="embd img" />
                  Embed
                </a>
              </li>
              <li class="pr-5">
                <a class="text-sm b-bottom text-tab-text-color" href="#">
                  <img class="inline-block mr-1" src="@/assets/icon-sms.png" width="13" alt="sms img" />
                  SMS
                </a>
              </li>
            </ul>
          </div>
          <div class="share-open px-6 py-4">
            <button type="text" class="pl-8 relative check-icon text-base h-10 appearance-none block w-full bg-light-green text-savah-green  border border-gray-200 rounded py-2 px-4 leading-tight font-light focus:outline-none focus:savah-green border-savah-green text-left">
              Share with open person
            </button>
          </div>
          <div class="w-full px-6 mb-4">
            <label class="block tracking-wide text-sm font-bold mb-2 text-heading-color-e">Email Address
              <span class="tooltips-custom relativer inline-block ">
                <img class="inline-block mr-1" src="@/assets/icon-tooltips.png" width="15" alt="Q img" />
                <span class="tooltiptext-custom   invisible w-2/4 bg-gray-800 text-white absolute text-xs font-light h-8 rounded p-2 text-center -space-y-4 ">Use a comma to separate email address</span>
              </span>
            </label>
            <tag-selector class="vue-tage-list focus:border-topaz" name="tags" v-model="tags" :regex="/.+@.+/" regexError="Input valid email address" />
          </div>
          <label class="px-6 block pb-4">
            <input class="mr-2 leading-tight" type="checkbox">
            <span class="text-sm font-light text-heading-color-e">
              Add Password Protection
            </span>
          </label>
          <div class="w-full block footer-border-top pt-4 pb-6 px-6">
            <div class="flex flex-wrap items-center justify-end">
              <button type="button" @click="close" class="h-8 text-btn-color-non-active w-20 focus:outline-none rounded-md border mr-4  border-btn-border font-medium  text-sm">
                Cancel
              </button>
              <button type="button" class="w-20 h-8 focus:outline-none rounded-md border-2 border-savah-green bg-savah-green text-white font-medium text-sm">
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </modal>
</template>
<script>
import TagSelector from "vue-tag-selector";

export default {
  components: {
    TagSelector,

  },
  data() {
    return {
      tags: [],
    }
  },
  methods: {
    close() {
      VoerroModal.hide('share-space-modal');
    },
  }
}

</script>
<style>
.modal-box {
  border-radius: 5px !important;
  min-width: 30% !important;
}

.modal-header {
  border: none !important;
}

.b-bottom:hover {
  border-bottom: 2px solid #2b3035;
  padding-bottom: 11px;
}

.b-bottom-active {
  border-bottom: 2px solid #2b3035;
  padding-bottom: 11px;
  color: #2b3035;
}

.check-icon::before {
  background-color: transparent;
  border-left: 2px solid #1a99aa;
  border-bottom: 2px solid #1a99aa;
  @apply absolute h-2 w-3;
  content: "";
  left: 12px;
  top: 13px;
  transform: rotate(-52deg);

}

</style>
