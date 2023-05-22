import { ref } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
import type { Category, Event } from '@/openapi'
import { eventApi } from '@/common/api'

export default defineStore('event', () => {
  const categories = ref<Category[]>([])

  async function getCategories() {
    const payload = await eventApi.getEventCategories()
    categories.value = payload.categories || []
  }

  const events = ref<Event[]>([])

  async function getEvents(start: Date, end: Date) {
    const payload = await eventApi.getEventList({ start, end })
    events.value = payload.events || []
  }

  async function saveEvent(event: Event) {
    const payload = await eventApi.saveEvent({ event })
    return payload.id!
  }

  async function deleteEvent(id: number | string) {
    const eventId = { id: _.toInteger(id) }
    const payload = await eventApi.deleteEvent({ eventId })
    return payload.id!
  }

  return {
    categories,
    getCategories,
    events,
    getEvents,
    saveEvent,
    deleteEvent,
  }
})
