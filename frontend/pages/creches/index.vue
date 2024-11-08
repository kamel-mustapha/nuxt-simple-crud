<script setup lang="ts">
import { APP_CONFIG } from "~/environment";
import type { Creche } from "~/models/Creche";
import { toastConfig } from "~/utils";
import { user } from "~/stores/user";
import { loaders } from "~/stores/loaders";

definePageMeta({
  middleware: ["auth"],
});

const creches = ref<Creche[]>([]);
const showCreate = ref<boolean>(false);
const toCreateName = ref<string>();
const toEditId = ref<number>();
const isLoading = ref<boolean>(true);
const isEdit = ref<boolean>(false);

const loadData = async () => {
  isLoading.value = true;
  const res: any = await $fetch(`${APP_CONFIG.API_URL}child-cares`, {
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
  creches.value = res;
};

const onCreate = async () => {
  if (isEdit.value) return onConfirmEdit();
  loaders.value.loading = true;
  const res: any = await $fetch(`${APP_CONFIG.API_URL}child-cares`, {
    method: "POST",
    headers: { "X-Auth": user.value?.username ? user.value?.username : "" },
    body: { name: toCreateName.value },
    onResponseError: (error: any) => {
      loaders.value.loading = false;
      Swal.fire({
        ...toastConfig,
        title: error?.response?._data?.message ? error.response._data.message : "Une erreur est survenue, veuillez réessayer",
        icon: "error",
      });
    },
  });
  Swal.fire({ ...toastConfig, title: "Elément créé avec succès", icon: "success" });
  loaders.value.loading = false;
  showCreate.value = false;
  toCreateName.value = "";
  loadData();
};

const onEdit = async (creche: Creche) => {
  toCreateName.value = creche.name;
  isEdit.value = true;
  showCreate.value = true;
  toEditId.value = creche.id;
};

const onConfirmEdit = async () => {
  loaders.value.loading = true;
  const res: any = await $fetch(`${APP_CONFIG.API_URL}child-cares/${toEditId.value}`, {
    method: "PUT",
    headers: { "X-Auth": user.value?.username ? user.value?.username : "" },
    body: { id: toEditId.value, name: toCreateName.value },
    onResponseError: (error: any) => {
      isLoading.value = false;
      Swal.fire({
        ...toastConfig,
        title: error?.response?._data?.message ? error.response._data.message : "Une erreur est survenue, veuillez réessayer",
        icon: "error",
      });
    },
  });
  Swal.fire({ ...toastConfig, title: "Elément modifié avec succès", icon: "success" });
  loaders.value.loading = false;
  showCreate.value = false;
  toCreateName.value = "";
  toEditId.value = undefined;
  loadData();
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
      const res: any = await $fetch(`${APP_CONFIG.API_URL}child-cares/${id}`, {
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

const onExtract = async (crecheId: number | undefined) => {
  let extractUrl = `${APP_CONFIG.API_URL}child/export.csv`;
  if (crecheId) extractUrl += `?crecheId=${crecheId}`;
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
  link.setAttribute("download", crecheId ? `children-${crecheId}.csv` : "children.csv"); // Set the desired file name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL
  window.URL.revokeObjectURL(url);
};

const onSearch = (event: any) => {
  if (event.target.value.length === 0) loadData();
  creches.value = creches.value.filter((creche) => creche.name.includes(event.target.value));
};

loadData();
</script>

<template>
  <div class="max-w-[1400px] mx-auto mt-24 px-4">
    <header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-cyan-950">Liste des crèches</h2>
        <ButtonPrimary
          message="Ajouter une crèche"
          class="text-lg"
          @click="
            isEdit = false;
            showCreate = true;
          "
        />
      </div>
      <div class="flex items-center gap-2 py-3 border-b border-gray-300 mt-4">
        <div class="flex w-full items-center gap-2">
          <SearchSvg />
          <input @input="onSearch($event)" placeholder="Rechercher" class="w-full outline-none border-none focus:border-none focus:outline-none focus:ring-transparent" type="search" name="" id="" />
        </div>
        <div @click="onExtract(undefined)" class="flex items-center gap-1 cursor-pointer">
          <DownloadSvg />
          <span class="font-semibold">Exporter</span>
        </div>
      </div>
    </header>

    <table v-show="!isLoading" class="mt-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead v-if="creches.length > 0" class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th v-for="header in ['Nom', 'Utilisateur', '']" scope="col" class="py-3">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="creche in creches" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ creche.name }}</th>
          <td class="py-4">{{ creche.userId }}</td>
          <td class="py-4 text-right">
            <router-link :to="'/creches/' + creche.id">
              <button class="bg-primary rounded-md px-2 md:px-4 py-2 mr-2 hover:opacity-70">
                <EyeSvg />
              </button>
            </router-link>
            <button @click="onEdit(creche)" class="bg-blue-800 rounded-md px-2 md:px-4 py-2 mr-2 hover:opacity-70">
              <PenSvg />
            </button>
            <button @click="onExtract(creche.id)" class="bg-green-700 rounded-md px-2 md:px-4 py-2 hover:opacity-70 mr-2">
              <ExtractSvg />
            </button>
            <button @click="onDelete(creche.id)" class="bg-red-700 rounded-md px-2 md:px-4 py-2 hover:opacity-70">
              <TrashSvg />
            </button>
          </td>
        </tr>
        <!-- No data found -->
        <tr v-if="creches.length === 0">
          <th class="py-4 text-center">Aucune crèche trouvée</th>
        </tr>
      </tbody>
    </table>

    <Loaders v-show="isLoading" />
  </div>

  <!-- create  dialog -->
  <div v-if="showCreate" class="dialog w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-20">
    <form @submit.prevent="onCreate" class="absolute mx-auto max-w-sm bg-white top-1/2 -translate-y-1/2 left-0 right-0 rounded-md shadow-sm px-4 py-6">
      <h2 class="text-center font-bold text-lg mb-4">{{ isEdit ? "Modifier" : "Créer" }} une crèche</h2>
      <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
        <input v-model="toCreateName" type="text" id="name" class="input" placeholder="Nom de la crèche" required />
      </div>
      <div class="flex gap-2">
        <ButtonPrimary type="submit" :message="isEdit ? 'Modifier' : 'Créer'" class="w-full" />
        <ButtonSecondary
          type="button"
          message="Annuler"
          @click="
            showCreate = false;
            toCreateName = '';
          "
        />
      </div>
    </form>
  </div>
</template>
