<template>
  <div v-if="page">
    <Head>
      <Title>{{ page.title }}</Title>
      <Meta name="description" :content="page.description" />
      <!-- <Style type="text/css" children="body { background-color: green; }" /> -->
    </Head>
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup>
const { page } = defineProps(['page'])
</script>