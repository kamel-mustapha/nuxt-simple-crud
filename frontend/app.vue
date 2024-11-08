<script setup lang="ts">
import { loaders } from "./stores/loaders";
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
    <div v-show="loaders?.loading" class="bg-white bg-opacity-10 w-screen h-screen fixed top-0 left-0 backdrop-blur-sm">
      <svg class="absolute left-0 right-0 mx-auto top-1/2 -translate-y-1/2" width="70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
        <path
          fill="none"
          stroke="#00B9FF"
          stroke-width="15"
          stroke-linecap="round"
          stroke-dasharray="300 385"
          stroke-dashoffset="0"
          d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
        >
          <animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite"></animate>
        </path>
      </svg>
    </div>
  </NuxtLayout>
</template>
