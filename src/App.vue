<template>
  <div id="app">
    <Loading :width="100" :height="100" :active.sync="isLoading" loader="bars" :can-cancel="false" :is-full-page="true" color="#1a99aa"></Loading>
    <div v-if="isAuth" class="flex h-screen">
      <router-view class="w-full" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { PostLogin } from "@/helpers/api-helper.js";
import { loginAuthenticatedUser } from "@/helpers/authentication.js";
import { EE } from "@/helpers/eventEmitter.js";
export default {
  name: "App",

  // ===================================================Data=======================================================
  data() {
    return {
      isAuth: false,
    }
  },

  // ===================================================Created=======================================================
  created() {
    console.log(process.env.VUE_APP_DEV + process.env.VUE_APP_PRODUCTION)
    console.log(process.env.RUNNING_AS_STAND_ALONE);
    //when running as a integrated app
    this._fetchCurrentUser();
    //when running as a stand along app (local for development) then enable this.s
    //this.signIn();
    this.isAuth = true;

  },

  // ===================================================Mounted=======================================================
  mounted() {
    // this.signIn();
  },

  // ===================================================computed=======================================================
  computed: {
    ...mapGetters("app", {
      isLoading: "isLoading"
    })
  },

  // ===================================================methods=======================================================
  methods: {
    ...mapActions('app', {
      _fetchCurrentUser: 'fetchCurrentUser'
    }),
    
    // Signin User
    async signIn() {
      await PostLogin("/login", {
          username: "oct@savahapp.com",
          password: "mk123456@"
        })
        .then(async res => {
          if (res && res.token) {
            // Store User and Token after successfully signin response
            loginAuthenticatedUser(res.username, res.token);
            await this._fetchCurrentUser();
            this.isAuth = true;
          } else {
            this.isAuth = false;
            return 0;
          }
        })
        .catch(err => {
          this.isAuth = false;
          return err;
        });
    }
  },
};

</script>
