<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import _ from 'lodash'
import dayjs from 'dayjs'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventApi as CalendarEvent, FormatterInput, CalendarOptions, CalendarApi, EventSourceFuncArg } from '@fullcalendar/core'
import type { Category } from '@/openapi'
import { commonApi, eventApi } from '@/common/api'
import Modal from '@/components/Modal.vue'
import Note from '@/components/Note.vue'

// Utilities
function calculateCalendarHeight() {
  return window.innerHeight - 50
}

const timeFormat: FormatterInput = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}

// Calendar
const options: CalendarOptions = {
  allDaySlot: false,
  editable: true,
  eventTimeFormat: timeFormat,
  firstDay: 1,
  height: calculateCalendarHeight(),
  nowIndicator: true,
  plugins: [timeGridPlugin, interactionPlugin],
  scrollTime: '08:00:00',
  selectable: true,
  selectOverlap: false,
  slotLabelFormat: timeFormat,

  select({ start, end }) {
    Object.assign(eventForm, {
      ...defaultEventForm,
      start,
      end,
    })
    modalVisible.value = true
  },

  eventClick({ event }) {
    updateEventForm(event)
    modalVisible.value = true
  },

  eventDrop({ event }) {
    updateEventForm(event)
    saveEvent()
  },

  eventResize({ event }) {
    updateEventForm(event)
    saveEvent()
  },

  eventsSet(events) {
    updateCategoryDurations(events)
  },
}

const categories = ref<Category[]>([])
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)
let calendarApi: CalendarApi

const handleResizeWindow = _.debounce(() => {
  calendarApi.setOption('height', calculateCalendarHeight())
}, 200)

onMounted(() => {
  if (!calendarRef.value) {
    return
  }
  calendarApi = calendarRef.value.getApi()

  // TODO Pinia
  eventApi.getEventCategories().then((response) => {
    categories.value = response.categories || []
    calendarApi.addEventSource((args: EventSourceFuncArg) => {
      return getEvents(args.start, args.end)
    })
  })

  window.addEventListener('resize', handleResizeWindow)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResizeWindow)
})

function getCategoryColor(categoryId: number) {
  for (const category of categories.value) {
    if (category.id === categoryId) {
      return category.color
    }
  }
}

async function getEvents(start: Date, end: Date) {
  const response = await eventApi.getEventList({ start, end })
  if (!response.events) {
    return []
  }
  return response.events.map((value) => {
    return {
      id: String(value.id),
      categoryId: value.categoryId,
      title: value.title,
      start: value.start,
      end: value.end,
      color: getCategoryColor(value.categoryId),
    }
  })
}

// Event
const modalVisible = ref(false)

const defaultEventForm = {
  id: 0,
  categoryId: 1,
  title: '',
  start: new Date(),
  end: new Date(),
}

const eventForm = reactive({
  ...defaultEventForm,
})

function saveEvent() {
  const event = _.clone(eventForm)
  eventApi.saveEvent({ event }).then((response) => {
    if (!event.id) {
      calendarApi.addEvent({
        ...event,
        id: String(response.id),
        color: getCategoryColor(event.categoryId),
      }, true)
    } else {
      const calEvent = calendarApi.getEventById(String(event.id))
      calEvent?.setProp('title', event.title)
      calEvent?.setProp('color', getCategoryColor(event.categoryId))
      calEvent?.setExtendedProp('categoryId', event.categoryId)
    }
    modalVisible.value = false
  })
}

function updateEventForm(event: CalendarEvent) {
  Object.assign(eventForm, {
    id: event.id,
    categoryId: event.extendedProps.categoryId,
    title: event.title,
    start: event.start!,
    end: event.end!,
  })
}

function handleDeleteEvent() {
  if (confirm('Are you sure?')) {
    const eventId = { id: eventForm.id }
    eventApi.deleteEvent({ eventId }).then(payload => {
      const event = calendarApi.getEventById(String(payload.id))
      event?.remove()
      modalVisible.value = false
    })
  }
}

let pingHandler: NodeJS.Timer

onMounted(() => {
  pingHandler = setInterval(() => {
    commonApi.ping().catch(() => {
      clearInterval(pingHandler)
      if (confirm('Ping error, reload?')) {
        location.reload()
      }
    })
  }, 30_000)
})

onUnmounted(() => {
  clearInterval(pingHandler)
})

const categoryDurations = ref<{
  title: string
  duration: string
}[]>([])

function updateCategoryDurations(events: CalendarEvent[]) {
  const durations: Record<string, number> = {}

  for (const event of events) {
    const start = dayjs(event.start)
    if (!start.isSame(dayjs(), 'day')) {
      continue
    }

    const end = dayjs(event.end)
    const minutes = end.diff(start, 'minutes')
    const key = String(event.extendedProps.categoryId)
    if (!(key in durations)) {
      durations[key] = 0
    }
    durations[key] += minutes
  }

  categoryDurations.value = categories.value.map((category) => {
    const key = String(category.id)
    let duration: string
    if (key in durations) {
      duration = (durations[key] / 60) + 'h'
    } else {
      duration = '-'
    }
    return {
      title: String(category.title),
      duration,
    }
  })
}
</script>

<template>
  <div>
    <div class="calendar">
      <FullCalendar :options="options" ref="calendarRef" />
    </div>

    <div class="note">
      <Note />

      <div style="margin-top: 10px;">
        <ul class="list-group">
          <li v-for="item in categoryDurations" :key="item.title" class="list-group-item d-flex justify-content-between align-items-center">
            {{ item.title }}
            <span>{{ item.duration }}</span>
          </li>
        </ul>
      </div>
    </div>

    <Modal v-model="modalVisible" :title="`${eventForm.id ? 'Edit' : 'New'} Event`">
      <form>
        <div class="row mb-3">
          <label class="col-sm-2 col-form-label">Category:</label>
          <div class="col-sm-10">
            <select class="form-select" v-model="eventForm.categoryId">
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.title }}
              </option>
            </select>
          </div>
        </div>
        <div class="mb-3">
          <textarea class="form-control" :rows="5" v-model="eventForm.title"></textarea>
        </div>
      </form>
      <template #footer>
        <button type="button" class="btn btn-secondary" @click="modalVisible = false">Close</button>
        <button v-if="eventForm.id" class="btn btn-danger" @click="handleDeleteEvent">Delete</button>
        <button type="button" class="btn btn-primary" @click="saveEvent">Save</button>
      </template>
    </Modal>
  </div>
</template>

<style>
.calendar {
  width: 1000px;
}

.calendar .fc-col-header-cell a {
  color: inherit;
  text-decoration: inherit;
}

.calendar .fc .fc-timegrid-slot {
  height: 30px;
}

.calendar .fc-timegrid-event {
  font-size: 12px;
  line-height: 100%;
}

.calendar .fc-v-event .fc-event-title {
  overflow: visible;
}

.note {
  position: absolute;
  left: 1024px;
  top: 10px;
}
</style>
