<template>
  <q-page class="flex flex-center">
    <div class="container">
      <div class="text-h5 text-white q-mb-md">
        LOGS
      </div>

      <div class="bg-white card full-height q-pt-xs">
        <q-scroll-area style="width: 100%; height: 900px; max-height: 84vh;">
          <div
            v-for="(log, idx) in logs "
            :key="idx"
            class="text-uppercase text-left"
          >
            <div class="log-text q-px-md">
              <span class="log-subtext">{{ idx + 1 }}. </span>{{ log }}
            </div>
          </div>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LocalStorage } from 'quasar'
import { useConfig } from 'src/components/backend/config'

const loading = ref(false)
const config = useConfig()
const logs = ref([])
async function fetchLogs() {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')

    const response = await fetch(`${config.API_HOST}/items/getLogs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    logs.value = data.logs
  } catch (error) {

  }
}

onMounted(fetchLogs)

</script>

<style lang="sass" scoped>
.container
  width: 94vw

.log-text
  font-size: 1.5rem
  border-bottom: 2px solid black
.log-subtext
  font-size: 1.4rem
// Mobile
@media screen and (max-width: $breakpoint-xs-max)
  .log-text
    font-size: 1.1rem
    text-wrap: balance
  .log-subtext
    font-size: 1rem
</style>
