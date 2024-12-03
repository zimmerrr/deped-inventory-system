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
              :filter="searchQuery"
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
                  v-model="searchQuery"
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
                      :label="active ? 'Active' : 'Inactive'"
                      class="q-px-md generic-button"
                      flat
                      @click="active ? active = false : active = true; fetchItems()"
                    />
                  </div>
                </div>
                <div class="q-mr-md">
                  <div>
                    <q-btn
                      color="green"
                      label="Add Item"
                      class="q-px-md generic-button"
                      @click="showDialog = true;"
                    />
                  </div>
                </div>
                <div class="">
                  <div>
                    <q-btn
                      color="secondary"
                      label="Scan Item"
                      class="q-px-md generic-button"
                      @click="showScanner = true"
                    />
                  </div>
                </div>
              </template>

              <template #header-cell-id="props">
                <q-th
                  :props="props"
                  class="hidden"
                />
              </template>
              <template #body-cell-id="props">
                <q-td
                  :props="props"
                  class="hidden"
                >
                  <span class="highlight-control-number">{{ props.row._id }}</span>
                </q-td>
              </template>
              <template #body-cell-button="props">
                <q-td :props="props">
                  <div class="row q-gutter-md justify-center">
                    <q-btn
                      v-if="active"
                      label="VIEW ITEM"
                      color="green"
                      @click="
                        showUpdateDialog = true;
                        currItem = props.row._id;
                        form._id = props.row._id;
                        form.controlNumber = props.row.controlNumber;
                        form.name = props.row.name;
                        form.category = props.row.category;
                        form.location = props.row.location;
                        form.description = props.row.description"
                    />
                    <q-btn
                      :disable="deleteItemLoading"
                      :label="active ? 'DELETE' : 'RESTORE'"
                      :color="active ? 'red' : 'green'"
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

  <!-- ADD DIALOG -->
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
          <q-select
            v-model="form.name"
            label="Item Name"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :disable="loading"
            :options="FILE_NAMES"
            :rules="[(val: any) => !!val || 'This field is required']"
            class="text-primary generic-input"
          />
          <q-select
            v-model="form.category"
            label="Category"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :disable="loading"
            :options="FILE_STATUS"
            :rules="[(val: any) => !!val || 'This field is required']"
            class="text-primary generic-input"
          />
          <q-select
            v-model="form.location"
            label="Location"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :disable="loading"
            :options="FILE_LOCATIONS"
            :rules="[(val: any) => !!val || 'This field is required']"
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

  <!-- UPDATE DIALOG -->
  <q-dialog
    v-model="showUpdateDialog"
    persistent
  >
    <q-card style="width: 900px; max-width: 50vw;">
      <q-form
        ref="formRef"
        class="row text-center q-px-md q-mb-md q-mt-sm q-mx-auto"
        @submit.prevent="onSubmit"
      >
        <q-btn
          color="black"
          flat
          dense
          icon-right="close"
          size="lg"
          class="absolute-top-right q-mr-md"
          @click="showUpdateDialog = false; clear()"
        />
        <div class="col-12 text-h4 q-my-sm">
          Update Item
        </div>
        <div class="col-6">
          <div class="row items-center justify-center fit">
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
              <q-btn
                label="Download"
                color="green"
                class="q-px-lg q-mt-md generic-button"
                @click="downloadQrCode(`${form.controlNumber} - ${form.name}`)"
              />
            </div>
          </div>
        </div>
        <div class="col-6 column q-col-gutter-md q-pa-sm">
          <q-input
            v-model="form.controlNumber"
            label="Control Number"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            autofocus
            :rules="[(val: any) => !!val || 'This field is required']"
            disable
            class="text-primary generic-input"
          />
          <q-select
            v-model="form.name"
            label="Item Name"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :disable="loading"
            :options="FILE_NAMES"
            :rules="[(val: any) => !!val || 'This field is required']"
            class="text-primary generic-input"
          />
          <q-select
            v-model="form.category"
            label="Category"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :disable="loading"
            :options="FILE_STATUS"
            :rules="[(val: any) => !!val || 'This field is required']"
            class="text-primary generic-input"
          />
          <q-select
            v-model="form.location"
            label="Location"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :disable="loading"
            :options="FILE_LOCATIONS"
            :rules="[(val: any) => !!val || 'This field is required']"
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
                color="red"
                label="Clear"
                class="q-px-lg generic-button"
                @click="clear"
              />
            </div>
            <div>
              <q-btn
                color="green"
                label="Update"
                :loading="loading"
                class="q-px-lg generic-button"
                type="submit"
              />
            </div>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>

  <!-- SCANNER DIALOG -->
  <q-dialog
    v-model="showScanner"
    persistent
  >
    <q-card style="width: 1200px; max-width: 90vw;">
      <q-form
        ref="formRef"
        class="text-center q-px-md q-mt-lg q-mx-auto"
        @submit.prevent="onSubmit"
      >
        <div class="row q-col-gutter-md q-pa-sm">
          <div class="col-6">
            <QRScanner
              ref="scannerRef"
              :disable="scanLoading"
              class="q-mx-auto q-mb-xl"
              style="width: 450px;"
              @scan="onScan"
            />
          </div>
          <div class="col-6 q-col-gutter-md q-mt-sm">
            <q-input
              v-model="form.controlNumber"
              label="Control Number"
              color="accent"
              bg-color="primary"
              borderless
              hide-bottom-space
              autofocus
              :disable="loading"
              class="text-primary generic-input"
            />
            <q-select
              v-model="form.name"
              label="Item Name"
              color="accent"
              bg-color="primary"
              borderless
              hide-bottom-space
              disable
              :options="FILE_NAMES"
              class="text-primary generic-input"
            />
            <q-select
              v-model="form.category"
              label="Category"
              color="accent"
              bg-color="primary"
              borderless
              hide-bottom-space
              :disable="loading"
              :options="FILE_STATUS"
              :rules="[(val: any) => !!val || 'This field is required']"
              class="text-primary generic-input"
            />
            <q-select
              v-model="form.location"
              label="Location"
              color="accent"
              bg-color="primary"
              borderless
              hide-bottom-space
              :disable="loading"
              :options="FILE_LOCATIONS"
              :rules="[(val: any) => !!val || 'This field is required']"
              class="text-primary generic-input"
            />
            <q-input
              v-model="form.description"
              label="Description"
              color="accent"
              bg-color="primary"
              borderless
              hide-bottom-space
              :disable="loading"
              class="text-primary generic-input"
            />
            <div class="row q-mx-auto q-col-gutter-md">
              <div class="col-4">
                <q-btn
                  color="orange-13"
                  label="Cancel"
                  class="full-width generic-button"
                  @click="showScanner = false; clear()"
                />
              </div>
              <div class="col-4">
                <q-btn
                  color="red"
                  label="Clear"
                  class="full-width generic-button"
                  @click="clear"
                />
              </div>
              <div class="col-4">
                <q-btn
                  color="green"
                  label="Update"
                  :loading="loading"
                  class="full-width generic-button"
                  type="submit"
                />
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { type Item, viewItems, addItem, updateItem } from 'src/components/backend/items'
import { Dialog, Notify, QForm } from 'quasar'
import QrcodeVue, { type Level } from 'qrcode.vue'
import QRScanner from 'src/components/QRScanner.vue'
import { debounce } from 'lodash'
import { FILE_NAMES, FILE_LOCATIONS, FILE_STATUS } from 'src/components/constants'

const showDialog = ref(false)
const showUpdateDialog = ref(false)
const showScanner = ref(false)
const loading = ref(false)
const deleteItemLoading = ref(false)
const scanLoading = ref(false)
const formRef = ref<QForm>(null as any)
const currItem = ref(null as any)

const items = ref<Item[]>([])
const searchQuery = ref('')
const filter = ref('')
const active = ref(true)
const form = reactive({
  _id: '',
  controlNumber: '',
  name: '',
  category: '',
  location: '',
  description: '',
})

function clear() {
  form._id = ''
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
    if (showDialog.value) {
      await addItem({
        controlNumber: form.controlNumber,
        name: form.name,
        category: form.category,
        location: form.location,
        description: form.description,
      })
    } else if (showUpdateDialog.value) {
      await updateItem({
        _id: form._id,
        controlNumber: form.controlNumber,
        name: form.name,
        category: form.category,
        location: form.location,
        description: form.description,
      })
      showUpdateDialog.value = false
    } else if (showScanner.value) {
      await updateItem({
        _id: form._id,
        controlNumber: form.controlNumber,
        name: form.name,
        category: form.category,
        location: form.location,
        description: form.description,
      })
      Notify.create({
        message: 'Item updated successfully',
        color: 'green',
      })

      showScanner.value = false
    }

    fetchItems()
    clear()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const debounceOnScan = debounce(async function(data: string) {
  try {
    scanLoading.value = true
    let result = await viewItems(active.value, data)
    result = result[0]
    form._id = result._id
    form.controlNumber = result.controlNumber
    form.name = result.name
    form.category = result.category
    form.location = result.location
    form.description = result.description
  } finally {
    scanLoading.value = false
  }
}, 300)

async function onScan(data: string) {
  debounceOnScan(data)
}

async function fetchItems() {
  try {
    loading.value = true
    const _items = await viewItems(active.value, searchQuery.value.trim(), filter.value.trim())
    items.value = _items
    console.log(items.value)
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
  }
}

async function deleteItem(id: string, controlNumber: string) {
  try {
    deleteItemLoading.value = true
    if (active.value) {
      Dialog.create({
        title: 'Confirm Action',
        message: `Are you sure you want to delete <b>${controlNumber}</b>?`,
        html: true,
        color: 'black',
        ok: { label: 'Delete Item', color: 'negative' },
        cancel: true,
      }).onOk(async () => {
        await updateItem({
          _id: id,
          active: false,
        })
        fetchItems()
      })
    } else {
      Dialog.create({
        title: 'Confirm Action',
        message: `Are you sure you want to restore <b>${controlNumber}</b>?.`,
        html: true,
        color: 'black',
        ok: { label: 'Restore Item', color: 'positive' },
        cancel: true,
      }).onOk(async () => {
        await updateItem({
          _id: id,
          active: true,
        })
        fetchItems()
      })
    }
  } catch (error) {
    console.error('Error deleting item:', error)
  } finally {
    deleteItemLoading.value = false
  }
}

const level = ref<Level>('M')

const qrcodeContainer = ref()

function downloadQrCode(fileName: string = 'QR CODE') {
  const canvas = qrcodeContainer.value.querySelector('canvas')
  const ctx = canvas.getContext('2d')

  const borderWidth = 20
  const textHeight = 15
  const textPadding = 10
  const borderedCanvas = document.createElement('canvas')

  borderedCanvas.width = canvas.width + 2 * borderWidth
  borderedCanvas.height = canvas.height + 2 * borderWidth + textHeight + textPadding

  const canvasCtx = borderedCanvas.getContext('2d')

  if (canvasCtx) {
    canvasCtx.fillStyle = 'white'
    canvasCtx.fillRect(0, 0, borderedCanvas.width, borderedCanvas.height)

    canvasCtx.drawImage(canvas, borderWidth, borderWidth)

    canvasCtx.fillStyle = 'black'
    canvasCtx.font = '16px Arial'
    canvasCtx.textAlign = 'center'
    const textX = borderedCanvas.width / 2
    const textY = canvas.height + borderWidth + textPadding + 16
    canvasCtx.fillText(fileName, textX, textY)

    const link = document.createElement('a')
    link.download = fileName
    link.href = borderedCanvas.toDataURL('image/png')
    link.click()
  }
}

onMounted(fetchItems)
watch(searchQuery, fetchItems)

const COLUMNS: {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: 'center' | 'left' | 'right';
  sortable?: boolean;
  class?: string;
}[] = [
  {
    name: 'id',
    label: 'ID',
    field: (r: any) => r._id,
    required: true,
    align: 'center',
  },
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
