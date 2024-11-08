<script setup lang="ts">
import { APP_CONFIG } from "~/environment";
import type { Creche } from "~/models/Creche";
import { loaders } from "~/stores/loaders";
import { user } from "~/stores/user";
import { toastConfig } from "~/utils";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const creche = ref<Creche>();
const showCreate = ref<boolean>(false);
const kidFirstName = ref<string>();
const kidLastName = ref<string>();

const loadData = async () => {
  loaders.value.loading = true;
  const res: any = await $fetch(`${APP_CONFIG.API_URL}child-cares/${route.params.id}`, {
    method: "GET",
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
  loaders.value.loading = false;
  creche.value = res;
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
      const res: any = await $fetch(`${APP_CONFIG.API_URL}child-cares/${creche.value?.id}/child/${id}`, {
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

const onCreate = async () => {
  loaders.value.loading = true;
  const res: any = await $fetch(`${APP_CONFIG.API_URL}child`, {
    method: "POST",
    headers: { "X-Auth": user.value?.username ? user.value?.username : "" },
    body: { firstName: kidFirstName.value, lastName: kidLastName.value, crecheId: creche.value?.id },
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
  kidFirstName.value = "";
  kidLastName.value = "";
  loadData();
};

loadData();
</script>

<template>
  <div class="max-w-[1300px] mx-auto">
    <div class="max-w-xl mt-32 px-4 md:px-0">
      <h3 class="text-xl mb-6"><span class="font-bold">Détails de la crèche :</span> {{ creche?.name }}</h3>
      <div class="mb-5">
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
        <input
          readonly
          :value="creche?.name"
          type="text"
          id="name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div class="border-b border-gray-300 pb-2 flex items-center justify-between">
        <h3 class="font-bold">Enfants associés</h3>
        <ButtonPrimary message="+" @click="showCreate = true" />
      </div>
      <table v-show="!loaders.loading" class="my-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead v-if="creche && creche.kids.length > 0" class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th v-for="header in ['Nom', 'Prénom', '']" scope="col" class="py-3">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="kid in creche?.kids" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ kid.lastName }}</th>
            <td class="py-4">{{ kid.firstName }}</td>
            <td class="py-4 text-right">
              <button @click="onDelete(kid.id)" class="bg-red-700 rounded-md px-2 md:px-4 py-2 hover:opacity-70">
                <TrashSvg />
              </button>
            </td>
          </tr>
          <!-- No data found -->
          <tr v-if="creche && creche.kids.length === 0">
            <th class="py-4 text-center">Aucun enfant trouvé</th>
          </tr>
        </tbody>
      </table>
      <router-link to="/creches">
        <ButtonSecondary message="Retour" />
      </router-link>
    </div>
  </div>

  <!-- create  dialog -->
  <div v-if="showCreate" class="dialog w-screen h-screen fixed left-0 top-0 bg-black bg-opacity-20">
    <form @submit.prevent="onCreate" class="absolute mx-auto max-w-sm bg-white top-1/2 -translate-y-1/2 left-0 right-0 rounded-md shadow-sm px-4 py-6">
      <h2 class="text-center font-bold text-lg mb-4">Créer un enfant</h2>
      <div class="mb-5">
        <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
        <input v-model="kidLastName" type="text" id="lastName" class="input" placeholder="Nom de l'élève" required />
      </div>
      <div class="mb-5">
        <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prénom</label>
        <input v-model="kidFirstName" type="text" id="firstName" class="input" placeholder="Prénom de l'élève" required />
      </div>
      <div class="flex gap-2">
        <ButtonPrimary type="submit" message="Créer" class="w-full" />
        <ButtonSecondary
          type="button"
          message="Annuler"
          @click="
            showCreate = false;
            kidFirstName = '';
            kidLastName = '';
          "
        />
      </div>
    </form>
  </div>
</template>
