<template>
  <div class="relative flex flex-col items-center justify-center h-screen p-4 ">

    <div class="relative w-full h-full overflow-y-scroll">

      <div class="fixed bottom-0 left-0 flex max-w-2xl gap-4 p-2 text-white transition rounded-r-full transition-width"
        :class="[showInput ? 'w-full bg-stone-900' : 'w-14']">

        <button @click="showInput = !showInput"
          class="flex items-center justify-center w-10 h-10 rounded-full shrink-0">
          <svg v-if="!showInput" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            class="w-5 h-5">
            <path fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clip-rule="evenodd" />
          </svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path
              d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>

        </button>

        <div class="flex flex-col w-full gap-2 sm:flex-row">
          <input @keyup="getSearchResults"
            class="block px-4 py-2 leading-5 bg-[#272729] placeholder-stone-700 border border-[#343536] rounded-md appearance-none focus:outline-none focus:border-stone-500 text-stone-400 "
            :class="[showInput ? 'w-full' : 'hidden']" type="text" placeholder="enter a subreddit" v-model="subreddit">
          <div class="flex items-center w-full gap-x-2 ">
            <select name="" id="" class="bg-[#272729] rounded text-gray-400 px-4 focus:outline-none py-2"
              :class="[showInput ? 'w-full' : 'hidden']">
              <option value="New">New</option>
              <option value="Hot">Hot</option>
              <option value="TopToday">Top Today</option>
              <option value="TopWeek">Top Week</option>
              <option value="TopMonth">Top Month</option>
              <option value="TopAllTime">Top All Time</option>
            </select>

            <button @click.prevent="getPosts" :class="[showInput ? 'w-10' : 'hidden']">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                class="w-10 h-10 hover:bg-[#ff4500] bg-stone-600 transition rounded-full">
                <path fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  clip-rule="evenodd" />
              </svg>

            </button>
          </div>
        </div>
      </div>

      <MediaCard v-if="posts && posts.data" @ended="endHandler" :post="posts.data.children[index]" />

    </div>
  </div>
</template>

<script setup>
import subreddits from "assets/subreddits.json"
definePageMeta({
  layout: false
})

useHead({
  title: 'Reddit',
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'bg-black'
  },
  script: [{ src: 'https://www.youtube.com/iframe_api' }]
})

const index = ref(0);
const subreddit = ref("popular")
const showInput = ref(false)

// const posts = ref()
const { data: posts } = useFetch(`/api/reddit?subreddit=${subreddit.value}`)

const searchResults = fuzzy(subreddits);

const getSearchResults = () => {
  let res = searchResults(subreddit.value)
  console.log(res)
}

const endHandler = () => {
  console.log("ended here")
}

const after = computed(() => "" || posts.value?.data?.after)

async function handleKeyPress(event) {
  if (event.keyCode === 37) {
    console.log("Left arrow key pressed");
    if (index.value > 0) {
      index.value--
    }
  } else if (event.keyCode === 39) {
    console.log("Right arrow key pressed", index.value, after.value);
    if (index.value < posts.value.data.children.length - 1) {
      index.value++
    } else {
      let { data } = await useFetch(`/api/reddit?subreddit=${subreddit.value}&after=${after.value}`)
      posts.value = data.value;
      console.log("posts", posts.value)
      index.value = 0
    }
  }
}

const getPosts = async () => {
  // if (after.value) {
  //   return { data: posts } = await useFetch(`/api/reddit?subreddit=${subreddit.value}&after=${after.value}`)
  // }
  console.log("getting", subreddit.value)
  let { data } = await useFetch(`/api/reddit?subreddit=${subreddit.value}`)
  posts.value = data.value;
}

onMounted(async () => {
  // const { data, pending, error } = await useFetch("https://www.reddit.com/r/videos.json")
  // posts.value = data.value
  // console.log(posts.value)
  window.addEventListener("keyup", handleKeyPress);

  setInterval(async () => {
    // trigger the right arrow key press programmatically
    if (index.value < posts.value.data.children.length - 1) {
      index.value++
    } else {
      let { data } = await useFetch(`/api/reddit?subreddit=${subreddit.value}&after=${after.value}`)
      posts.value = data.value;
      console.log("posts", posts.value)
      index.value = 0
    }
  }, 50000);
  // const { data, pending, error } = await useFetch("https://www.reddit.com/r/popular/top.json")
  // onYouTubeIframeAPIReady()
});
onBeforeUnmount(() => {
  window.removeEventListener("keyup", handleKeyPress);
});
</script>

<style>
.input-container {
  width: 0;
  height: 38px;
  overflow: hidden;
  transition: width 0.5s ease;
}

.input-container.expand-enter-active {
  width: 38px;
}

/* .input-container.expand-leave-active {
  width: 0;
} */
</style>