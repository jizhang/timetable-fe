<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Modal } from 'bootstrap'

const model = defineModel<boolean>({ required: true })

const props = defineProps<{
  title: string
}>()

const emit = defineEmits<{
  shown: []
}>()

const modalRef = ref<HTMLElement | null>(null)
let modal: Modal
onMounted(() => {
  if (modalRef.value) {
    modal = new Modal(modalRef.value, { backdrop: 'static' })
    modalRef.value.addEventListener('shown.bs.modal', () => emit('shown'))
  }
})

watch(model, (value) => {
  if (value) {
    modal.show()
  } else {
    modal.hide()
  }
})
</script>

<template>
  <div
    ref="modalRef"
    class="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ props.title }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="model = false"
          />
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
