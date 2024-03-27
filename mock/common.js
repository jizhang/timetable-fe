function ping(req, res) {
  // res.statusCode = 500
  res.setHeader('Content-Type', 'text/plain')
  res.end('pong')
}

module.exports = {
  'GET /api/ping': ping,
}
