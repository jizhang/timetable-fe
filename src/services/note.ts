import { get, post } from '@/common/request'

interface Note {
  content: string
  created: string
}

interface NoteForm {
  content: string
}

export async function getNote(): Promise<NoteForm> {
  return get('/api/note/content')
}

export async function saveNote(form: NoteForm): Promise<Note> {
  return post('/api/note/save', form)
}
