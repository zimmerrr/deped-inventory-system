<template>
  <q-page class="flex flex-center">
    <div class="container">
      <div class="row text-center fit q-mx-auto">
        <div class="col-12 q-pa-md bg-secondary">
          <div class="bg-white card full-height q-pt-xs">
            <q-table
              :rows="items"
              class="text-uppercase"
              :loading="loading"
              :columns="COLUMNS"
              :rows-per-page-options="[10, 15, 20, 25, 50]"
              row-key="id"
              :filter="filter"
            >
              <template #loading>
                <q-inner-loading showing>
                  <q-spinner-hourglass
                    size="5em"
                    color="black"
                  />
                </q-inner-loading>
              </template>
              <template #top>
                <div class="text-h6 q-pl-md">
                  Inventory
                </div>
                <q-space />
                <q-input
                  v-model="filter"
                  color="accent"
                  filled
                  borderless
                  dense
                  hide-bottom-space
                  label="Search"
                  debounce="250"
                  class="filter-input"
                />

                <div class="q-mx-md">
                  <div>
                    <q-btn
                      color="green"
                      label="Add Item"
                      class="q-px-md generic-button"
                      @click="showDialog = true"
                    />
                  </div>
                </div>
              </template>

              <template #body-cell-button="props">
                <q-td :props="props">
                  <div class="row q-gutter-md justify-center">
                    <q-btn
                      label="VIEW QR"
                      color="green"
                      @click="currItem = props.row._id"
                    />
                    <q-btn
                      :disable="deleteItemLoading"
                      label="DELETE"
                      color="red"
                      @click="deleteItem(props.row._id, props.row.controlNumber)"
                    />
                  </div>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </q-page>

  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 900px; max-width: 50vw;">
      <q-form
        ref="formRef"
        class="text-center q-px-md q-mb-md q-mt-sm q-mx-auto"
        @submit.prevent="onSubmit"
      >
        <div class="column q-col-gutter-md q-pa-sm">
          <div class="text-h4">
            Add Item
          </div>
          <q-input
            v-model="form.controlNumber"
            label="Control Number"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            autofocus
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.name"
            label="Item Name"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-select
            v-model="form.category"
            label="Category"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            :options="['For disposal', 'For archiving']"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.location"
            label="Location"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.description"
            label="Description"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <div class="row q-mx-auto q-col-gutter-md">
            <div>
              <q-btn
                color="orange-13"
                label="Cancel"
                class="q-px-xl generic-button"
                @click="showDialog = false; clear()"
              />
            </div>
            <div>
              <q-btn
                color="red"
                label="Clear"
                class="q-px-xl generic-button"
                @click="clear"
              />
            </div>
            <div>
              <q-btn
                color="green"
                label="Add"
                :loading="loading"
                class="q-px-xl generic-button"
                type="submit"
              />
            </div>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog
    :model-value="!!currItem"
    persistent
    @before-hide="currItem = null"
  >
    <q-card
      class="full-width q-pb-md"
      style="width: 400px; max-width: min(40vh, 80vw)"
    >
      <div class="row justify-center q-gutter-md q-pa-sm">
        <div class="col-12">
          <div class="text-center">
            <div class="bg-white q-pa-md inline-block">
              <div
                v-if="currItem"
                ref="qrcodeContainer"
                class="qr-code"
              >
                <qrcode-vue
                  :value="currItem"
                  level="H"
                  :size="250"
                  class="qrcode fit"
                  :loading="!currItem"
                />
              </div>
              <q-spinner
                v-else
                size="128px"
                class="q-ma-xl"
                color="black"
              />
            </div>
          </div>
        </div>

        <q-btn
          v-close-popup
          label="Close"
          color="red"
          class="q-px-xl"
        />
        <q-btn
          label="Download"
          color="green"
          class="q-px-lg"
          @click="downloadQrCode"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { type Item, viewItems, addItem } from 'src/components/backend/items'
import { Notify, QForm } from 'quasar'
import QrcodeVue, { type Level } from 'qrcode.vue'

const showDialog = ref(false)
const loading = ref(false)
const deleteItemLoading = ref(false)
const formRef = ref<QForm>(null as any)
const currItem = ref(null as any)

const items = ref<Item[]>([])
const filter = ref('')
const form = reactive({
  controlNumber: '',
  name: '',
  category: '',
  location: '',
  description: '',
})

function clear() {
  form.controlNumber = ''
  form.name = ''
  form.category = ''
  form.location = ''
  form.description = ''
  formRef.value.reset()
}

async function onSubmit() {
  try {
    loading.value = true

    await addItem({
      controlNumber: form.controlNumber,
      name: form.name,
      category: form.category,
      location: form.location,
      description: form.description,
    })
    fetchItems()
    clear()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

async function fetchItems() {
  try {
    loading.value = true
    const _items = await viewItems(filter.value.trim())
    items.value = _items
    console.log(items.value)
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
  }
}

async function deleteItem(id: number, name: string) {
  try {
    deleteItemLoading.value = true
    // TODO: delete item
  } catch (error) {
    console.error('Error deleting item:', error)
  } finally {
    deleteItemLoading.value = false
  }
}

const level = ref<Level>('M')

const qrcodeContainer = ref()

function downloadQrCode() {
  const canvas = qrcodeContainer.value.querySelector('canvas')
  const link = document.createElement('a')
  link.download = 'qr-code.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

onMounted(fetchItems)
watch(filter, fetchItems)

const COLUMNS: {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: 'center' | 'left' | 'right';
  sortable?: boolean;
}[] = [
  {
    name: 'controlNumber',
    label: 'CONTROL NUMBER',
    field: (r: any) => r.controlNumber,
    required: true,
    align: 'center',
  },
  {
    name: 'name',
    label: 'ITEM NAME',
    field: (r: any) => r.name,
    align: 'center',
  },
  {
    name: 'category',
    label: 'CATEGORY',
    field: (r: any) => r.category,
    align: 'center',
  },
  {
    name: 'location',
    label: 'LOCATION',
    field: (r: any) => r.location,
    align: 'center',
  },
  {
    name: 'description',
    label: 'DESCRIPTION',
    field: (r: any) => r.description,
    align: 'center',
  },
  {
    name: 'button',
    align: 'center',
    field: 'id',
    label: '',
  },
]
</script>

<style lang="sass" scoped>
.container
  width: 94vw

.qr-code
  width: 100%

.filter-input
  width: 25% !important
  :deep(.q-field__control)
    border-radius: 0px !important
  :deep(.q-field__native)
    font-size: 1rem !important
  :deep(.q-field__label)
    font-size: 1rem !important

:deep(.q-table__container)
  min-height: 80vh !important

</style>
