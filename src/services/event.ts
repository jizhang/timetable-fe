import { get, post } from '@/common/request'

export interface Category {
  id: number
  title: string
  color: string
}

export async function getCategories(): Promise<{ categories: Category[] }> {
  return get('/api/event/categories')
}

export interface Event {
  id?: number
  categoryId: number
  title: string
  start: string
  end: string
}

export async function getEvents(start: Date, end: Date): Promise<{ events: Event[] }> {
  return get('/api/event/list', { start, end })
}

export async function saveEvent(event: Event): Promise<{ id: number }> {
  return post('/api/event/save', event)
}

export async function deleteEvent(id: number): Promise<{ id: number }> {
  return post('/api/event/delete', { id })
}
