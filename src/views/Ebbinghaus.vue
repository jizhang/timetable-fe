<script setup lang="ts">
import { useRouter } from 'vue-router'
import _ from 'lodash'
import dayjs from 'dayjs'

const router = useRouter()

// https://traverse.link/spaced-repetition/the-optimal-spaced-repetition-schedule
const REPETITIONS = [0, 1, 6, 14, 30, 66, 150, 360]

const data: string[][] = []
let current = dayjs().startOf('month')
const nextMonth = current.add(1, 'month')

while (current.isBefore(nextMonth)) {
  const row = _.map(REPETITIONS, days => {
    return current.subtract(days, 'day').format('YYYY-MM-DD')
  })
  data.push(row)
  current = current.add(1, 'day')
}
</script>

<template>
  <div class="m-3">
    <div class="d-flex">
      <h1 class="me-auto">
        Ebbinghaus
      </h1>
      <div>
        <button
          type="button"
          class="btn btn-secondary"
          @click="router.push('/')"
        >
          Back
        </button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Impression</th>
          <th>1st Review</th>
          <th>2nd Review</th>
          <th>3rd Review</th>
          <th>4th Review</th>
          <th>5th Review</th>
          <th>6th Review</th>
          <th>7th Review</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in data"
          :key="row[0]"
        >
          <td
            v-for="col in row"
            :key="col"
          >
            {{ col }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
</style>
