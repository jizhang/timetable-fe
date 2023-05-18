import {
  Middleware,
  ResponseContext,
  Configuration,
  CommonApi,
  UserApi,
  EventApi,
  NoteApi,
} from '@/openapi'
import router from '@/router'

class UnauthorizedMiddleware implements Middleware {
  async post(context: ResponseContext) {
    if (context.response.status === 401) {
      router.push('/login')
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
