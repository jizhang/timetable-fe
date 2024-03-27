const sendJson = require('send-data/json')
const dayjs = require('dayjs')

function getNoteContent(req, res) {
  sendJson(req, res, {
    content: 'test',
  })
}

function saveNote(req, res) {
  sendJson(req, res, {
    content: 'test',
    created: dayjs().toISOString(),
  })
}

module.exports = {
  'GET /api/note/content': getNoteContent,
  'POST /api/note/save': saveNote,
}
