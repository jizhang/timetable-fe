const sendJson = require('send-data/json')

function login(req, res) {
  sendJson(req, res, {
    statusCode: 200,
    body: {
      id: 1,
      username: 'test',
    },
  })
}

module.exports = {
  'POST /api/user/login': login,
}
