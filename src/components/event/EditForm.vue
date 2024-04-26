<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import _ from 'lodash'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import type { Event } from '@/services/event'
import useEventStore from '@/stores/event'
import Modal from '@/components/Modal.vue'

const model = defineModel<boolean>({ required: true })

const props = defineProps<{
  event: Event
}>()

const emit = defineEmits<{
  save: [event: Event]
  delete: [id: number]
}>()

const titleInput = ref<HTMLElement | null>(null)

const defaultForm = {
  categoryId: '',
  title: '',
}
const eventForm = reactive({ ...defaultForm })

watch(model, (value) => {
  if (value) {
    _.assign(eventForm, {
      categoryId: String(props.event.categoryId),
      title: props.event.title,
    })
  } else {
    _.assign(eventForm, defaultForm)
  }
  v$.value.$reset()
})

const rules = {
  categoryId: { required },
  title: { required },
}

const v$ = useVuelidate(rules, eventForm)

const eventStore = useEventStore()

async function saveEvent() {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

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
    v-model="model"
    :title="`${event.id ? 'Edit' : 'New'} Event`"
    @shown="titleInput?.focus()"
  >
    <form>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label">Category:</label>
        <div class="col-sm-10">
          <select
            v-model="v$.categoryId.$model"
            class="form-select"
            :class="{ 'is-invalid': v$.categoryId.$error }"
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
          ref="titleInput"
          v-model="v$.title.$model"
          class="form-control"
          :class="{ 'is-invalid': v$.title.$error }"
          :rows="5"
        />
        <div
          v-if="v$.title.$error"
          class="invalid-feedback"
        >
          {{ v$.title.$errors[0].$message }}
        </div>
      </div>
    </form>
    <template #footer>
      <button
        type="button"
        class="btn btn-secondary"
        @click="model = false"
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
