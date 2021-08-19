<template>
  <div class="px-20" style="border-bottom: 1px solid rgb(226, 232, 240);height: 70px;">
    <div class=" flex flex-wrap items-center justify-between h-full">
      <div class="w-3/5 pl-8 h-full">
        <div class="w-full relative h-full">
          <Search class="cursor-pointer h-full text-xl" />
          <img :src="require('@/assets/search-icon.png')" class="w-6 z-50 absolute mt-6 ml-2 top-0 inline-block bg-white" />
        </div>
      </div>
      <div class="w-2/5 py-3">
        <Navbar />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/common/Navbar";
import Search from "@/components/common/Search";
export default {
  
  // ===================================================Components=======================================================
  components: {
    Navbar,
    Search
  }
}
</script>
