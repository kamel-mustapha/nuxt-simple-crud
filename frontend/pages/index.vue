<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
      <div class="pt-24 md:pt-0 mr-auto place-self-center lg:col-span-7">
        <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Crafting Innovative Solutions, One Line of Code at a Time</h1>
        <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
          As a passionate developer with a knack for problem-solving, I specialize in creating dynamic, user-focused applications. With a blend of technical expertise and creativity, I transform
          complex challenges into elegant, efficient solutions. Explore my work to see how I can bring your vision to life.
        </p>
      </div>
      <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
        <IndexSvg />
      </div>
    </div>
  </section>
</template>
