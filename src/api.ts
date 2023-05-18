import {
  Middleware,
  ResponseContext,
  Configuration,
  CommonApi,
  UserApi,
  EventApi,
  NoteApi,
} from '@/openapi'
import { routerHolder } from '@/utils'

class UnauthorizedMiddleware implements Middleware {
  async post(context: ResponseContext) {
    const { response } = context

    if (response.status === 400) {
      const payload = await response.json()
      if (payload.code === 400) {
        alert(payload.message)
      }
      return
    }

    if (response.status === 401) {
      routerHolder.router!.push('/login')
      return
    }
  }
}

const conf = new Configuration({
  basePath: '',
  middleware: [new UnauthorizedMiddleware()],
})

export const commonApi = new CommonApi(conf)
export const userApi = new UserApi(conf)
export const eventApi = new EventApi(conf)
export const noteApi = new NoteApi(conf)
