<template>
  <q-page class="flex flex-center">
    <q-form
      class="bg-transparent"
      style="width: 400px; max-width: 90vw"
      @submit.prevent="onSubmit"
    >
      <div class="text-center q q-mb-md">
        <q-img
          src="~assets/logo.png"
          no-spinner
          class="logo"
        />
      </div>
      <div class="column q-col-gutter-md q-pa-sm">
        <div class="text-center text-white login-text">
          Inventory Management
          <span class="text-primary">
            System
          </span>
        </div>
        <div>
          <q-input
            v-model="form.username"
            label="Username"
            color="accent"
            bg-color="white"
            filled
            class="text-primary generic-input"
          />
        </div>
        <div>
          <q-input
            v-model="form.password"
            label="Password"
            bg-color="white"
            color="accent"
            filled
            class="generic-input"
            :class="{'password-toggle': passwordToggle}"

            :type="passwordToggle ? 'password' : 'text'"
          >
            <template #append>
              <q-icon
                :name="passwordToggle ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="passwordToggle = !passwordToggle"
              />
            </template>
          </q-input>
        </div>
      </div>
      <q-card-actions align="right">
        <div class="generic-button bg-secondary fit">
          <q-btn
            :loading="loading"
            label="Login"
            type="submit"
            class="full-width"
            size="lg"
            flat
            dense
            no-caps
          />
        </div>
      </q-card-actions>
    </q-form>
  </q-page>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useLogin, useAuth } from 'src/components/backend/auth'
import { useRouter } from 'vue-router'
import { LocalStorage, Notify } from 'quasar'

const router = useRouter()
const form = reactive({
  username: '',
  password: '',
})

const loading = ref(false)
const passwordToggle = ref(true)
const { login } = useLogin()
async function onSubmit() {
  try {
    if (form.username.trim() === '' || form.password.trim() === '') {
      return Notify.create({
        message: 'Please enter username and password',
        color: 'negative',
        textColor: 'white',
      })
    }

    loading.value = true
    // login

    await login(form)
    // check user role

    if (isLoggedIn()) {
      router.replace('/')
    } else {
      Notify.create({
        message: 'Invalid username or password',
        color: 'negative',
        textColor: 'white',
      })
    }
  } catch (error) {
    throw new Error('Something went wrong')
  } finally {
    loading.value = false
  }
}

const { validateToken } = useAuth()

function isLoggedIn() {
  const token = LocalStorage.getItem('AUTH_TOKEN')
  if (!token) return
  const isValid = validateToken(token as string)

  return isValid
}

onMounted(() => {
  if (isLoggedIn()) {
    router.replace('/')
  }
})
</script>

<style lang="sass" scoped>
.logo
  width: 300px
  max-width: 40vw

.q-form
  max-width: 30vw
.login-text
  font-size: 3rem

.password-toggle
  :deep(.q-field__native)
    font-family: Serif !important
    font-size: 2rem !important
</style>
