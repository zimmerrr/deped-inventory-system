import { LocalStorage } from 'quasar'
import { ref, watch } from 'vue'
import { useConfig } from 'src/components/backend/config'

const config = useConfig()

export interface User {
  _id?: string,
  firstName?: string,
  middleName?: string,
  lastName?: string
  division?: string
  username?: string
  password?: string
  role?: string
  active?: boolean
}

export function useViewerUser() {
  async function viewUser(token?: string) {
    try {
      const _token = LocalStorage.getItem('AUTH_TOKEN')
      const response = await fetch(`${config.API_HOST}/users/myProfile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token || _token}`,
        },

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

  async function viewUsers(active?: boolean, query?: string, filter?: string) {
    try {
      const token = LocalStorage.getItem('AUTH_TOKEN')
      const url = new URL(`${config.API_HOST}/users`)

      if (query) {
        url.searchParams.append('query', query)
      }

      url.searchParams.append('active', active ? 'true' : 'false')

      if (filter) {
        url.searchParams.append('filter', filter)
      }

      const response = await fetch(url.toString(), {
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

      return data
    } catch (error) {
      console.error('Error occurred:', error)
    }
  }

  return { viewUser, viewUsers }
}

export function viewUsers() {
  async function viewUsersByRole(role: string) {
    try {
      const token = LocalStorage.getItem('AUTH_TOKEN')
      const response = await fetch(`${config.API_HOST}/users/role/${role}`, {
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

      return data
    } catch (error) {
      console.error('Error occurred:', error)
    }
  }

  return { viewUsersByRole }
}

export async function addUser(user: User) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const response = await fetch(`${config.API_HOST}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...user,
      }),

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

export async function updateUser(user: User) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const response = await fetch(`${config.API_HOST}/users/update/${user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...user,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
