<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import _ from 'lodash'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventApi as CalendarEvent, FormatterInput, CalendarOptions, CalendarApi } from '@fullcalendar/core'
import type { Event } from '@/openapi'
import { commonApi } from '@/common/api'
import useEventStore from '@/stores/event'
import EditForm from '@/components/event/EditForm.vue'
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
    nowIndicator: true,
    plugins: [timeGridPlugin, interactionPlugin],
    scrollTime: '08:00:00',
    selectable: true,
    selectOverlap: false,
    selectConstraint: eventConstraint,
    slotLabelFormat: timeFormat,

    datesSet({ start, end }) {
      eventStore.getEvents(start, end)
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

const defaultEvent = {
  id: undefined as number | undefined,
  categoryId: 1,
  title: '',
  start: new Date(),
  end: new Date(),
}
const currentEvent = reactive(_.clone(defaultEvent))

function saveEvent(event: Event) {
  eventStore.saveEvent(event).then(() => {
    modalVisible.value = false
  })
}

function updateCurrentEvent(event: CalendarEvent) {
  _.assign(currentEvent, {
    id: _.toInteger(event.id),
    categoryId: event.extendedProps.categoryId,
    title: event.title,
    start: event.start || new Date(),
    end: event.end || new Date(),
  } as Event)
}

function deleteEvent(id: number) {
  eventStore.deleteEvent(id).then(() => {
    modalVisible.value = false
  })
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
</script>

<template>
  <div>
    <div class="calendar">
      <FullCalendar
        ref="calendarRef"
        :options="options"
      />
    </div>

    <div class="note">
      <Note />

      <div style="margin-top: 10px;">
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
  </div>
</template>

<style lang="scss">
.calendar {
  width: 1000px;

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
  position: absolute;
  left: 1024px;
  top: 10px;
}
</style>
