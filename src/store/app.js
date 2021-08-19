import { Get, Post, PostImage, Delete, DeleteWithObjectData, Put } from '@/helpers/api-helper.js';

// ===================================================States=======================================================
const state = {
  currentUser: [],
  loader: false,
};

// ===================================================Getters=======================================================
const getters = {
  getCurrentUser: (state) => state.currentUser,
  isLoading: (state) => state.loader,
};

// ===================================================Mutations=======================================================
const mutations = {
  setCurrentUser: (state, data) => {
    state.currentUser = data;
  },

  setLoader(state, payload) {
    state.loader = payload;
  },
};

// ===================================================Actions=======================================================
const actions = {

  // fetch Current User
  fetchCurrentUser({ commit }, data) {

    var url = '/api/v1/company/user';
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/company/user`;
    // }

    return Get(url).then((res) => {
      commit('setCurrentUser', res);
      return res;
    })
    .catch((err) => {
      throw err;
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
