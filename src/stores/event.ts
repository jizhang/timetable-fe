import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
import type { Category, Event } from '@/openapi'
import { eventApi } from '@/common/api'

interface CalEvent {
  id: string
  categoryId: number
  title: string
  start: Date
  end: Date
  color: string
}

export default defineStore('event', () => {
  const categories = ref<Category[]>([])
  const categoriesLoaded = ref(false)

  async function getCategories() {
    if (categoriesLoaded.value) return
    const payload = await eventApi.getEventCategories()
    categories.value = payload.categories || []
    categoriesLoaded.value = true
  }

  function getCategoryColor(categoryId: number) {
    const category = _.find(categories.value, ['id', categoryId])
    return category?.color || ''
  }

  const events = ref<Event[]>([])

  const calEvents = computed<CalEvent[]>(() => {
    return _.map(events.value, event => {
      return {
        id: String(event.id),
        categoryId: event.categoryId,
        title: event.title,
        start: event.start,
        end: event.end,
        color: getCategoryColor(event.categoryId),
      }
    })
  })

  async function getEvents(start: Date, end: Date) {
    await getCategories()
    const payload = await eventApi.getEventList({ start, end })
    events.value = payload.events || []
  }

  async function saveEvent(event: Event) {
    const payload = await eventApi.saveEvent({ event })

    if (!event.id) {
      events.value.push({
        ...event,
        id: payload.id,
      })
    } else {
      const item = _.find(events.value, ['id', payload.id]) as Event
      item.categoryId = event.categoryId
      item.title = event.title
    }
  }

  async function deleteEvent(id: number | string) {
    const eventId = { id: _.toInteger(id) }
    const payload = await eventApi.deleteEvent({ eventId })
    _.remove(events.value, ['id', payload.id])
  }

  return {
    categories,
    calEvents,
    getEvents,
    saveEvent,
    deleteEvent,
  }
})
