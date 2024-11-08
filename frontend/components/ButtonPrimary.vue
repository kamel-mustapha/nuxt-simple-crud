<script setup lang="ts">
const props = defineProps<{ message: string }>();

const { message } = props;
</script>

<template>
  <button
    type="button"
    class="text-white bg-primary hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-semibold rounded-md text-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
  >
    {{ message }}
  </button>
</template>
