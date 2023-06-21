<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import _ from 'lodash'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventApi as CalendarEvent, FormatterInput, CalendarOptions, CalendarApi } from '@fullcalendar/core'
import { commonApi } from '@/common/api'
import useEventStore from '@/stores/event'
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
const eventStore = useEventStore()

const options = computed<CalendarOptions>(() => {
  return {
    allDaySlot: false,
    editable: true,
    events: eventStore.calEvents,
    eventTimeFormat: timeFormat,
    firstDay: 1,
    height: calculateCalendarHeight(),
    nowIndicator: true,
    plugins: [timeGridPlugin, interactionPlugin],
    scrollTime: '08:00:00',
    selectable: true,
    selectOverlap: false,
    slotLabelFormat: timeFormat,

    datesSet({ start, end }) {
      eventStore.getEvents(start, end)
    },

    select({ start, end }) {
      _.assign(eventForm, {
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

const defaultEventForm = {
  id: '',
  categoryId: '1',
  title: '',
  start: new Date(),
  end: new Date(),
}

const eventForm = reactive({
  ...defaultEventForm,
})

function saveEvent() {
  const event = {
    id: eventForm.id ? _.toInteger(eventForm.id) : undefined,
    categoryId: _.toInteger(eventForm.categoryId),
    title: eventForm.title,
    start: eventForm.start,
    end: eventForm.end,
  }
  eventStore.saveEvent(event).then(() => {
    modalVisible.value = false
  })
}

function updateEventForm(event: CalendarEvent) {
  _.assign(eventForm, {
    id: event.id,
    categoryId: String(event.extendedProps.categoryId),
    title: event.title,
    start: event.start || new Date(),
    end: event.end || new Date(),
  })
}

function handleDeleteEvent() {
  if (confirm('Are you sure?')) {
    eventStore.deleteEvent(_.toInteger(eventForm.id)).then(() => {
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

    <Modal
      v-model="modalVisible"
      :title="`${eventForm.id ? 'Edit' : 'New'} Event`"
    >
      <form>
        <div class="row mb-3">
          <label class="col-sm-2 col-form-label">Category:</label>
          <div class="col-sm-10">
            <select
              v-model="eventForm.categoryId"
              class="form-select"
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
            v-model="eventForm.title"
            class="form-control"
            :rows="5"
          />
        </div>
      </form>
      <template #footer>
        <button
          type="button"
          class="btn btn-secondary"
          @click="modalVisible = false"
        >
          Close
        </button>
        <button
          v-if="eventForm.id"
          class="btn btn-danger"
          @click="handleDeleteEvent"
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
