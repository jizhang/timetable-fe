<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/common/api'

const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
})

function handleSubmit(event: Event) {
  event.preventDefault()

  userApi.userLogin({ loginForm }).then(() => {
    router.push('/')
  })
}
</script>

<template>
  <div class="d-flex justify-content-center">
    <form
      style="width: 300px;"
      @submit="handleSubmit"
    >
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input
          v-model="loginForm.username"
          class="form-control"
        >
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          v-model="loginForm.password"
          type="password"
          class="form-control"
        >
      </div>
      <button
        type="submit"
        class="btn btn-primary"
      >
        Submit
      </button>
    </form>
  </div>
</template>
