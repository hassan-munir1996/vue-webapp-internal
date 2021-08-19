<template>
  <div>
    <Loading
      :width="100"
      :height="100"
      :active.sync="isLoading"
      loader="bars"
      :can-cancel="false"
      :is-full-page="true"
      color="#1a99aa"
    ></Loading>

    <div class="imageviewer" :style="color">
      <img alt="Vue logo" :src="selectedImage.url" />
    </div>
    <footer :style="footer" class="footer-holder iv-footer-holder">
      <div class="container-fluid">
        <ul class="list-unstyled clearfix footer-nav">
          <li>
            <a href="#." @click="$router.push('/')" class="footer-logo"> </a>
          </li>
          <li>
            <a href="#."> Web App Prototype </a>
          </li>
          <li>
            <a href="#."> Trademark </a>
          </li>
        </ul>
        <a href="#" target="_blank" class="made-with-holder">
          <img
            src="https://projects.savahapp.com/beta/assets/images/made-savah-logo.png"
            alt=""
          />
        </a>
        <ul class="list-unstyled iv-footer-nav">
          <li
            v-on:click="
              designImages = [];
              selectedImage = {};
              getImagesOfSpace(0);
            "
          >
            <a href="#"><i class="fa fa-home"></i></a>
          </li>
          <li
            v-on:click="
              slider['top'] = '0';
              slider['display'] = 'block';
              color['display'] = 'none';
            "
            class="grid"
            id="screen-thumb-tray"
          >
            <a><i class="fa fa-th-large"></i></a>
          </li>
          <li v-on:click='isdropdown = !isdropdown' class="dropdown background-bullet">
            <a class="dropdown-toggle" data-toggle="dropdown">
              <i class="fa fa-bullet"></i>
            </a>
            <div v-if="isdropdown" class="dropdown-menu color-popup clearfix">
              <ul class="list-unstyled device-bg-nav" title="sdfsf">
                <li v-on:click="color['background-color'] = 'white'">
                  <a class="device white">White</a>
                </li>
                <li v-on:click="color['background-color'] = '#555555'">
                  <a class="device black">Black</a>
                </li>
                <li v-on:click="color['background-color'] = '#ECD893'">
                  <a class="device golden" title="">Golden</a>
                </li>
              </ul>
            </div>
          </li>
          <li v-on:click="prevImage(selectedImage.index)" class="next-prev">
            <a data-original-title="Previous Screen">
              <i class="fa fa-chevron-left"></i>
            </a>
          </li>
          <li v-on:click="nextImage(selectedImage.index)" class="next-prev">
            <a data-original-title="Next Screen">
              <i class="fa fa-chevron-right"></i>
            </a>
          </li>
          <li
            data-original-title="Comment Mode"
            data-placement="top"
            data-toggle="tooltip"
          >
            <div id="switchBox">
              <div class="switch">
                <a class="switchBTN" id="checkbox" data-switchbtns="false">
                  <div class="custom-control custom-switch">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      id="customSwitch1"
                    />
                    <label
                      class="custom-control-label"
                      for="customSwitch1"
                    ></label>
                  </div>
                </a>
              </div>
            </div>
          </li>
        </ul>
        <div class="hide-btn-holder">
          <a
            href="#."
            v-if="footer['height'] === 'auto'"
            v-on:click="
              footer['height'] = '0px';
              footer['padding-bottom'] = '0px';
            "
            class="hide-btn-style hide-btn-footer"
          >
            Hide
          </a>
          <a
            href="#."
            v-else
            v-on:click="
              footer['height'] = 'auto';
              footer['padding-bottom'] = '20px';
            "
            class="hide-btn-style show-btn-footer"
          >
            Show
          </a>
        </div>
      </div>
    </footer>
    <div :style="slider">
      <div class="flex topheader">
        <div class="w-1/6 text-left px-4">
          <p>{{ designImages.length }} Screens</p>
        </div>
        <div class="w-5/6 text-right px-4">
          <i
            v-on:click="
              slider['top'] = '100%';
              slider['display'] = 'none';
              color['display'] = 'block';
            "
            class="fa fa-times"
          ></i>
        </div>
      </div>
      <div class="flex flex-wrap mt-4 allimages">
        <div
          v-for="(image, imageIndex) in designImages"
          :key="imageIndex"
          class="w-1/6 px-2 mb-4"
        >
          <img :src="image.url" v-on:click="selectedImage.url = image.url;  selectedImage.index = imageIndex; slider['display'] = 'none'; color['display']='block'" class="img-fluid" :key="imageIndex" />
          <p class="text-center mt-2">{{ image.title }}</p>
        </div>
      </div>
      <p class="text-center mb-4" v-on:click="getImagesOfSpace(page + 1)">
        <u>Load more...</u>
      </p>
    </div>
    <div :style="messageAlert">
      <p class="text-center">
        {{ selectedImage.index + 1 + " of " + designImages.length }}
      </p>
    </div>
  </div>
</template>

<script>
import { Get } from "@/helpers/api-helper.js";
export default {
  name: "IOPAGE",
  components: {},
  data() {
    return {
      designImages: [],
      selectedImage: {
        url: "",
        index: 0,
      },
      color: {
        "background-color": "black",
        display: "block",
        transition: "5s",
      },
      isLoading: false,
      footer: { height: "auto", "padding-bottom": "20px" },
      counter: "",
      slider: {
        position: "absolute",
        width: "100%",
        height: "auto",
        top: "100%",
        display: "none",
        "background-color": "#000",
        color: "#FFF",
        transition: "all 0.5s",
      },
      messageAlert: {
        position: "fixed",
        width: "8%",
        padding: "10px 10px 7px",
        "border-radius": "30px",
        top: "50%",
        right: "45%",
        display: "none",
        "background-color": "rgb(0 0 0 / 84%)",
        color: "#FFF",
        transition: "all 0.5s",
      },
      page: 0,
      isdropdown:false
    };
  },
  created() {
    this.getImagesOfSpace(0);
  },
  mounted() {
       window.addEventListener('keydown', (e) => { 
         if(e.keyCode === 39) this.nextImage(this.selectedImage.index);
         else if (e.keyCode === 37) this.prevImage(this.selectedImage.index)
       })
  },
  methods: {
    getImagesOfSpace(page) {
      this.isLoading = true;
      Get(`/api/v1/spaces/shared/8uygv?page=${page}`)
        .then((res) => {
          if (res && res.length > 0) {
            res.forEach((el) => {
              this.designImages.push(el);
            });
            if (page === 0) {
              this.selectedImage = { url: res[0].url, index: 0 };
            }
            this.isLoading = false;
             this.page = page;
          } else {
            this.isLoading = false;
          }
        })
        .catch((err) => {
          return err;
        });
    },
    nextImage(index) {
      let opt = this.messageAlert;
      opt["display"] = "block";
      this.messageAlert = opt;
      if (index == this.designImages.length - 1) {
        this.getImagesOfSpace(this.page + 1);
      } else {
        this.selectedImage = {
          url: this.designImages[index + 1].url,
          index: index + 1,
        };
      }
      setTimeout(() => {
        let opt = this.messageAlert;
        opt["display"] = "none";
        this.messageAlert = opt;
      }, 2000);
    },

    prevImage(index) {
      let opt = this.messageAlert;
      opt["display"] = "block";
      this.messageAlert = opt;
      if (index == 0) {
        this.selectedImage = {
          url: this.designImages[this.designImages.length - 1].url,
          index: this.designImages.length - 1,
        };
      } else {
        this.selectedImage = {
          url: this.designImages[index - 1].url,
          index: index - 1,
        };
      }
      setTimeout(() => {
        let opt = this.messageAlert;
        opt["display"] = "none";
        this.messageAlert = opt;
      }, 2000);
    },
  },
};
</script>

<style lang="css" scoped>
i,
a:hover {
  cursor: pointer !important;
}
.allimages {
  padding: 40px;
  margin: 0;
}
body {
  font-family: "lato-regular", Arial, sans-serif;
  margin-bottom: 92px;
  height: 100vh;
}
.topheader {
  margin: 0px;
  background: rgb(36 35 35 / 87%);
  padding: 20px 0px;
}

.io-page-bg {
  background-color: #1f1f1f;
}

.io-bg-white {
  background-color: #fff;
}

.io-bg-black {
  background-color: #555555;
}

.io-bg-golden {
  background-color: #ecd893;
}

.build-holder-container {
  padding: 60px;
}

.mobile-layout {
  padding: 30px;
}

.io-mobile-screen {
  background-repeat: no-repeat;
  background-position: left top;
  width: 368px;
  height: 778px;
  padding: 86px 18px 109px 20px;
  margin: 0 auto;
  background-size: 368px;
}

.footer-holder {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #000;
}

.footer-holder .container-fluid {
  background-color: #000;
  padding: 10px;
  padding-right: 100px;
}

.hide-btn-style {
  font-size: 12px;
  color: #999;
  text-decoration: none;
  background: #000;
  padding: 3px 10px;
  bottom: 100%;
  right: 10px;
  position: absolute;
  text-transform: uppercase;
  border-radius: 5px 5px 0 0;
  -webkit-border-radius: 5px 5px 0 0;
  width: 56px;
  text-align: center;
}

.hide-btn-style:hover,
.hide-btn-style:focus {
  color: #999;
  text-decoration: none;
}

.footer-nav {
  float: left;
  margin-top: 26px;
}
.footer-nav > li:first-child {
  background: none;
  margin-left: 0;
  padding-left: 0;
}
.footer-nav > li {
  float: left;
  padding: 0 18px;
  background-image: url(../assets/footer-arrow.png);
  background-position: left center;
  background-repeat: no-repeat;
}
.footer-nav > li > a {
  color: #aaa;
  text-decoration: none;
}
.footer-nav > li > a:hover,
.footer-nav > li > a:focus {
  text-decoration: none;
  color: #1a99aa;
}

.footer-logo {
  float: left;
  background-image: url(../assets/footer-logo.png);
  background-repeat: no-repeat;
  width: 131px;
  height: 24px;
}

.footer-logo.iv-footer-logo {
  float: left;
  background: none;
  background-repeat: no-repeat;
  width: 24px;
  height: 24px;
}

.footer-logo.iv-footer-logo img.footer-logo {
  width: 24px;
  background: none;
}

.made-with-holder {
  width: 99px;
  height: 33px;
  position: absolute;
  left: 50%;
  margin-left: -49.5px;
  margin-top: 20px;
}

.iv-footer-nav {
  float: right;
  margin-top: 13px;
}

.iv-footer-nav > li {
  float: left;
  margin-left: 10px;
  display: table;
}

.iv-footer-nav > li > a {
  display: table-cell;
  background-color: #1f1f1f;
  width: 50px;
  height: 50px;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  color: #aaa !important;
  font-size: 20px;
  text-decoration: none !important;
  text-align: center;
  vertical-align: middle;
}

.made-with-holder.next-prev {
  display: table-cell;
  background-color: #1f1f1f;
  height: 50px;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  color: #aaa;
  font-size: 20px;
  text-decoration: none !important;
  text-align: center;
  vertical-align: middle;
  background-image: none;
  width: 135px;
  padding: 10px;
  margin-left: -75.5px;
  margin-top: 13px;
}

.made-with-holder.next-prev .fa-chevron-left {
  padding-right: 10px;
  cursor: pointer;
}

.made-with-holder.next-prev .fa-chevron-right {
  padding-left: 10px;
  cursor: pointer;
}

.iv-footer-nav > li.home-screen > a {
  font-size: 22px;
}

.iv-footer-nav > li.forground-bullet > a .fa {
  width: 18px;
  height: 18px;
  background: #aaa;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  position: relative;
}

.iv-footer-nav > li.forground-bullet > a .fa:before {
  content: none;
  width: 14px;
  height: 14px;
  position: absolute;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  border: #000 solid 2px;
}

.iv-footer-nav > li.background-bullet > a .fa {
  width: 18px;
  height: 18px;
  content: none;
  background: #aaa;
  border-radius: 50%;
  -webkit-border-radius: 50%;
}

.custom-switch {
  padding-left: 2.25rem;
  margin: 35px 34px;
}

.io-switch {
  background: #0a0a0a;
  position: absolute;
  right: 0;
  top: 0;
  border-left: #1f1f1f solid 1px;
  height: 100%;
  width: 90px;
}

.switch-case-btn {
  width: 46px;
  height: 22px;
  margin: 36px auto 0;
  display: block;
}

.iv-footer-nav .color-popup {
  bottom: 100%;
  top: auto;
  margin-bottom: 23px;
  background: #000;
  min-width: inherit;
  width: 50px;
  left: 50% !important;
  margin-left: -25px;
  border-radius: 0;
  -webkit-border-radius: 0;
  min-height: 100px;
  padding: 10px;
  position: absolute !important;
  will-change: transform !important;
  top: 0px;
  left: 0px;
  transform: translate3d(0px, -125px, 0px);
}

.deviceTitle {
  color: #fff;
  display: block;
  margin-bottom: 10px;
}

.device-nav {
  overflow: hidden;
}

.device-nav > li:first-child {
  padding-top: 0;
}

.device-nav > li {
  display: block;
  padding-top: 20px;
}

.device-nav .device {
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  position: relative;
  text-indent: -9999px;
  display: block;
  margin: 0 auto;
}

.device-nav .device:before {
  content: none;
  width: 14px;
  height: 14px;
  position: absolute;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  border: #000 solid 2px;
}

.device-nav .white {
  background: #fff;
}

.device-nav .white.device:before {
  border: #000 solid 2px;
}

.device-nav .black {
  background: #555;
}

.device-nav .black.device:before {
  border: #000 solid 2px;
}

.device-nav .golden {
  background: #ecd893;
}

.device-nav .golden.device:before {
  border: #000 solid 2px;
}

/*Device BG Nav*/
.device-bg-nav {
  overflow: hidden;
}
.device-bg-nav > li:first-child {
  padding-top: 0;
}
.device-bg-nav > li {
  display: block;
  padding-top: 20px;
}
.device-bg-nav .device {
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  position: relative;
  text-indent: -9999px;
  display: block;
  margin: 0 auto;
}
.device-bg-nav .white {
  background: #fff;
}
.device-bg-nav .black {
  background: #555;
}
.device-bg-nav .golden {
  background: #ecd893;
}
/*Device BG Nav End*/

#switchBox {
  background: #0a0a0a;
  position: absolute;
  right: 0;
  top: 0;
  border-left: #1f1f1f solid 1px;
  height: 100%;
  width: 90px;
}

.template-share #switchBox .switch {
  padding-top: 36px;
  padding-left: 17px;
}

.screenNumber {
  text-align: center;
  width: 60%;
  position: fixed;
  top: 150px;
  display: none;
  margin: 0% 20%;
  z-index: 999999;
}

.screenNumberInner {
  width: 150px;
  margin: auto;
  text-align: center;
  font-size: 20px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 20px;
}

@media only screen and (max-width: 991px) {
  .mobile-layout #mobileCase {
    background-image: none;
  }
  #mobileCase > img {
    max-width: 100%;
  }
}

@media only screen and (max-width: 767px) {
  .io-mobile-screen {
    max-width: 380px;
    height: auto;
    padding: 20px;
    width: auto;
  }
  .build-holder-container {
    padding: 0;
  }
}

@media only screen and (max-width: 500px) {
  .mobile-layout {
    padding: 0;
  }
}

.iv-footer-nav {
  float: right;
  margin-top: 13px;
}

.iv-footer-nav > li {
  float: left;
  margin-left: 10px;
  display: table;
}

.iv-footer-nav > li > a {
  display: table-cell;
  background-color: #1f1f1f;
  width: 50px;
  height: 50px;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  color: #aaa;
  font-size: 20px;
  text-decoration: none !important;
  text-align: center;
  vertical-align: middle;
}

.made-with-holder.next-prev {
  display: table-cell;
  background-color: #1f1f1f;
  height: 50px;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  color: #aaa;
  font-size: 20px;
  text-decoration: none !important;
  text-align: center;
  vertical-align: middle;
  background-image: none;
  width: 135px;
  padding: 10px;
  margin-left: -75.5px;
  margin-top: 13px;
}

.made-with-holder.next-prev .fa-chevron-left {
  padding-right: 10px;
  cursor: pointer;
}

.made-with-holder.next-prev .fa-chevron-right {
  padding-left: 10px;
  cursor: pointer;
}

.iv-footer-nav > li.home-screen > a {
  font-size: 22px;
}

.iv-footer-nav > li.forground-bullet > a .fa {
  width: 18px;
  height: 18px;
  background: #aaa;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  position: relative;
}

.iv-footer-nav > li.forground-bullet > a .fa:before {
  content: none;
  width: 14px;
  height: 14px;
  position: absolute;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  border: #000 solid 2px;
}
.dropdown-toggle::after {
  content: none !important;
}

.iv-footer-nav > li.background-bullet > a .fa {
  width: 18px;
  content: none;
  height: 18px;
  background: #aaa;
  border-radius: 50%;
  -webkit-border-radius: 50%;
}
.imageviewer {
  padding-top: 150px;
}
.imageviewer img {
  width: 100%;
  height: auto;
}
</style>