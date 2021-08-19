<template>
  <div>
    <vue-dropzone 
      ref="myVueDropzone" 
      @vdropzone-complete="uploadFile"
      @vdropzone-sending="fileSending"
      @vdropzone-file-added="fileAdded"
      id="dropzone" :options="dropzoneOptions" 
      :useCustomSlot="true" 
      class="w-2/5 py-12 m-auto mt-12 col-md-6 offset-md-3 dropzone-wrapper"
    >
      <img class="w-12 m-auto" src="@/assets/cloud.png" alt />
      <h3 class="text-2xl text-black pt-4 pb-3 font-bold">Drop your first image</h3>
      <div class="subtitle">
        <p class="text-sm">Savah support the following format .png, .jpeg, .gif and .psd</p>
        <p class="mb-3 pt-2 text-sm italic font-light">or</p>
        <p class="mb-3">
          <a class="flex items-center justify-center" href="#">
            <span>
              <img class="w-6" src="@/assets/browse-icon.png" alt />
            </span>
            <span class="pl-1 text-savah-green font-bold">Browse for local files</span>
          </a>
        </p>
        <p class="mb-1 pb-2 text-sm italic font-light">or</p>
        <p class="text-sm">Import from</p>
        <ul class="flex justify-center mt-3">
          <li v-for="(box, index) in newImage" :key="index" class="mx-2 h-16">
            <div @mouseover="selectIndex(index);" @mouseout="ItemIndex = null;">
              <div class="border border-white-three p-2 rounded-sm shadow-none hover:shadow-custom">
                <img class="w-8" :src="box.src" :alt="box.text" />
              </div>
              <span v-show="ItemIndex == index" class="text-xs text-black-three text-opacity-50">{{box.text}}</span>
            </div>
          </li>
        </ul>
      </div>
    </vue-dropzone>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import { mapActions, mapGetters, mapMutations } from "vuex";
import { EE } from "@/helpers/eventEmitter.js";

export default {
  name: 'dropzone',

  // ===================================================Components=======================================================
  components: {
    vueDropzone: vue2Dropzone,
  },

  // ===================================================Data=======================================================
  data() {
    return {
      eachFileMaxSize: 15,
      ItemIndex: null,
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        thumbnailWidth: 150,
        maxFilesize: 15,
        acceptedFiles: "image/*",
        timeout: null,
        previewTemplate: this.template(),
        headers: { "My-Awesome-Header": "header value" }
      },
      newImage: [
        { id: 0, text: 'Dropbox', src: require('@/assets/drop-icon-1.png'), hover: false },
        { id: 1, text: 'Drive', src: require('@/assets/drop-icon-2.png'), hover: false },
        { id: 2, text: 'Sketch', src: require('@/assets/drop-icon-3.png'), hover: false },
      ],
      acceptedFiles: [],
      successResponseFiles: [],
      failedResponseFiles: [],
      responseFailed: false,
    }
  },

  // ===================================================Computed=======================================================
  computed: {
    ...mapGetters("home", {
      _getDefaultSpace: "getDefaultSpace",
    }),
  },
  
  // ===================================================Methods=======================================================
  methods: {

    ...mapMutations("app", {
      setLoader: 'setLoader',
    }),

    ...mapActions("home", {
      _createScreen: "createScreen",
    }),

    selectIndex(Index) {
      this.ItemIndex = Index;
    },

    // When sending files from browser to server 
    // eslint-disable-next-line no-unused-vars
    fileSending( file, xhr, formData) {
      // console.log('file is being send', xhr);
      this.setLoader(true);
    },

    // When Files are added 
    fileAdded(file) {
      
      if(file.size > (this.eachFileMaxSize*1024*1024) ) {
        this.$refs.myVueDropzone.removeFile(file);
        this.toaster(`File Size Increases Limit of ${this.eachFileMaxSize} MB`, "error");
      }
    },

    // Upload file to server
    uploadFile(file) {
      this.acceptedFiles.push(file);
      const fileObj = new FormData();
      // console.log('File to be upload', file.size, this._getDefaultSpace);
      if(file.size <= (this.eachFileMaxSize*1024*1024)) {
        fileObj.append("file", file);
        const data = {
          file: fileObj,
          projectId: this._getDefaultSpace.id
        }

        // get the index of current file index in dropzone uploading template
        var fileIndex = this.$refs.myVueDropzone.getAcceptedFiles().findIndex( acceptedFile => acceptedFile.upload.uuid === file.upload.uuid );
        
        // Create New Screen api call
        this._createScreen(data)
        .then(res => {
          this.setLoader(false);

          // if file uploading failed
          if(res.status == 500 ) {
            // console.log('Response failed');
            this.failedResponseFiles.push(file);
            this.$refs.myVueDropzone.dropzone.previewsContainer.children[fileIndex + 1].querySelector(".dz-error-mark").classList.add("active");
            // this.toaster("Couldn't create screen. Try again.", "error");
            this.allFilesUpload();
            
          } else {
            // if file uploaded successfully
            this.successResponseFiles.push(file);
            this.$refs.myVueDropzone.dropzone.previewsContainer.children[fileIndex + 1].querySelector(".dz-success-mark").classList.add("active");
            // this.toaster("Screen created successfuly", "success");
            this.allFilesUpload();

          }

          return res;
        })
        .catch(err => {
          // if file uploading failed
          this.setLoader(false);
          // this.failedResponseFiles.push(file);
          this.responseFailed = true;
          this.$refs.myVueDropzone.dropzone.previewsContainer.children[fileIndex + 1].querySelector(".dz-error-mark").classList.add("active");
          this.toaster("Couldn't create screen. Try again." + err, "error");
          this.allFilesUpload();
          
        })
      }
    },

    // After all files are uploaded to server 
    allFilesUpload() {
      // console.log('Vue Dropzone component', this.$refs.myVueDropzone);
      // Only run when all all files are uploaded otherwise, it will not.
      if(this.$refs.myVueDropzone.getAcceptedFiles().length === this.acceptedFiles.length && this.failedResponseFiles.length + this.successResponseFiles.length === this.acceptedFiles.length) {
        setTimeout(() => {
          
          // Emit event to destroy image upload component.
          EE.emit("allFilesUploaded", this.successResponseFiles.length);

          // Different type of toaster according to the number of successfully uploaded images and all images.
          if(this.successResponseFiles.length === 0) {
            this.toaster(`Files Uploaded ${this.successResponseFiles.length} / ${this.acceptedFiles.length}`, "error");
          } else {
            this.toaster("Screen created successfuly", "success");
            this.toaster(`Files Uploaded ${this.successResponseFiles.length} / ${this.acceptedFiles.length}`, "success");
          }

          // Reset Dropzone data properties after all files are uploaded or rejected.
          this.acceptedFiles = [];
          this.successResponseFiles = [];
          this.failedResponseFiles = [];
          this.$refs.myVueDropzone.removeAllFiles();
        }, 1000);
      }
    },

    // toaster
    toaster(message, type) {
      this.$toast.open({
        message: message,
        type: type,
        position: "top-right",
        queue: true,
        duration: 3000,
      })
    },

    // Template
    template: function() {
      return `<div class="flex flex-wrap items-center justify-between mt-4 mb-1">
        <div class="flex flex-col flex-grow">

          <div class="flex items-center justify-between">

            <div class="flex items-center">
              <img class="w-10 h-10 mr-3 inline-block rounded-md" data-dz-thumbnail>

              <div class="inline-block">
                <h2 class="text-sm text-black-three block font-bold my-1"><span data-dz-name></span></h2>
                <span class="text-opacity-50 text-xs text-black-three mb-2" data-dz-size></span> 
              </div>

            </div>

            <div class="dz-success-mark">
              <span>✔</span>
            </div>
            <div class="dz-error-mark">
              <span>✘</span>
            </div>

          </div>
          <div class="dz-progress">
            <span class="dz-upload mt-4" data-dz-uploadprogress></span>
          </div>

        </div>
      </div>`;
    },
  }
}

</script>
<style>
.dropzone-wrapper {
  border-radius: 10px;
  border: dashed 2px #1a99aa;
  background-color: #fff;
}

.dropzone-wrapper:hover {
  background-color: #fff;
}

.dz-upload { 
  display: block; 
  background-color: #1a99aa; 
  height: 2px;
  width: 0%;
}

.dz-progress{
  display: contents;
}

.dz-success-mark{
  background-color: #1a99aa;
  border-radius: 50%;
  width: 21px;
  height: 21px;
  text-align: center;
  display: none;
}

.dz-error-mark{
  background-color: #ff414a;
  border-radius: 50%;
  width: 21px;
  height: 21px;
  text-align: center;
  display: none;
}

.dz-success-mark span, .dz-error-mark span{
  color: white;
}

.active{
  display: inline;
}
</style>
