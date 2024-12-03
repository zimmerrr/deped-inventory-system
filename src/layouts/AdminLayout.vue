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
          <q-toolbar-title class="text-white text-italic text-h6">
            "Sa serbisyong totoo at makatao, Bidang Imusenyo ang panalo"
          </q-toolbar-title>

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
            label="Logs"
            color="black"
            no-caps
            class="menu-button"
            @click="router.replace('logs');"
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
  background-image: url('assets/bg.png') !important
  background-repeat: no-repeat !important
  background-position: bottom !important
  background-size: contain !important
  background-blend-mode: multiply !important
.logo
  width: 300px

</style>
