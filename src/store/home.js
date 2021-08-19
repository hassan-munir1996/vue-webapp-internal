import { Get, Post, PostImage, Delete, DeleteWithNoResponse, Put } from '@/helpers/api-helper.js';

// ===================================================States=======================================================
const state = {
  spaces: [],
  companyTeams: [],
  defaultSpace: null,
  searchScreensPageNumber: 0,
  spaceScreensPageNumber: 0,
  metaData: [],
  searchScreens: [],
  spaceScreens: [],
  spaceUsers: [],
  searchFilters: [],
  selectedSpaceFilters: [],

  selectedSpace: null,

};

// ===================================================Getters=======================================================
const getters = {
  
  getSpaces: (state) => state.spaces,
  getCompanyTeams: (state) => state.companyTeams,
  getDefaultSpace: (state) => state.defaultSpace,
  getSearchScreensPageNumber: (state) => state.searchScreensPageNumber,
  getSpaceScreensPageNumber: (state) => state.spaceScreensPageNumber,
  getMetaData: (state) => state.metaData,
  getSearchScreens: (state) => state.searchScreens,
  getSpaceScreens: (state) => state.spaceScreens,
  getSpaceUsers: (state) => state.spaceUsers,
  getSearchFilters: (state) => state.searchFilters,
  getSelectedSpaceFilters: (state) => state.selectedSpaceFilters,
};

// ===================================================Mutations=======================================================
const mutations = {
    // Set Spaces
    setSpaces: (state, payload) => {
        state.spaces = payload;
    },

    // Set Company Team
    setCompanyTeams: (state, payload) => {
        state.companyTeams = Object.assign([], payload);
    },

    // Set Default Space
    setDefaultSpace: (state, payload) => {
        state.defaultSpace = payload;
        return;
    },

    // Add new creted Space in existing Spaces in the begining
    addNewSpace: (state, data) => {
        state.spaces.unshift(data);
    },

    // Set Meta Data
    setMetaData: (state, data) => {
        state.metaData = Object.assign([], data);
    },

    // Set search Filters
    setSearchFilters : (state, payload) => {
        console.log('search filters', payload);
        state.searchFilters = payload;
    },

    // set search screens 
    setSearchScreens : (state, payload) => {
        if (payload == '') {
            state.searchScreens = [];
        } else {
            state.searchScreens = [...state.searchScreens, ...payload];
        }
        return;
    },

    // overwrite search screens 
    overwriteSearchScreens : (state, payload) => {
        state.searchScreens = payload;
    },
    
    // Set space screens
    setSpaceScreens: (state, payload) => {
      if (payload == '') {
      state.spaceScreens = [];
      } else {
      state.spaceScreens = [...state.spaceScreens, ...payload];
      }
      return;
    },

    // set space Screens page number
    setSpaceScreensPageNumber(state, payload) {
      state.spaceScreensPageNumber = payload;
      return;
    },

    // set Search Screens page number
    setSearchScreensPageNumber(state, payload) {
      state.searchScreensPageNumber = payload;
      return;
    },

    // Set Space Users
    setSpaceUsers: (state, payload) => {
        if (payload == '') {
        state.spaceUsers = [];
        } else {
        state.spaceUsers = [...state.spaceUsers, ...payload];
        }
        return;
    },

    // Remove deleted space from Spaces array 
    deleteSpace: (state, spaceId) => {
        state.spaces = Object.assign([], state.spaces.filter( space => space.id !== spaceId ));
    },

    // Set Filters
    setFilters: (state, payload) => {
      if (payload == '') {
        state.selectedSpaceFilters = [];
      } else {
        state.selectedSpaceFilters = payload;
      }
      return;
    },

    // Invite Users
    inviteUser: (state, data) => {
    //   console.log(state, data);
    },

    // update space
    setUpdateSpace: (state, payload) => {
        state.defaultSpace = payload;
        
        let spaces = state.spaces.map( (space) => {
            return space.id === payload.id ? payload : space;
        });
        
        // console.log('updates spaces', spaces);
        state.spaces = spaces;
        return;
    }
};

// ===================================================Actions=======================================================
const actions = {

    // fetch All Spaces
    fetchAllSpaces: ({ commit }) => {
        var url = `/api/v1/spaces/`;

        return Get(url)
        .then( async (response) => {
            await commit('setSpaces', response);
            return response;
        })
        .catch((err) => {
            throw err;
        });
    },
  
    // fetch All Company Teams
    fetchAllCompanyTeams: ({ commit }) => {

        var url = '/api/v1/company/teams';

        return Get(url)
        .then((res) => {
            commit('setCompanyTeams', res);
            return res;
        })
        .catch((err) => {
            return err;
        });
    },

    // create new Space 
    createSpace: ({ commit }, data) => {

        var url = `/api/v1/spaces?title=${data.title}&description=${data.description}&team=${data.team}`;

        return Post(url, data)
        .then((res) => {
            if (res) {
            commit('addNewSpace', res);
            return res;
            }
        })
        .catch((err) => {
            throw err;
        });
    },
    
    // fetch Meta Data
    fetchMetaData: ({ commit }) => {

        var url = '/api/v1/screen/meta-data';

        return Get(url)
        .then((res) => {
            commit('setMetaData', res);
            return res;
        })
        .catch((err) => {
            return err;
        });
    },

    // fetch all sreach screens
    fetchAllSearchScreens: async ({ commit }, payload) => {
        
      let params = `?pageNumber=${Number.parseInt(payload.page)}&pageSize=${Number.parseInt(payload.pageSize)}`;
      
      if(payload.keywords && payload.keywords.length !== 0) {
          let keywords = {
              tags: [],
              status: [], 
              createdBy: '',
              updatedOn: '',
          };
          let types = new Set();

          payload.keywords.forEach((item) => {
              if(item.type === 'tags') {
                keywords.tags.push(item.value);}
              else if(item.type === 'status') {
                keywords.status.push(item.value);
              } else if(item.type === 'createdBy') {
                keywords.createdBy = item.value;
              } else if(item.type === 'updatedOn') {
                keywords.updatedOn = item.value;}
              types.add(item.type);
          });
          types.forEach(type => {
              params += `&${type}=${keywords[type]}`;
          });
      }
      var url = `/api/v1/search/screens${params}`;
      return Get(url, payload.signal)
      .then( async (res) => {
        if(res.code === undefined) {
          //payload.keywords.length === 0 ? await commit('setSearchScreens', res) : await commit('overwriteSearchScreens', res);
            commit('setSearchScreens', res);
          return res;
        }
      })
      .catch((err) => {
          throw err;
      });
    },

    // fetch all screens of default space
    fetchAllScreensOfDefaultSpace: ({ commit }, payload) => {
        let url;

        if (payload.page !== '' && payload.pageSize !== '') {
            url = `/api/v1/spaces/${payload.spaceId}/screens?page=${Number.parseInt(payload.page)}&pageSize=${Number.parseInt(payload.pageSize)}`;
        } else if (payload.page === '' && payload.pageSize !== '') {
            url = `/api/v1/spaces/${payload.spaceId}/screens?pageSize=${Number.parseInt(payload.pageSize)}`;
        } else {
            url = `/api/v1/spaces/${payload.spaceId}/screens`;
        }

        return Get( url, payload.signal).then( async (res) => {
            if(res.code === undefined) {
                await commit('setSpaceScreens', res);
                return res;
            }
        })
        .catch((err) => {
            throw err;
        });
    },

    // Fetch all users of Default Space
    fetchAllUsersofDefaultSpace: ({ commit }, payload) => {

        var url = `/api/v1/spaces/${payload.spaceId}/users`;
        return Get(url, payload.signal)
        .then((res) => {
            if(res.code === undefined) {
                commit('setSpaceUsers', res);
                return res;
            }
        })
        .catch((err) => {
            throw err;
        });
    },

    // Delete Space
    deleteSpace: ({ commit }, spaceId) => {

        var url = `/api/v1/spaces/${spaceId}`;

        return Delete(url)
        .then((res) => {
            commit('deleteSpace', spaceId);
            return res;
        })
        .catch((err) => {
            throw err;
        });
    },

    // Create New Screens of Default Space
    // eslint-disable-next-line no-unused-vars
    createScreen: ({ commit }, payload) => {

        var url = `/api/v1/screen/upload/project/${payload.projectId}?version=true`;

        return PostImage(url, payload.file)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
    },

    // Delete Screen
    deleteScreen: ({ state }, payload) => {
        var url = `/api/v1/screen/${payload.screenId}/project/${payload.projectId}`;

        return DeleteWithNoResponse(url)
        .then((res) => {
            var index;
            if(state.defaultSpace) {
                index = state.spaceScreens.findIndex(image => image.id == payload.screenId);
                state.spaceScreens.splice(index, 1);
            } else{
                index = state.searchScreens.findIndex(image => image.id == payload.screenId);
                state.searchScreens.splice(index, 1);
            }
            return res;
        })
        .catch((err) => {
            throw err;
        });
    },


    // Add or Remove Filters
    addOrRemoveFilter: ({ commit, state }, payload) => {
        const filters = state.selectedSpaceFilters;
        const index = filters.indexOf(payload);
        if (index > -1) {
            filters.splice(index, 1);
            commit('setFilters', filters);
        } else {
            filters.push(payload);
            commit('setFilters', filters);
        }
    },
      
    // Invite Users
    inviteUsers: ({ commit }, data) => {

      var url = '/api/v1/company/send-invitations';
      // if (process.env.NODE_ENV === 'production') {
      //   url = '/company/send-invitations';
      // }

      return Post(url, data)
        .then((res) => {
          if (res) {
            commit('inviteUser', res);
            return res;
          }
        })
        .catch((err) => {
          throw err;
        });
    },

    // Update Screen Action
    // eslint-disable-next-line no-unused-vars
    updateScreenStatus: ({ commit }, data) => {

      var url = '/api/v1/screen/';
      
      return Put(url, data)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },

    // Update Space details
    // eslint-disable-next-line no-unused-vars
    updateSpaceDetails: ({commit}, payload) => {

      var url = `/api/v1/spaces/${payload.id}`;
      
      return Put(url, payload)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          throw err;
        });
    }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
