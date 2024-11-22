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
  active?: boolean
}

export async function viewItems(active?: string, query?: string, filter?: string) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const url = new URL(`${config.API_HOST}/items`)
    if (query) {
      url.searchParams.append('query', query)
    }
    if (active) {
      url.searchParams.append('active', active)
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

export async function updateItem(item: Item) {
  try {
    const token = LocalStorage.getItem('AUTH_TOKEN')
    const response = await fetch(`${config.API_HOST}/items/update/${item._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...item,
      }),
    })
    console.log(item)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
