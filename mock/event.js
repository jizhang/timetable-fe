const sendJson = require('send-data/json')
const dayjs = require('dayjs')

function randomInt() {
  return Math.floor(Math.random() * 1_000_000)
}

function getCategories(req, res) {
  const categories = [
    {'id': 1, 'title': 'Work', 'color': '#3a87ad'},
    {'id': 2, 'title': 'Meeting', 'color': 'gray'},
    {'id': 3, 'title': 'Self-achievement', 'color': '#ff9c29'},
    {'id': 4, 'title': 'Goofing-around', 'color': 'black'},
  ]

  sendJson(req, res, { categories })
}

function getEvenList(req, res) {
  const now = dayjs()
  const events = [
    {
      id: 1,
      categoryId: 1,
      title: 'abcdefghijklm',
      start: now.format('YYYY-MM-DD[T]09:00:00'),
      end: now.format('YYYY-MM-DD[T]10:00:00'),
    },
    {
      id: 2,
      categoryId: 2,
      title: 'nopqrstuvwxyz',
      start: now.format('YYYY-MM-DD[T]10:30:00'),
      end: now.format('YYYY-MM-DD[T]11:00:00'),
    },
  ]

  sendJson(req, res, { events })
}

function saveEvent(req, res) {
  sendJson(req, res, {
    id: randomInt(),
  })
}

function deleteEvent(req, res) {
  const { id } = req.body
  sendJson(req, res, { id })
}

module.exports = {
  'GET /api/event/categories': getCategories,
  'GET /api/event/list': getEvenList,
  'POST /api/event/save': saveEvent,
  'POST /api/event/delete': deleteEvent,
}
