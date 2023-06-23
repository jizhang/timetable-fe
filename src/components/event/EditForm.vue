<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import _ from 'lodash'
import type { Event } from '@/openapi'
import useEventStore from '@/stores/event'
import Modal from '@/components/Modal.vue'

const props = defineProps<{
  modelValue: boolean
  event: Event
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'save', event: Event): void
  (e: 'delete', id: number): void
}>()

const modalVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const eventForm = reactive({
  categoryId: '',
  title: '',
})

watch(props.event, (event) => {
  _.assign(eventForm, {
    categoryId: String(event.categoryId),
    title: event.title,
  })
})

const eventStore = useEventStore()

function saveEvent() {
  emit('save', {
    ...props.event,
    categoryId: _.toInteger(eventForm.categoryId),
    title: eventForm.title,
  })
}

function deleteEvent() {
  if (confirm('Are you sure?')) {
    emit('delete', props.event.id as number)
  }
}
</script>

<template>
  <Modal
    v-model="modalVisible"
    :title="`${event.id ? 'Edit' : 'New'} Event`"
  >
    <form>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label">Category:</label>
        <div class="col-sm-10">
          <select
            v-model="eventForm.categoryId"
            class="form-select"
          >
            <option
              v-for="category in eventStore.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="mb-3">
        <textarea
          v-model="eventForm.title"
          class="form-control"
          :rows="5"
        />
      </div>
    </form>
    <template #footer>
      <button
        type="button"
        class="btn btn-secondary"
        @click="modalVisible = false"
      >
        Close
      </button>
      <button
        v-if="event.id"
        class="btn btn-danger"
        @click="deleteEvent"
      >
        Delete
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="saveEvent"
      >
        Save
      </button>
    </template>
  </Modal>
</template>
