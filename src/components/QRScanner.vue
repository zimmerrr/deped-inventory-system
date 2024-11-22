<template>
  <q-responsive
    :ratio="1"
    class="qr-scanner"
  >
    <div
      v-show="activeDevice"
      class="relative-position bg-black"
    >
      <div
        :id="divId"
        ref="rootEl"
        :class="{'camera-container' : mirrorCamera}"
      />
      <div class="absolute-top-right text-white q-pa-sm">
        <div class="row">
          <div class="col-6">
            <q-btn
              :disable="cameraLoading"
              icon="flip_camera_ios"
              round
              dense
              flat
              @click="nextCamera"
            />
          </div>
          <div class="col-6">
            <q-btn
              :disable="cameraLoading"
              icon="flip"
              round
              dense
              flat
              @click="mirrorCamera = !mirrorCamera"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-show="!activeDevice">
      <div class="text-h6 text-weight-bold text-center q-mt-lg">
        SELECT CAMERA
      </div>
      <div
        v-for="camera in cameras"
        :key="camera.id"
        class="q-mt-md"
      >
        <q-btn
          :label="camera.label"
          class="full-width"
          size="lg"
          @click="selectCamera(camera.id)"
        />
      </div>
    </div>
  </q-responsive>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, watch, toRef } from 'vue'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import { LocalStorage } from 'quasar'
import type { CameraDevice } from 'html5-qrcode'

const emit = defineEmits<{
  (event: 'scan', data: string): void
}>()

const props = defineProps({
  disable: { type: Boolean, default: false },
})

const divId = ref(`camera-${Math.ceil(Math.random() * 1000000)}`)
const rootEl = ref<HTMLDivElement>(null as any)

const cameraLoading = ref(false)
const cameras = ref<CameraDevice[]>([])
const mirrorCamera = ref(false)
const activeDevice = ref(null as any)
let scanner: Html5Qrcode | undefined

async function initialize() {
  console.log('Initializing Camera')
  cameras.value = await Html5Qrcode.getCameras()

  scanner = new Html5Qrcode(divId.value)

  const backCamera = cameras.value.find((el: any) => {
    return el.label.toLowerCase().includes('back')
  })
  const lastCamera = cameras.value.find((el: any) => {
    return el.id === LocalStorage.getItem('lastCameraId')
  })
  const camera = lastCamera || backCamera || cameras.value[0]
  if (camera) {
    await selectCamera(camera.id)
  }
}

async function selectCamera(cameraId: string) {
  if (!scanner) throw new Error('Scanner not initialzied')
  if (cameraLoading.value) return

  cameraLoading.value = true
  LocalStorage.set('lastCameraId', cameraId)
  activeDevice.value = cameraId

  if (scanner?.isScanning) {
    await scanner.stop()
  }

  await scanner.start(
    cameraId,
    {
      fps: 15,
      aspectRatio: 1,
    },
    (decoded: string) => {
      console.log('QR Decoded:', decoded)
      if (!props.disable) emit('scan', decoded)
    },
    undefined,
  )
  cameraLoading.value = false
}

async function nextCamera() {
  try {
    if (!cameras.value || cameras.value.length === 0) {
      console.error('No cameras available.')
      return
    }

    const currCameraIdx = cameras.value.findIndex(
      (el: { id: any }) => el.id === activeDevice.value,
    )
    const newCameraIdx = (currCameraIdx + 1) % cameras.value.length

    const newCamera = cameras.value[newCameraIdx]
    if (!newCamera) {
      console.error('Invalid camera index.')
      return
    }

    await selectCamera(newCamera.id)
  } catch (e) {
    console.error('Error switching to the next camera:', e)
  }
}

watch(toRef(props, 'disable'), (val) => {
  const state = scanner?.getState()
  if (!state) return
  if (val && state === Html5QrcodeScannerState.SCANNING) scanner?.pause()
  else if (!val && state === Html5QrcodeScannerState.PAUSED) scanner?.resume()
})

watch(rootEl, async (el) => {
  if (el.style.display === 'none') return
  await initialize()
})

async function disposeScanner() {
  if (!scanner) return
  if (scanner.isScanning) await scanner?.stop()
  scanner?.clear()
}

onBeforeUnmount(async () => {
  await disposeScanner()
})

</script>

<style lang="sass" scoped>
.camera-container > :deep(div)
  display: none !important

.camera-container > :deep(video)
    transform: scaleX(-1)
</style>
