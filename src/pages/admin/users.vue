<template>
  <q-page class="flex flex-center">
    <div class="container">
      <div class="row text-center fit q-mx-auto">
        <div class="col-12 q-pa-md bg-secondary">
          <div class="bg-white card full-height q-pt-xs">
            <q-table
              :rows="user"
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
                  Users
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

                <div class="q-mx-md">
                  <div>
                    <q-btn
                      color="green"
                      label="Add User"
                      class="q-px-md generic-button"
                      @click="showDialog = true"
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
              <template #header-cell-password="props">
                <q-th
                  :props="props"
                  class="hidden"
                />
              </template>
              <template #body-cell-password="props">
                <q-td
                  :props="props"
                  class="hidden"
                >
                  <span class="highlight-control-number">{{ props.row.password }}</span>
                </q-td>
              </template>
              <template #body-cell-button="props">
                <q-td :props="props">
                  <div class="row q-gutter-md justify-center">
                    <q-btn
                      label="UPDATE"
                      color="orange-13"
                      @click="
                        showUpdateDialog = true;
                        form._id = props.row._id;
                        form.firstName = props.row.firstName;
                        form.middleName = props.row.middleName;
                        form.lastName = props.row.lastName;
                        form.division = props.row.division;
                        form.username = props.row.username;
                        form.password = props.row.password"
                    />
                    <q-btn
                      label="CHANGE PASSWORD"
                      color="orange-14"
                      @click="changePasswordDialog = true; form._id = props.row._id;"
                    />
                    <q-btn
                      :disable="deleteUserLoading"
                      label="DELETE"
                      color="red"
                      @click="deleteUser(props.row._id, props.row.username)"
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
            Add User
          </div>
          <q-input
            v-model="form.username"
            label="Employee ID"
            color="accent"
            bg-color="primary"
            borderless
            autofocus
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.firstName"
            label="First Name"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.middleName"
            label="Middle Name"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.lastName"
            label="Last Name"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.division"
            label="Division"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.password"
            label="Password"
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
        class="text-center q-px-md q-mb-md q-mt-sm q-mx-auto"
        @submit.prevent="onSubmit"
      >
        <div class="column q-col-gutter-md q-pa-sm">
          <div class="text-h4">
            Update User
          </div>
          <q-input
            v-model="form.username"
            label="Employee ID"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.firstName"
            label="First Name"
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
            v-model="form.middleName"
            label="Middle Name"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.lastName"
            label="Last Name"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="form.division"
            label="Division"
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
                @click="showUpdateDialog = false; clear()"
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
                label="Update"
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

  <!-- CHANGE PASSWORD DIALOG -->
  <q-dialog
    v-model="changePasswordDialog"
    persistent
  >
    <q-card style="width: 900px; max-width: 30vw;">
      <q-form
        ref="passwordRef"
        class="text-center q-px-md q-mb-md q-mt-sm q-mx-auto"
        @submit.prevent="updatePassword"
      >
        <div class="column q-col-gutter-md q-pa-sm">
          <div class="text-h6">
            Change Password
          </div>
          <q-input
            v-model="password.password1"
            label="Password"
            color="accent"
            bg-color="primary"
            borderless
            autofocus
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />
          <q-input
            v-model="password.password2"
            label="Re-enter Password"
            color="accent"
            bg-color="primary"
            borderless
            hide-bottom-space
            :rules="[(val: any) => !!val || 'This field is required']"
            :disable="loading"
            class="text-primary generic-input"
          />

          <div class="row q-mx-auto q-col-gutter-md">
            <div class="col-6">
              <q-btn
                color="orange-13"
                label="Cancel"
                class="full-width generic-button"
                @click="changePasswordDialog = false; clearPassword()"
              />
            </div>
            <div class="col-6">
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
      </q-form>
    </q-card>
  </q-dialog>

  <!-- QR CODE -->
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
import { type User, useViewerUser, addUser, updateUser } from 'src/components/backend/user'
import { Dialog, Notify, QForm } from 'quasar'

const showDialog = ref(false)
const showUpdateDialog = ref(false)
const changePasswordDialog = ref(false)
const loading = ref(false)
const deleteUserLoading = ref(false)
const formRef = ref<QForm>(null as any)
const passwordRef = ref<QForm>(null as any)
const currItem = ref(null as any)

const user = ref<User[]>([])
const searchQuery = ref('')
const filter = ref('employee')
const active = ref(true)
const form = reactive({
  _id: '',
  firstName: '',
  middleName: '',
  lastName: '',
  division: '',
  username: '',
  password: '',
})

const password = reactive({
  password1: '',
  password2: '',
})

const { viewUsers } = useViewerUser()

function clear() {
  form._id = ''
  form.firstName = ''
  form.middleName = ''
  form.lastName = ''
  form.division = ''
  form.username = ''
  form.password = ''
  formRef.value.reset()
}

function clearPassword() {
  password.password1 = ''
  password.password2 = ''
  passwordRef.value.reset()
}

async function updatePassword() {
  try {
    loading.value = true
    if (password.password1 !== password.password2) {
      return Notify.create({
        message: 'Passwords do not match',
        color: 'negative',
      })
    }

    await updateUser({
      _id: form._id,
      password: password.password1,
    })
    changePasswordDialog.value = false
  } finally {
    loading.value = false
  }
}
async function onSubmit() {
  try {
    loading.value = true
    if (showDialog.value) {
      const response = await addUser({
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        division: form.division,
        username: form.username,
        password: form.password,
      })

      if (response.message) {
        Notify.create({
          message: response.message,
          color: 'negative',
        })
        form.username = ''
      } else {
        Notify.create({
          message: 'User added successfully',
          color: 'positive',
        })
        showDialog.value = false
        clear()
      }
    } else if (showUpdateDialog.value) {
      const response = await updateUser({
        _id: form._id,
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        division: form.division,
        username: form.username,
        password: form.password,
      })
      if (response.message) {
        Notify.create({
          message: response.message,
          color: 'negative',
        })
        form.username = ''
      } else {
        Notify.create({
          message: 'User added successfully',
          color: 'positive',
        })
        showUpdateDialog.value = false
        clear()
      }
    }

    fetchItems()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

async function fetchItems() {
  try {
    loading.value = true
    const _user = await viewUsers(active.value, searchQuery.value.trim(), filter.value.trim())
    user.value = _user
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
  }
}

async function deleteUser(id: string, username: string) {
  try {
    deleteUserLoading.value = true
    Dialog.create({
      title: 'Confirm Action',
      message: `Are you sure you want to delete <b>${username}</b>? This action cannot be undone.`,
      html: true,
      color: 'black',
      ok: { label: 'Delete Item', color: 'negative' },
      cancel: true,
    }).onOk(async () => {
      await updateUser({
        _id: id,
        active: false,
      })
      fetchItems()
    })
  } catch (error) {
    console.error('Error deleting item:', error)
  } finally {
    deleteUserLoading.value = false
  }
}

const qrcodeContainer = ref()

function downloadQrCode() {
  const canvas = qrcodeContainer.value.querySelector('canvas')
  const ctx = canvas.getContext('2d')

  const borderWidth = 20
  const borderedCanvas = document.createElement('canvas')
  borderedCanvas.width = canvas.width + 2 * borderWidth
  borderedCanvas.height = canvas.height + 2 * borderWidth

  const canvasCtx = borderedCanvas.getContext('2d')

  if (canvasCtx) {
    canvasCtx.fillStyle = 'white'
    canvasCtx.fillRect(0, 0, borderedCanvas.width, borderedCanvas.height)

    canvasCtx.drawImage(canvas, borderWidth, borderWidth)

    const link = document.createElement('a')
    link.download = 'QR CODE'
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
    name: 'password',
    label: 'PASSWORD',
    field: (r: any) => r.password,
    required: true,
    align: 'center',
  },
  {
    name: 'username',
    label: 'EMPLOYEE ID',
    field: (r: any) => r.username,
    required: true,
    align: 'center',
  },
  {
    name: 'firstName',
    label: 'FIRST NAME',
    field: (r: any) => r.firstName,
    align: 'center',
  },
  {
    name: 'middleName',
    label: 'MIDDLE NAME',
    field: (r: any) => r.middleName,
    align: 'center',
  },
  {
    name: 'lastName',
    label: 'LAST NAME',
    field: (r: any) => r.lastName,
    align: 'center',
  },
  {
    name: 'division',
    label: 'DIVISION',
    field: (r: any) => r.division,
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
