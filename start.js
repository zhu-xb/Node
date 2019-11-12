'use strict'

const StaticServer = require('./http.js')
let server = new StaticServer()

server.run({
	port: 3000,
	host: '127.0.0.1',
	filePath: 'project',
	homePage: 'index.html'
})

// server.close()