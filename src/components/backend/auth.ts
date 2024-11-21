import { LocalStorage } from 'quasar'
import { ref, watch } from 'vue'
import { useConfig } from 'src/components/backend/config'
import { useViewerUser } from 'src/components/backend/user'
import { useRouter } from 'vue-router'

export interface LoginInput {
  username?: string,
  password?: string
}

export const token = ref<string | null>(LocalStorage.getItem('AUTH_TOKEN') || '')
watch(token, (val) => { LocalStorage.set('AUTH_TOKEN', val || '') })

export const userRole = ref<string | null>(LocalStorage.getItem('USER_ROLE') || '')
watch(userRole, (val) => { LocalStorage.set('USER_ROLE', val || '') }, { immediate: true })

const config = useConfig()
const { viewUser } = useViewerUser()
export function useLogin() {
  // login function
  async function login(input: LoginInput) {
    try {
      const response = await fetch(`${config.API_HOST}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: input.username,
          password: input.password,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      token.value = data.token as any
      if (token.value) {
        const user = await viewUser(token.value)
        userRole.value = user?.role as string
      }
    } catch (error) {
      console.error('Error occurred:', error)
    }
  }

  function isLoggedIn() {
    return !!token.value
  }

  return { login, isLoggedIn }
}

export function useLogout() {
  const router = useRouter()

  token.value = null
  LocalStorage.set('USER_ROLE', '')
  router.replace('/login')
}

export function useAuth() {
  async function validateToken(token: string) {
    try {
      const response = await fetch(`${config.API_HOST}/users/tokenValidation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      return data.isValid
    } catch (error) {
      console.error('Error occurred:', error)
    }
  }

  return { validateToken }
}
