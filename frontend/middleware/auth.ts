import { user } from "~/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
  if (!user.value?.id) {
    return navigateTo("/login");
  }
});
