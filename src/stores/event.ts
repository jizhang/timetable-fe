import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
import dayjs from 'dayjs'
import type { Category, Event } from '@/openapi'
import { eventApi } from '@/common/api'

export default defineStore('event', () => {
  const categories = ref<Category[]>([])
  const categoriesLoaded = ref(false)

  async function getCategories() {
    if (categoriesLoaded.value) return
    const payload = await eventApi.getEventCategories()
    categories.value = payload.categories || []
    categoriesLoaded.value = true
  }

  const events = ref<Event[]>([])

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
      const item = _.find(events.value, ['id', event.id]) as Event
      _.assign(item, {
        categoryId: event.categoryId,
        title: event.title,
        start: event.start,
        end: event.end,
      })
    }
  }

  async function deleteEvent(id: number) {
    const eventId = { id }
    const payload = await eventApi.deleteEvent({ eventId })
    _.remove(events.value, ['id', payload.id])
  }

  function getCategoryColor(categoryId: number) {
    const category = _.find(categories.value, ['id', categoryId])
    return category?.color || ''
  }

  const calEvents = computed(() => {
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

  const categoryDurations = computed(() => {
    const durations: Record<string, number> = {}

    for (const event of events.value) {
      const start = dayjs(event.start)
      if (!start.isSame(dayjs(), 'day')) {
        continue
      }

      const end = dayjs(event.end)
      const minutes = end.diff(start, 'minutes')
      const key = String(event.categoryId)
      if (!(key in durations)) {
        durations[key] = 0
      }
      durations[key] += minutes
    }

    return _.map(categories.value, (category) => {
      const key = String(category.id)
      let duration: string
      if (key in durations) {
        duration = (durations[key] / 60) + 'h'
      } else {
        duration = '-'
      }
      return {
        title: category.title,
        duration,
      }
    })
  })

  return {
    categories,
    getEvents,
    saveEvent,
    deleteEvent,
    calEvents,
    categoryDurations,
  }
})
