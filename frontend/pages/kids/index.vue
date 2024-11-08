<script setup lang="ts">
import { APP_CONFIG } from "~/environment";
import type { Kid } from "~/models/Kid";
import { toastConfig } from "~/utils";
import { user } from "~/stores/user";
import { loaders } from "~/stores/loaders";

definePageMeta({
  middleware: ["auth"],
});

const kids = ref<Kid[]>([]);
const showCreate = ref<boolean>(false);
const toCreateName = ref<string>();
const toEditId = ref<number>();
const isLoading = ref<boolean>(true);
const isEdit = ref<boolean>(false);

const loadData = async () => {
  isLoading.value = true;
  const res: any = await $fetch(`${APP_CONFIG.API_URL}child`, {
    method: "GET",
    headers: { "X-Auth": user.value?.username ? user.value?.username : "" },
    onResponseError: (error: any) => {
      isLoading.value = false;
      Swal.fire({
        ...toastConfig,
        title: error?.response?._data?.message ? error.response._data.message : "Une erreur est survenue, veuillez réessayer",
        icon: "error",
      });
    },
  });
  isLoading.value = false;
  kids.value = res;
};

const onDelete = (id: number) => {
  Swal.fire({
    title: "Etes vous sûr de vouloir supprimer cet élément?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Annuler",
    confirmButtonText: "Oui, continuer!",
  }).then(async (result: any) => {
    if (result.isConfirmed) {
      loaders.value.loading = true;
      const res: any = await $fetch(`${APP_CONFIG.API_URL}child/${id}`, {
        method: "DELETE",
        headers: { "X-Auth": user.value?.username ? user.value?.username : "" },
        onResponseError: (error: any) => {
          loaders.value.loading = false;
          Swal.fire({
            ...toastConfig,
            title: error?.response?._data?.message ? error.response._data.message : "Une erreur est survenue, veuillez réessayer",
            icon: "error",
          });
        },
      });
      Swal.fire({ ...toastConfig, title: "Elément supprimé avec succès", icon: "success" });
      loaders.value.loading = false;
      loadData();
    }
  });
};

const onExtract = async (kidId: number | undefined) => {
  let extractUrl = `${APP_CONFIG.API_URL}child/export.csv`;
  if (kidId) extractUrl += `?kidId=${kidId}`;
  const res: any = await $fetch(extractUrl, {
    method: "GET",
    headers: { "X-Auth": user.value?.username ? user.value?.username : "" },
    responseType: "blob",
    onResponseError: (error: any) => {
      isLoading.value = false;
      Swal.fire({
        ...toastConfig,
        title: error?.response?._data?.message ? error.response._data.message : "Une erreur est survenue, veuillez réessayer",
        icon: "error",
      });
    },
  });
  // Create a blob from the response with type 'text/csv'
  const blob = new Blob([res], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);

  // Create a link element, trigger the download, and remove the link
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", kidId ? `children-${kidId}.csv` : "children.csv"); // Set the desired file name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL
  window.URL.revokeObjectURL(url);
};

const onSearch = (event: any) => {
  if (event.target.value.length === 0) loadData();
  kids.value = kids.value.filter((kid) => kid.lastName.includes(event.target.value));
};

loadData();
</script>

<template>
  <div class="max-w-[1400px] mx-auto mt-24 px-4">
    <header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-cyan-950">Liste des enfants</h2>
      </div>
      <div class="flex items-center gap-2 py-3 border-b border-gray-300 mt-4">
        <div class="flex w-full items-center gap-2">
          <SearchSvg />
          <input
            @input="onSearch($event)"
            placeholder="Rechercher par nom de famille"
            class="w-full outline-none border-none focus:border-none focus:outline-none focus:ring-transparent"
            type="search"
            name=""
            id=""
          />
        </div>
        <div @click="onExtract(undefined)" class="flex items-center gap-1 cursor-pointer">
          <DownloadSvg />
          <span class="font-semibold">Exporter</span>
        </div>
      </div>
    </header>

    <table v-show="!isLoading" class="mt-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead v-if="kids.length > 0" class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th v-for="header in ['Nom', 'Prénom', '']" scope="col" class="py-3">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="kid in kids" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ kid.lastName }}</th>
          <td class="py-4">{{ kid.firstName }}</td>
          <td class="py-4 text-right">
            <button @click="onDelete(kid.id)" class="bg-red-700 rounded-md px-2 md:px-4 py-2 hover:opacity-70">
              <TrashSvg />
            </button>
          </td>
        </tr>
        <!-- No data found -->
        <tr v-if="kids.length === 0">
          <th class="py-4 text-center">Aucun enfant trouvé</th>
        </tr>
      </tbody>
    </table>

    <Loaders v-show="isLoading" />
  </div>
</template>
