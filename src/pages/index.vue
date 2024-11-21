<template>
  <q-page
    class="flex flex-center"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useConfig } from 'src/components/backend/config'
import { useAuth } from 'src/components/backend/auth'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const { validateToken } = useAuth()

const ITEMS = ref<any[]>([])
const config = useConfig()
const loading = ref(false)

function isLoggedIn() {
  const token = LocalStorage.getItem('AUTH_TOKEN')
  if (!token) return
  const isValid = validateToken(token as string)

  return isValid
}
onMounted(async () => {
  if (isLoggedIn()) {
    router.replace('/')
  } else {
    router.replace('/login')
  }
  try {
    loading.value = true
    const response = await fetch(`${config.API_HOST}/items`)
    if (!response.ok) {
      throw new Error('Failed to fetch items')
    }
    const data = await response.json()
    ITEMS.value = data.items
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
  }
})

onMounted(() => {

})
</script>

<style scoped lang="sass">

</style>
