import { LocalStorage } from 'quasar'
import { ref, watch } from 'vue'
import { useConfig } from 'src/components/backend/config'
import { useViewerUser } from 'src/components/backend/user'

const config = useConfig()

export interface Item {
  _id?: string,
  controlNumber?: string,
  name?: string,
  category?: string
  location?: string
  description?: string
}

export async function viewItems(query?: string, filter?: string) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const url = new URL(`${config.API_HOST}/items`)
    if (query) {
      url.searchParams.append('query', query)
    }
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

export async function addItem(item: Item) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const { viewUser } = useViewerUser()

    const user = await viewUser(token as string)
    const activeUser = user?.firstName + '' + user?.lastName
    const response = await fetch(`${config.API_HOST}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...item,
        loggedBy: activeUser,
      }),

    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
