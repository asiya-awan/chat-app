const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port =  process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', () => {
    console.log('New connection ')
})

// app.get('/', (req, res) => {
//     res.render('index', {
//         title: 'Home page',
//         name: 'Asia Awan'
//     })
// })


server.listen(port, () =>{
    console.log(`Server is listening on port: `, port)
})