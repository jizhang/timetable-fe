<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import _ from 'lodash'
import dayjs from 'dayjs'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventApi as CalendarEvent, FormatterInput, CalendarOptions, CalendarApi } from '@fullcalendar/core'
import type { Event } from '@/services/event'
import { ping } from '@/services/common'
import useEventStore from '@/stores/event'
import EditForm from '@/components/event/EditForm.vue'
import Note from '@/components/Note.vue'
import Modal from '@/components/Modal.vue'

const DATE_FORMAT = 'YYYY-MM-DD'

const router = useRouter()
const route = useRoute()

let initialDate = dayjs().format(DATE_FORMAT)
if (route.query.start) {
  const dt = dayjs(String(route.query.start), DATE_FORMAT, true)
  if (dt.isValid()) {
    initialDate = dt.format(DATE_FORMAT)
  }
}

// Utilities
function calculateCalendarHeight() {
  return window.innerHeight - 50
}

function toISOString(date: Date | null) {
  return (date || new Date()).toISOString()
}

const timeFormat: FormatterInput = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}

// Calendar
const eventStore = useEventStore()

const eventConstraint = {
  startTime: '00:00',
  endTime: '24:00',
}

const options = computed<CalendarOptions>(() => {
  return {
    allDaySlot: false,
    editable: true,
    events: eventStore.calEvents,
    eventTimeFormat: timeFormat,
    eventConstraint,
    firstDay: 1,
    height: calculateCalendarHeight(),
    initialDate,
    nowIndicator: true,
    plugins: [timeGridPlugin, interactionPlugin],
    scrollTime: '08:00:00',
    selectable: true,
    selectOverlap: false,
    selectConstraint: eventConstraint,
    slotLabelFormat: timeFormat,

    datesSet({ start, end }) {
      eventStore.getEvents(start, end)
      router.replace({
        query: {
          start: dayjs(start).format(DATE_FORMAT),
        },
      })
    },

    select({ start, end }) {
      _.assign(currentEvent, {
        ...defaultEvent,
        start,
        end,
      })
      modalVisible.value = true
    },

    eventClick({ event }) {
      updateCurrentEvent(event)
      modalVisible.value = true
    },

    eventDrop({ event }) {
      updateCurrentEvent(event)
      saveEvent(currentEvent)
    },

    eventResize({ event }) {
      updateCurrentEvent(event)
      saveEvent(currentEvent)
    },
  }
})

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)
let calendarApi: CalendarApi

const handleResizeWindow = _.debounce(() => {
  calendarApi.setOption('height', calculateCalendarHeight())
}, 200)

onMounted(() => {
  if (calendarRef.value) {
    calendarApi = calendarRef.value.getApi()
  }
  window.addEventListener('resize', handleResizeWindow)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResizeWindow)
})

// Event
const modalVisible = ref(false)

const defaultEvent: Event = {
  id: undefined,
  categoryId: 1,
  title: '',
  start: toISOString(null),
  end: toISOString(null),
}
const currentEvent = reactive({ ...defaultEvent })

function saveEvent(event: Event) {
  eventStore.saveEvent(event).then(() => {
    modalVisible.value = false
  })
}

function updateCurrentEvent(event: CalendarEvent) {
  const input: Event = {
    id: _.toInteger(event.id),
    categoryId: event.extendedProps.categoryId,
    title: event.title,
    start: toISOString(event.start),
    end: toISOString(event.end),
  }
  _.assign(currentEvent, input)
}

function deleteEvent(id: number) {
  eventStore.deleteEvent(id).then(() => {
    modalVisible.value = false
  })
}

// Ping
const pingModalVisible = ref(false)
let pingHandler: NodeJS.Timeout

function reload() {
  location.reload()
}

onMounted(() => {
  pingHandler = setInterval(() => {
    ping().catch(() => {
      clearInterval(pingHandler)
      pingModalVisible.value = true
    })
  }, 30_000)
})

onUnmounted(() => {
  clearInterval(pingHandler)
})
</script>

<template>
  <div class="d-flex my-3">
    <div class="calendar mx-3">
      <FullCalendar
        ref="calendarRef"
        :options="options"
      />
    </div>

    <div class="note pe-3">
      <Note />

      <div class="mt-3">
        <ul class="list-group">
          <li
            v-for="item in eventStore.categoryDurations"
            :key="item.title"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            {{ item.title }}
            <span>{{ item.duration }}</span>
          </li>
        </ul>
      </div>
    </div>

    <EditForm
      v-model="modalVisible"
      :event="currentEvent"
      @save="saveEvent"
      @delete="deleteEvent"
    />

    <Modal
      v-model="pingModalVisible"
      title="Timetable"
    >
      Ping error, reload?

      <template #footer>
        <button
          type="button"
          class="btn"
          @click="pingModalVisible = false"
        >
          Close
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="reload()"
        >
          OK
        </button>
      </template>
    </Modal>
  </div>
</template>

<style lang="scss">
.calendar {
  flex: 0 0 1000px;

  .fc-col-header-cell {
    a {
      color: inherit;
      text-decoration: inherit;
    }
  }

  .fc {
    .fc-timegrid-slot {
      height: 30px;
    }
  }

  .fc-timegrid-event {
    font-size: 12px;
    line-height: 100%;
  }

  .fc-v-event {
    .fc-event-title {
      overflow: visible;
    }
  }
}

.note {
  flex: 0 0 250px;
}
</style>
