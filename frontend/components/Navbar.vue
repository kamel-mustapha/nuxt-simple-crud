<script setup lang="ts">
import { user } from "~/stores/user";

const links = [
  {
    name: "Crèches",
    link: "/creches",
  },
  {
    name: "Enfants",
    link: "/kids",
  },
];
</script>

<template>
  <nav class="fixed w-full bg-white shadow-md">
    <div class="flex-col gap-6 md:flex-row max-w-[1450px] mx-auto flex justify-between items-center px-4 py-6">
      <router-link to="/"><span class="text-cyan-500 font-bold text-3xl">Nuxt</span></router-link>
      <div class="bg-[#0D2436] text-white rounded-full px-6 py-3 gap-8 flex font-semibold">
        <router-link v-for="link in links" :to="link.link" class="hover:text-primary duration-200">{{ link.name }}</router-link>
        <span class="text-primary flex items-center gap-1 border-l pl-8">
          <ProfileSvg />
          {{ user?.username }}
        </span>
      </div>
    </div>
  </nav>
</template>
