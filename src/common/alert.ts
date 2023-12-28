import mitt from 'mitt'

type Events = {
  alert: string
}

export const emitter = mitt<Events>()

export function showAlert(message: string) {
  emitter.emit('alert', message)
}
