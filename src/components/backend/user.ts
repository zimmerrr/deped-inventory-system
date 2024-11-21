import { LocalStorage } from 'quasar'
import { ref, watch } from 'vue'
import { useConfig } from 'src/components/backend/config'

const config = useConfig()

export interface User {
  _id?: string,
  firstName?: string,
  middleName?: string,
  lastName?: string
  employeeId?: string
  division?: string
  username?: string
  password?: string
  role?: string
}

export function useViewerUser() {
  async function viewUser(token?: string) {
    try {
      const _token = LocalStorage.getItem('AUTH_TOKEN')
      const response = await fetch(`${config.API_HOST}/users/myProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token || _token,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      return data as User
    } catch (error) {
      console.error('Error occurred:', error)
    }
  }

  return { viewUser }
}

export function viewUsers() {
  async function viewUsersByRole(role: string) {
    try {
      const token = LocalStorage.getItem('AUTH_TOKEN')
      const response = await fetch(`${config.API_HOST}/users/role/${role}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `${token}`,

        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error occurred:', error)
    }
  }

  return { viewUsersByRole }
}
