import { post } from '@/common/request'

interface LoginForm {
  username: string
  password: string
}

interface User {
  id: number
  username: string
}

export async function login(form: LoginForm): Promise<User> {
  return post('/api/user/login', form)
}
