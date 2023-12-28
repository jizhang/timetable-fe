<script setup lang="ts">
import { ref } from 'vue'
import { Toast } from 'bootstrap'
import { emitter } from '@/common/alert'

const message = ref('')
const toastRef = ref<HTMLElement | null>(null)

emitter.on('alert', alertMessage => {
  if (!toastRef.value) {
    return
  }

  message.value = alertMessage
  const toast = Toast.getOrCreateInstance(toastRef.value)
  toast.show()
})
</script>

<template>
  <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
    <div
      ref="toastRef"
      class="toast bg-danger text-white border-0"
    >
      <div class="d-flex">
        <div class="toast-body me-auto">
          {{ message }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white mx-2 my-auto"
          data-bs-dismiss="toast"
        />
      </div>
    </div>
  </div>
</template>
