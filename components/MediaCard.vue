<template>
  <div v-if="post && post.data" class="w-full max-w-2xl p-4 mx-auto">
    <div class="flex items-end justify-between w-full text-gray-400 ">
      <div>
        <a :href="'https://www.reddit.com/' + post.data.subreddit_name_prefixed" target="_blank" class="font-semibold">
          <span class="opacity-50">{{ post.data.subreddit_name_prefixed.substring(0, 2) }}
          </span>
          <span>{{
            post.data.subreddit_name_prefixed.substring(2, post.data.subreddit_name_prefixed.length)
          }}
          </span>
        </a>
        <div class="font-bold"> </div>
        <div class="text-xs text-cyan-400">{{ getRelativeTime(post.data.created * 1000) }}</div>
      </div>

      <a :href="'https://www.reddit.com/' + post.data.permalink" class="flex items-center gap-x-3" target="_blank">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
            stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
          <span class="ml-2 text-xl font-bold">{{ convertToK(post.data.ups) }}</span>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          <span class="ml-2 text-xl font-bold">{{ convertToK(post.data.num_comments) }}</span>

          <div>{{  }}</div>
        </div>
      </a>

    </div>

    <div class="pt-3 text-gray-300 font-arvo">
      <a v-if="post.data.post_hint == 'link'" :href="post.data.url_overridden_by_dest" class="text-3xl font-semibold "
        target="_blank">{{ post.data.title }}</a>
      <div v-else v-html="post.data.title" class="text-3xl font-semibold "></div>
      <!-- <pre class="text-cyan-400">{{post.data.url}} <span>{{ post.data.is_video }}</span></pre> -->
      <!-- <pre class="text-cyan-400">{{post.data.url}}</pre>
      
      <pre class="text-cyan-400">{{post.data.spoiler}}</pre>
      <pre class="text-cyan-400">{{post.data.author}}</pre>
      <pre class="text-cyan-400">{{post.data.upvote_ratio}}</pre>
      <pre class="text-cyan-400">{{post.data.total_awards_received}}</pre> -->
      <!-- <pre class="text-cyan-400">{{post.data.post_hint}}</pre>
      <pre class="text-cyan-400">{{post.data.domain}}</pre>
      <pre class="text-cyan-400">{{post.data.url}} <span>{{ post.data.is_video }}</span></pre> -->
      <!-- <pre class="text-cyan-400">{{post.data.preview.reddit_video_preview.fallback_url}}</pre> -->
      <!-- <pre class="text-cyan-400">{{post.data.media.reddit_video_preview.fallback_url}}</pre> -->
      <!-- <pre class="text-cyan-400">{{post.data}} <span>{{ post.data.is_video }}</span></pre> -->
    </div>
    <div class="grid w-full pt-3 place-items-center">
      <!-- <video v-if="post.data && post.data.preview && post.data.preview.reddit_video_preview.fallback_url" :src="post.data.preview.reddit_video_preview.fallback_url" autoplay="true" controls
        class="max-w-md mx-auto"></video> -->

      <video ref="video" v-if="post.data.is_video" :src="post.data.media.reddit_video.fallback_url" autoplay="true" controls
        class="max-w-md mx-auto"></video>
      <img v-else class="w-full max-w-xl mx-auto" :src="post.data.url" alt="">

      <iframe id="ik_player" ref="yt_player" v-if="post.data.domain == 'youtube.com' || post.data.domain == 'youtu.be'"
        :src="`https://www.youtube.com/embed/${getEmbedYTUrl(post.data.url)}?autoplay=1&enablejsapi=1&version=3`"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
        autoplay class="w-full h-full aspect-video"></iframe>
      <!-- <img v-if="post.data.preview" class="max-w-xl mx-auto" :src="post.data.url" alt=""> -->
    </div>


    <!-- <div>{{ post.data.permalink }}</div> -->
    <!-- <div>{{ post.data.url_overridden_by_dest }}</div>
    <div>{{ post.data.post_hint }}</div>
    <div v-if="post.data.post_hint == 'rich:video'">
      <pre>{{ post.data.preview.reddit_video_preview.fallback_url }}</pre>
    </div>

    <video v-if="post.data.post_hint == 'rich:video'" :src="post.data.preview.reddit_video_preview.fallback_url"
      autoplay="true" controls></video> -->
    <!-- <div>{{ post }}</div> -->
    <!-- <pre>{{ post.data.url }}</pre> -->
  </div>
</template>

<script setup>
const emit = defineEmits(["ended"])
const video = ref()

const props = defineProps(["post"])
const yt_player = ref()
function convertToK(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  } else {
    return num;
  }
}

const getEmbedYTUrl = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  url = match && match[2].length === 11 ? match[2] : null

  if (url) {
    return url
  } else {

  }
}

function onYouTubeIframeAPIReady() {
  let player = new YT.Player('ik_player', {
    height: '390',
    width: '640',
    // videoId: '5EnL2WXsxNQ',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
      'onPlaybackRateChange': onPlayerPlaybackRateChange,
      'onError': onPlayerError,
      'onApiChange': onPlayerApiChange
    }
  });

  // console.log("player", player)
}

function onPlayerReady(event) {
  console.log('player is ready');
  onYouTubeIframeAPIReady()
}

function onPlayerStateChange(event) {
  switch (event.data) {
    case YT.PlayerState.UNSTARTED:
      console.log('unstarted');
      break;
    case YT.PlayerState.ENDED:
      console.log('ended');
      emit("ended")
      break;
    case YT.PlayerState.PLAYING:
      console.log('playing');
      break;
    case YT.PlayerState.PAUSED:
      console.log('paused');
      break;
    case YT.PlayerState.BUFFERING:
      console.log('buffering');
      break;
    case YT.PlayerState.CUED:
      console.log('video cued');
      break;
  }
}

function onPlayerPlaybackQualityChange(playbackQuality) {
  console.log('playback quality changed to ' + playbackQuality.data);
}

function onPlayerPlaybackRateChange(playbackRate) {
  console.log('playback rate changed to ' + playbackRate.data);
}

function onPlayerError(e) {
  console.log('An error occurred: ' + e.data);
}

function onPlayerApiChange() {
  console.log('The player API changed');
}

watchEffect(() => {
  if (video.value) {
    let readyState = video.value?.readyState
    console.log("readyState", readyState)
    console.log("duration", video.value.currentTime, video.value.played, video.value.ended, video.value.videoTracks)
  }
})

onMounted(() => {
  console.log("mounted")
  onYouTubeIframeAPIReady()
  console.log(video.value)
  // console.log("duration", video.value.readyState)
  // if (post.data.domain == 'youtube.com' || post.data.domain == 'youtu.be') {
  //  console.log(post.data.url) 
  // }
})
</script>