<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import dayjs from 'dayjs'
import * as service from '@/services/note'

const router = useRouter()

const isLoading = ref(false)
const created = ref('')
const noteForm = reactive({
  content: '',
})

onMounted(() => {
  service.getNote().then(response => {
    noteForm.content = response.content || ''
  })
})

function handleSubmit(event: Event) {
  event.preventDefault()
  saveNote()
}

function saveNote() {
  service.saveNote(noteForm).then(response => {
    created.value = dayjs(response.created).format('YYYY-MM-DD HH:mm:ss')
  })
}

const handleChangeContent = _.debounce(saveNote, 5000)
</script>

<template>
  <form @submit="handleSubmit">
    <div class="d-flex">
      <div class="title flex-grow-1">
        Note
      </div>
      <div class="dropdown">
        <button
          class="btn btn-secondary btn-sm dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          Goto
        </button>
        <ul class="dropdown-menu">
          <li>
            <a
              class="dropdown-item"
              href="javascript:;"
              @click="router.push('/ebbinghaus')"
            >
              Ebbinghaus
            </a>
          </li>
        </ul>
      </div>
    </div>
    <textarea
      v-model="noteForm.content"
      class="content font-monospace lh-sm"
      @input="handleChangeContent"
    />
    <div>
      <button
        type="submit"
        class="btn btn-primary btn-sm"
        :disabled="isLoading"
      >
        Save
      </button>
    </div>
    <div
      v-if="created"
      class="alert alert-success saved"
    >
      Saved {{ created }}
    </div>
  </form>
</template>

<style scoped lang="scss">
$vertical-gap: 1rem;

.title {
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
}

.content {
  display: block;
  width: 100%;
  height: 560px;
  margin: $vertical-gap 0;
  font-size: 12px;
}

.saved {
  text-align: center;
  margin-top: $vertical-gap;
  padding: 8px;
}
</style>
