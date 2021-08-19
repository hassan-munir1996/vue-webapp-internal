<template>
  <div>
    <multiselect ref="autocomplete" :max="5" @input="onSearchInput" v-model="select" @search-change="onSearchChange" :searchable="true" track-by="text" :multiple="true" :options="searchItems" :show-labels="false" label="text" :placeholder="placeHolder" :close-on-select="false" @close="closeDropdown">
    </multiselect>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import { EE } from "@/helpers/eventEmitter.js";

export default {
  name: 'Search',

  // ===================================================Data=======================================================
  data() {
    return {
      select: null,
      searchItems: [],
      metaData: [],
      defaultItems: [{
          text: '#Tags',
          value: 'tags',
          type: 'tags',
          key: '#',
        },
        {
          text: 'Status',
          value: 'status',
          type: 'status',
          key: '!',
        },
        {
          text: 'Times',
          value: 'times',
          type: 'updatedOn',
          key: '~',
        },
        {
          text: '@Users',
          value: 'users',
          type: 'createdBy',
          key: '@',
        },
      ],
    };
  },

  // ===================================================Mounted=======================================================
  async mounted() {

    EE.on("clearSearch", () => {
      this.select = null;
    });

    this.searchItems = this.defaultItems;

    // Event runs whenever fetch meta data request is completed 
    EE.on('fetchMetaDataCompleted', () => {
      
      let data = {};
      let md = this._getMetaData // Get meta data from store
      const keys = Object.keys(md);
      keys.forEach((item) => {
        if (md[item]) {
          data[item] = this.getKeyValuePairs(md[item], item);
        }
      });
      this.metaData = data;
    });
  },

  // ===================================================Before Destroy =======================================================
  beforeDestroy() {
    // console.log('Search Before Destroy');
    EE.removeAllListeners(["clearSearch", 'fetchMetaDataCompleted']);
  },

  // ===================================================Computed=======================================================
  computed: {
    ...mapGetters('home', {
      _getMetaData: 'getMetaData',
      _getDefaultSpace: "getDefaultSpace",
    }),

    placeHolder() {
      if(this.select === null || this.select.length === 0){
        return "Search people and tags...";
      } else {
        return '';
      } 
    },
  },

  // ===================================================Methods=======================================================
  methods: {

    ...mapMutations('home', {
      _setSearchScreens: "setSearchScreens",
      _setSearchFilters: "setSearchFilters",
    }),

    // set search elements according to key vlaue pairs
    getKeyValuePairs(array, type) {
      let data = [];
      array.forEach((item) => {
        if (type === 'users') {
          data.push({
            text: `@${item.userName}`,
            value: item.userName,
            type: 'createdBy',
          });
        } else {
          const text = type == 'tags' ? `#${item}` : item;
          data.push({
            text: text,
            value: item,
            type: type == 'times' ? 'updatedOn' : type,
          });
        }
      });
      return data;
    },

    // When search value changes
    onSearchChange(value) {
      // console.log('when search changes', value);
      if (value) {
        const key = value[0];
        if (['#', '@'].includes(value[0])) {
          const value = key == '#' ? 'tags' : 'users';
          this.searchItems = this.metaData[value];
        }
      }
    },

    // Close search dropdown
    closeDropdown() {
      this.searchItems = this.defaultItems;
    },

    async onSearchInput(data) {
      // console.log('On serach input', data);
      let filtered = [];
      var temp = {
        tags: [],
        status: [],
        createdBy: '',
        updatedOn: ''
      };
      data.filter((item) => {
        if (!item.hasOwnProperty('key') && typeof item == 'object') {
          if(item.type === 'tags') {
            temp.tags.push(item);
          } else if(item.type === 'createdBy') {
            temp.createdBy = item;
          } else if(item.type === 'updatedOn') {
            temp.updatedOn = item;
          } else if(item.type === 'status') {
            temp.status.push(item);
          }
        }
      });
      if(temp.tags.length != 0 || temp.status.length != 0) {
        filtered = [...temp.tags, ...temp.status];
      }
      if(temp.updatedOn !== '') {
        filtered.push(temp.updatedOn);
      } 
      if(temp.createdBy !== '') {
        filtered.push(temp.createdBy);
      }

      let filteredTags = temp.tags.map(tag => {
        return tag.value;
      });

      this._setSearchFilters(filteredTags);
      this.select = filtered;

      if (data.length) {
        // console.log('On serach input', data[data.length - 1].key);
        if (data[data.length - 1].key) {

          this.searchItems = this.metaData[data[data.length - 1].value];
          // console.log('On serach input', this.searchItems, data);
          data.splice(0, 1);
          return;
        }
      }

      EE.emit("searchScreens", filtered);
    },
  },

};

</script>
<style>
.multiselect {
  height: 100% !important;
  min-height: 100% !important;
  /* width: 32rem !important; */
}

.multiselect__input,
.multiselect__tags {
  border: none !important;
  background-color: white !important;
  height: 100% !important;
}

.multiselect__tags {
  height: 100% !important;
  padding: 22px 40px !important;
  font-size: 18px !important;
  display: flex!important;
}

.multiselect__tags-wrap{
  display: inline-flex!important;
}

.multiselect__tag {
  color: #1a99aa !important;
  background: white !important;
}

.multiselect__option--highlight {
  background: #1a99aa !important;
}

.multiselect__element {
  border-bottom: 1px solid #f5f5f5;
}

.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
  background-color: #1a99aa !important;
}

/* ======================== Browser scrollbar css ========================== */


/* width */

.multiselect__content-wrapper::-webkit-scrollbar {
  width: 7px;
}


/* Track */

.multiselect__content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
}


/* Handle */

.multiselect__content-wrapper::-webkit-scrollbar-thumb {
  background: #888;
}


/* Handle on hover */

.multiselect__content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.multiselect__tag-icon:after {
  content: '\002B' !important;
  color: #1a99aa !important;
  font-size: 18px;
}

.multiselect__tag-icon:hover:after {
  color: #fff !important;
}

.multiselect__select {
  display: none !important;
}

</style>
