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

          <div
            v-for="item in NAVIGATION"
            :key="item.name"
          >
            <q-btn
              v-if="item.role === userRole || item.role === 'all'"
              flat
              :label="item.name"
              color="black"
              no-caps
              class="menu-button"
              @click="router.replace(item.to)"
            />
          </div>
        </q-toolbar>
      </q-header>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import NAVIGATION from 'src/components/navigation'
import { ref, watch } from 'vue'
import { LocalStorage } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useConfig } from 'src/components/backend/config'

defineOptions({
  name: 'MainLayout',
})

const router = useRouter()
const route = useRoute()
const userRole = ref(LocalStorage.getItem('USER_ROLE') || '')


</script>

<style lang="sass">
.q-layout
  background-color: $accent

.logo
  width: 300px

</style>
