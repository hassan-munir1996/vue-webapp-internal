<template>
  <div class="relative">
    <div @click="openDropDownMenu" class="cursor-pointer ml-4" 
      :class="{
        'newStatusIcon': transformStatus === 'new',
        'progressStatusIcon': transformStatus === 'inprogress',
        'reviewStatusIcon': transformStatus === 'needsreview',
        'approvedStatusIcon': transformStatus === 'approved',
        'onholdStatusIcon': transformStatus === 'onhold',
      }"
    ></div>
    <div @click="openDropDownMenu" class="w-48 absolute right-0 mt-16 mr-2 bg-black dropdownBox z-50" v-if="dropdownMenu" v-click-outside="closeDropDown">
      <ul>
        <li @click="updateScreenStatus('New')">
          <input type="radio" name="radio" class="hidden new" />
          <label class="flex items-center cursor-pointer newLabel">
            <span class="w-5 h-5 inline-block mr-2 rounded-full flex-no-shrink"  :class="{'newStatusIcon': transformStatus === 'new'}"></span>
            New</label>
        </li>
        <li @click="updateScreenStatus('In Progress')">
          <input type="radio" name="radio" class="hidden progress" />
          <label class="flex items-center cursor-pointer progressLabel">
            <span class="w-5 h-5 inline-block mr-2 rounded-full flex-no-shrink" :class="{'progressStatusIcon': transformStatus === 'inprogress'}"></span>
            In Progress</label>
        </li>
        <li @click="updateScreenStatus('Needs Review')">
          <input type="radio" name="radio" class="hidden review" />
          <label class="flex items-center cursor-pointer reviewLabel">
            <span class="w-5 h-5 inline-block mr-2 rounded-full flex-no-shrink" :class="{'reviewStatusIcon': transformStatus === 'needsreview'}"></span>
            Needs Review</label>
        </li>
        <li @click="updateScreenStatus('Approved')">
          <input type="radio" name="radio" class="hidden approved" />
          <label class="flex items-center cursor-pointer approvedLabel">
            <span class="w-5 h-5 inline-block mr-2 rounded-full flex-no-shrink" :class="{'approvedStatusIcon': transformStatus === 'approved'}"></span>
            Approved</label>
        </li>
        <li @click="updateScreenStatus('On Hold')">
          <input type="radio" name="radio" class="hidden onhold" />
          <label class="flex items-center cursor-pointer onholdLabel">
            <span class="w-5 h-5 inline-block mr-2 rounded-full flex-no-shrink" :class="{'onholdStatusIcon': transformStatus === 'onhold'}"></span>
            On Hold</label>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      dropdownMenu: false,
    }
  },
  computed: {
    ...mapGetters('screen', {
      status: 'getScreenStatus'
    }),

    transformStatus() {
      let hasSpaces = /\s/g.test(this.status)
      let status = this.status;
      if (hasSpaces) {
        status = status.replace(/\s/g, '');;
      }
      // console.log('Status', status);
      return status && status.toLowerCase();
    }
  },
  methods: {

    ...mapMutations("app", {
      setLoader: 'setLoader',
    }),

    ...mapMutations("screen", {
      setScreenStatus: 'setScreenStatus',
    }),

    ...mapActions("home", {
      _updateScreenStatus: 'updateScreenStatus'
    }),

    openDropDownMenu() {
      this.dropdownMenu = true;
    },

    closeDropDown() {
      this.dropdownMenu = false;
    },

    updateScreenStatus(status) {
      this.setLoader(true);
      this._updateScreenStatus({
        id: this.$route.params.screenId,
        projectId: this.$route.params.projectId,
        status: status
      }).then(res => {
        this.setLoader(false);
        this.dropdownMenu = false;
        this.setScreenStatus(res.status);

      }).catch(err => {
        this.setLoader(false);

      })
    },
  }
}

</script>
<style scoped>
.newLabel {
  color: #999;
  font-weight: normal !important;
  font-size: 15px;
}

.newLabel:hover {
  color: #4576B9;
}


.new+label span {
  border: 2px solid #4576B9;
  transition: background .2s,
    transform .2s;
}

.new+label span:hover,
.new+label:hover span {
  color: #4576B9;
  background-color: #4576B9;
  box-shadow: 0px 0px 0px 2px black inset;
}

.new:checked+label span {
  background-color: #4576B9;
}




.progressLabel {
  color: #999;
  font-weight: normal !important;
  font-size: 15px;
}

.progressLabel:hover {
  color: #E4DE75;
}


.progress+label span {
  border: 2px solid #E4DE75;
  /* @apply bg-gray-400 border-gray-400; */
  transition: background .2s,
    transform .2s;
}

.progress+label span:hover,
.progress+label:hover span {
  color: #E4DE75;
  background-color: #E4DE75;
  box-shadow: 0px 0px 0px 2px black inset;
}

.progress:checked+label span {
  background-color: #3490DC;
}


.approvedLabel {
  color: #999;
  font-weight: normal !important;
  font-size: 15px;
}

.approvedLabel:hover {
  color: #98EB78;
}


.approved+label span {
  border: 2px solid #98EB78;
  /* @apply bg-gray-400 border-gray-400; */
  transition: background .2s,
    transform .2s;
}

.approved+label span:hover,
.approved+label:hover span {
  color: #98EB78;
  background-color: #98EB78;
  box-shadow: 0px 0px 0px 2px black inset;
}

.approved:checked+label span {
  background-color: #3490DC;
}

.approved:checked+label {
  /* color: #3490DC; */
}

.reviewLabel {
  color: #999;
  font-weight: normal !important;
  font-size: 15px;
}

.reviewLabel:hover {
  color: #4497AB;
}


.review+label span {
  border: 2px solid #4497AB;
  /* @apply bg-gray-400 border-gray-400; */
  transition: background .2s,
    transform .2s;
}

.review+label span:hover,
.review+label:hover span {
  color: #4497AB;
  background-color: #4497AB;
  box-shadow: 0px 0px 0px 2px black inset;
}

.review:checked+label span {
  background-color: #3490DC;
}

.review:checked+label {
  /* color: #3490DC; */
}

.onholdLabel {
  color: #999;
  font-weight: normal !important;
  font-size: 15px;
}

.onholdLabel:hover {
  color: #B65F3F;
}


.onhold+label span {
  border: 2px solid #B65F3F;
  /* @apply bg-gray-400 border-gray-400; */
  transition: background .2s,
    transform .2s;
}

.onhold+label span:hover,
.onhold+label:hover span {
  color: #B65F3F;
  background-color: #B65F3F;
  box-shadow: 0px 0px 0px 2px black inset;
}

.onhold:checked+label span {
  background-color: #3490DC;
}

.onhold:checked+label {
  /* color: #3490DC; */
}


.dropdownBox {
  top: -4px;
  border-radius: 4px;
}

.dropdownBox li {
  padding: 10px 30px;
  border-top: #1f1f1f solid 1px;
}

</style>
