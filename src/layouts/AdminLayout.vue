<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-header
        v-if="route.meta.showHeader"
        elevated
      >
        <q-toolbar>
          <q-avatar>
            <q-img
              src="~assets/logo.png"
              no-spinner
              class="logo"
            />
          </q-avatar>
          <q-toolbar-title />

          <q-btn
            flat
            label="Users"
            color="black"
            no-caps
            class="menu-button"
            @click="router.replace('users')"
          />
          <q-btn
            flat
            label="Items"
            color="black"
            no-caps
            class="menu-button"
            @click="router.replace('items');"
          />
          <q-btn
            flat
            label="Logout"
            color="black"
            no-caps
            class="menu-button"
            @click="router.replace('logout')"
          />
        </q-toolbar>
      </q-header>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

defineOptions({
  name: 'MainLayout',
})

const router = useRouter()
const route = useRoute()

</script>

<style lang="sass">
.q-layout
  background-color: $accent

.logo
  width: 300px

</style>
