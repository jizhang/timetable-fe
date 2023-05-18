import { MockMethod } from 'vite-plugin-mock'

function login() {
  return {
    id: 1,
    username: 'test',
  }
}

export default [
  {
    url: '/api/user/login',
    response: login,
  },
] as MockMethod[]
