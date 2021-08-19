import { Get, Post, PostImage, Delete, DeleteWithObjectData, Put } from '@/helpers/api-helper.js';
// import { EE } from "@/helpers/eventEmitter.js";
import Vue from 'vue'
var _ = require('lodash');
const state = {
  screenTab: 'play',
  commentBox: false,
  screenStatus: null,
  nextScreenArrow: true,
  previousScreenArrow: true,
  screenDescription: null,
  fullPreviewScreen: false,
  verticalPreviewScreen: false,
  horizontalPreviewScreen: false,
  spaces: [],
  screens: [],
  selectedSpace: null,
  selectedSpaceImages: [],
  selectedSpaceImageDetail: [],
  selectedSpaceUsers: [],
  companyTeams: [],
  meta_data: [],
  loader: false,
  feedbackList: [],
  screenVersions: [],
  currentUser: [],
  pageNumber: 0,
  imageDetailStatus: false,
};

// getters
const getters = {
  getSpaces: (state) => state.spaces,
  getScreens: (state) => state.screens,
  getSelectedSpace: (state) => state.selectedSpace,
  getSelectedSpaceImages: (state) => state.selectedSpaceImages,
  getSelectedSpaceImageDetail: (state) => state.selectedSpaceImageDetail,
  getSelectedSpaceUsers: (state) => state.selectedSpaceUsers,
  getCompanyTeams: (state) => state.companyTeams,
  getMetaData: (state) => state.meta_data,
  isLoading: (state) => state.loader,
  getFeedbackList: (state) => state.feedbackList,
  getScreenVersions: (state) => state.screenVersions,
  getCurrentUser: (state) => state.currentUser,
  getPageNumber: (state) => state.pageNumber,
  // New entries
  getScreenTab: (state) => state.screenTab,
  getCommentBoxBool: (state) => state.commentBox,
  getScreenStatus: (state) => state.screenStatus,
  getNextScreenArrow: (state) => state.nextScreenArrow,
  getPreviousScreenArrow: (state) => state.previousScreenArrow,
  getScreenDescription: (state) => state.screenDescription,
  getFullPreviewScreen: (state) => state.fullPreviewScreen,
  getVerticalPreviewScreen: (state) => state.verticalPreviewScreen,
  getHorizontalPreviewScreen: (state) => state.horizontalPreviewScreen,
  getImageDetailStatus: (state) => state.imageDetailStatus,
};

// actions
const actions = {
  getMetaData: ({ commit }) => {

    var url = '/api/v1/screen/meta-data';
    // if (process.env.NODE_ENV === 'production') {
    //   url = '/screen/meta-data';
    // }

    return Get(url)
      .then((res) => {
        commit('setMetaData', res);
        return res;
      })
      .catch((err) => {
        return err;
      });
  },
  getCompanyTeams: ({ commit }) => {

    var url = '/api/v1/company/teams';
    // if (process.env.NODE_ENV === 'production') {
    //   url = '/company/teams';
    // }

    return Get(url)
      .then((res) => {
        commit('setCompanyTeams', res);
        return res;
      })
      .catch((err) => {
        return err;
      });
  },
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
  createSpace: ({ commit }, data) => {

    var url = `/api/v1/spaces?title=${data.title}&description=${data.description}&team=${data.team}`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/spaces?title=${data.title}&description=${data.description}&team=${data.team}`;
    // }

    return Post(url, data)
      .then((res) => {
        if (res) {
          commit('createSpace', res);
          return res;
        }
      })
      .catch((err) => {
        throw err;
      });
  },
  createScreen: ({ commit }, payload) => {

    var url = `/api/v1/screen/${payload.screenId}/upload/project/${payload.projectId}?version=true`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/screen/upload/project/${data.spaceId}?version=true`;
    // }


    return PostImage(url, payload.file)
      .then((res) => {
        if (res) {
          commit('createScreen', res);
          return res;
        }
      })
      .catch((err) => {
        throw err;
      });
  },
  selectSpace: ({ commit }, space) => {
    commit('setSelectedSpace', space);
  },
  getSpaces: ({ commit }) => {

    var url = `/api/v1/spaces/`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = '/spaces/';
    // }


    return Get(url)
      .then(res => {
        commit('setSpaces', res);
        if (res.length > 0) {
          commit('setSelectedSpace', res[0]);
        }
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  getSpaceImages: ({ commit, state }, payload) => {
    // commit('setSelectedSpaceImages', []);

    let url;

    if (payload.page !== '' && payload.pageSize !== '') {
      url = `/api/v1/spaces/${payload.spaceId}/screens?page=${Number.parseInt(payload.page)}&pageSize=${Number.parseInt(payload.pageSize)}`;
    } else if (payload.page === '' && payload.pageSize !== '') {
      url = `/api/v1/spaces/${payload.spaceId}/screens?pageSize=${Number.parseInt(payload.pageSize)}`;
    } else {
      url = `/api/v1/spaces/${payload.spaceId}/screens`;
    }


    // var url = `/api/v1/spaces/${spaceId}/screens??page=${Number.parseInt(payload.page)}&pageSize=${Number.parseInt(payload.pageSize)}`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/spaces/${spaceId}/screens`;
    // }


    return Get(url)
      .then((res) => {
        commit('setSelectedSpaceImages', res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  getSpaceImageDetail: async ({ commit }, payload) => {

    var url = `/api/v1/screen/${payload.screenId}/project/${payload.projectId}`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/screen/${payload.screenId}/project/${payload.projectId}`;
    // }
    commit('imageDetailStatus', false);
    await commit('setSelectedSpaceImageDetail', []);
    return Get(url)
      .then((res) => {
        commit('setSelectedSpaceImageDetail', res);
        commit('imageDetailStatus', true);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  getSpaceUsers: ({ commit }, spaceId) => {

    var url = `/api/v1/spaces/${spaceId}/users`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/spaces/${spaceId}/users`;
    // }

    return Get(url)
      .then((res) => {
        commit('setSelectedSpaceUsers', res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  deleteSpace: ({ commit }, spaceId) => {

    var url = `/api/v1/spaces/${spaceId}`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/spaces/${spaceId}`;
    // }


    return Delete(url)
      .then((res) => {
        commit('setSelectedSpaceImages', []);
        commit('setSelectedSpaceUsers', []);
        commit('deleteSpace', spaceId);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  deleteSpaceImage: ({ state }, payload) => {
    var url = `/api/v1/screen/${payload.screenId}/project/${payload.projectId}`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/spaces/${spaceId}`;
    // }

    return Delete(url)
      .then((res) => {

        var index = state.selectedSpaceImages.findIndex(image => image.id == payload.screenId);
        state.selectedSpaceImages.splice(index, 1);

        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  searchImages: ({ commit }, keywords) => {

    let params = '?';

    keywords.forEach((item, index) => {
      params += `${item.type}=${item.value}&`;
    });


    var url = `/api/v1/search/screens${params}`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/search/screens${params}`;
    // }

    return Get(url)
      .then((res) => {
        commit('setSelectedSpaceImages', res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  getFeedbackList: ({ commit }, payload) => {

    var url = `/api/v1/feedback/project/${payload.projectId}/screen/${payload.screenId}?completed=false`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/feedback/project/${payload.projectId}/screen/${payload.screenId}?completed=false`;
    // }

    return Get(url)
      .then(res => {
        commit('setFeedbackList', res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  getScreenVersions: ({ commit }, payload) => {

    var url = `/api/v1/screen/${payload.screenId}/versions/project/${payload.projectId}`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/screen/${payload.screenId}/versions/project/${payload.projectId}`;
    // }


    commit('setScreenVersions', []);
    return Get(url)
      .then(res => {
        commit('setScreenVersions', res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  getFeedbackListByStatus: ({ commit }, payload) => {

    var url = `/api/v1/feedback/project/${payload.projectId}?completed=${payload.status}`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/feedback/project/${payload.projectId}?completed=${payload.status}`;
    // }

    return Get(url)
      .then(res => {
        commit('setFeedbackList', res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  createFeedBack: ({ commit, state }, data) => {

    var url = '/api/v1/feedback/';
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/feedback/`;
    // }

    return Post(url, data)
      .then((res) => {
        if (res) {
          state.feedbackList.push(res[0]);
          return res;
        }
      })
      .catch((err) => {
        throw err;
      });
  },
  createFeedBackReply: ({ commit, state }, data) => {

    var url = '/api/v1/feedback/comment';
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/feedback/comment`;
    // }



    return Post(url, data)
      .then((res) => {
        if (res) {
          commit('setFeedbackReplyList', { feedBackId: data.feedBackId, res: res });
          return res;
        }
      })
      .catch((err) => {
        throw err;
      });
  },
  getCurrentUser({ commit }, data) {

    var url = '/api/v1/company/user';
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/company/user`;
    // }


    return Get(url)
      .then((res) => {
        commit('setCurrentUser', res);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  deleteFeedBack: ({ commit }, data) => {

    var url = `/api/v1/feedback/${data.feedBackId}`;
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/feedback/${data.feedBackId}`;
    // }


    return DeleteWithObjectData(url, data)
      .then((res) => {
        commit('deleteFeedback', data.feedBackId);
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  deleteFeedBackReply: ({ commit }, data) => {

    var url = '/api/v1/feedback/comment';
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/feedback/comment`;
    // }


    return DeleteWithObjectData(url, data)
      .then((res) => {
        commit('deleteFeedbackReply', { feedBackId: data.feedBackId, commentId: data.commentId });
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  deleteFeedBackReply: ({ commit }, data) => {

    var url = '/api/v1/feedback/comment';
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/feedback/comment`;
    // }


    return DeleteWithObjectData(url, data)
      .then((res) => {
        commit('deleteFeedbackReply', { feedBackId: data.feedBackId, commentId: data.commentId });
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  editFeedBack: ({ commit }, data) => {

    var url = '/api/v1/feedback/';
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/feedback/`;
    // }


    return Put(url, data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  changeFeedBackStatus: ({ commit }, data) => {

    var url = '/api/v1/feedback/';
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/feedback/`;
    // }


    return Put(url, data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
  updateScreenStatus: ({ commit }, data) => {

    var url = '/api/v1/screen/';
    // if (process.env.NODE_ENV === 'production') {
    //   url = `/screen/`;
    // }
    return Put(url, data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  },
};

const mutations = {
  createSpace: (state, data) => {
    state.spaces.push(data);
  },
  createScreen: (state, data) => {
    state.screens.push(data);
  },

  imageDetailStatus: (state, data) => {
    state.imageDetailStatus = data;
  },

  setSpaces: (state, data) => {
    state.spaces = Object.assign([], data);
    if (data.length > 0) {
      state.selectedSpace = Object.assign({}, data[0]);
    }
  },

  setCompanyTeams: (state, data) => {
    state.companyTeams = Object.assign([], data);
  },

  setSelectedSpace: (state, data) => {
    state.selectedSpace = Object.assign({}, data);
  },

  setSelectedSpaceImages: (state, data) => {
    state.selectedSpaceImages = Object.assign([], data);
  },
  setSelectedSpaceImageDetail: (state, data) => {
    state.selectedSpaceImageDetail = Object.assign([], data);
  },

  setSelectedSpaceUsers: (state, data) => {
    state.selectedSpaceUsers = Object.assign([], data);
  },
  setCurrentUser: (state, data) => {
    state.currentUser = data;
  },

  deleteSpace: (state, spaceId) => {
    let index = 0;
    for (let i = 0; i < state.spaces.length; i++) {
      if (state.spaces[i].id == spaceId) {
        index = i;
        break;
      }
    }
    let tmp = Object.assign([], state.spaces);
    tmp.splice(index, 1);
    state.spaces = Object.assign([], tmp);
    if (state.spaces.length > 0) {
      state.selectedSpace = state.spaces[0];
    } else {
      state.selectedSpace = null;
    }
  },

  inviteUser: (state, data) => {
    // console.log(state, data);
  },
  setLoader(state, payload) {
    state.loader = payload;
  },

  setMetaData: (state, data) => {
    state.meta_data = Object.assign([], data);
  },
  setFeedbackList: (state, data) => {
    state.feedbackList = Object.assign([], data);
  },
  setFeedbackReplyList: (state, payload) => {

    let abc = state.feedbackList.filter((feedback, index) => {
      if (feedback.feedBackId === payload.feedBackId) {

        // Fill the user property of new reply
        payload.res.user = state.currentUser;

        // Check Wether Comments are Null or not
        if(feedback.comments !== null) {
          feedback.comments.push(payload.res);
        } else {
          feedback.comments = [];
          feedback.comments.push(payload.res);
        }
        
        // Now set The new feedback list for reactivity.
        Vue.set(state.feedbackList, index, feedback)
        return feedback
      }
      return feedback;
    });
    // console.log('What is abc', abc);
    // Vue.set()
    // state.feedbackList = Object.assign([], _.cloneDeep(abc));

  },
  setScreenVersions: (state, data) => {
    state.screenVersions = Object.assign([], data);
  },
  deleteFeedback(state, feedBackId) {
    state.feedbackList = state.feedbackList.filter((feedback) => {
      return feedback.feedBackId !== feedBackId;
    });
  },
  deleteFeedbackReply(state, data) {
    state.feedbackList = state.feedbackList.filter((feedback) => {
      feedback.comments = feedback.comments.filter((comment) => {
        if (comment.commentId !== data.commentId) {
          return comment;
        }
      });
      return feedback;
    });
  },
  setPageNumber(state, payload) {
    state.pageNumber = payload;
  },
  setScreenTab(state, payload) {
    state.screenTab = payload;
  },
  setCommentBox(state, payload) {
    state.commentBox = payload;
  },
  setScreenStatus(state, payload) {
    state.screenStatus = payload;
  },
  setNextScreenArrow(state, payload) {
    state.nextScreenArrow = payload;
  },
  setPreviousScreenArrow(state, payload) {
    state.previousScreenArrow = payload;
  },
  setScreenDescription(state, payload) {
    state.screenDescription = payload;
    return;
  },
  setFullPreviewScreen(state, payload) {
    state.fullPreviewScreen = payload;
  },
  setVerticalPreviewScreen(state, payload) {
    state.verticalPreviewScreen = payload;
  },
  setHorizontalPreviewScreen(state, payload) {
    state.horizontalPreviewScreen = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
