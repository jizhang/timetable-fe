import _ from 'lodash'
import qs from 'qs'
import { routerHolder } from '@/common/utils'
import { showAlert } from './alert'

class RequestError {
  constructor(public code: number, public payload: null | string | object) {}
}

export async function request(url: string, config?: RequestInit) {
  let response: Response

  // fetch error
  try {
    response = await fetch(import.meta.env.BASE_URL + url, config)
  } catch (error) {
    showAlert(String(error))
    throw new RequestError(0, {
      message: String(error),
      error,
    })
  }

  // success
  if (response.ok) {
    return await response.json()
  }

  // 400 Bad Request
  if (response.status === 400) {
    const payload = await response.json()
    // global toast
    if (payload.code === 400) {
      showAlert(payload.message)
    }
    // raise error for downstream processing
    throw new RequestError(payload.code, payload)
  }

  // 401 Unauthorized
  if (response.status === 401) {
    routerHolder.router?.push('/login')
    throw new RequestError(401, null)
  }

  // other error
  showAlert(`${response.status} ${response.statusText}`)
  throw new RequestError(response.status, response.statusText)
}

export async function get(url: string, args?: object) {
  if (!_.isEmpty(args)) {
    url += '?' + qs.stringify(args)
  }
  return request(url)
}

export async function post(url: string, json?: object) {
  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  if (!_.isEmpty(json)) {
    config.body = JSON.stringify(json)
  }
  return request(url, config)
}
