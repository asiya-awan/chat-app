const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')
const { generateLocation } = require('./utils/location')
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const ioo = socketio(server)

const port =  process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

ioo.on('connection', (socket) => {
    console.log('New connection ')

    // socket.emit('locationMessage', locationMessage)
    
    socket.on('join', (options, callback) => {
        const {error, user } = addUser({ id: socket.id, ...options})

        if(error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage('Welcome', 'Admin'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`, 'Admin'))     //send message to every connection except of itself(leaving, joining)

        ioo.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        //(Socket) socket.emit, io.emit, socket.braodcast.emit
        //(Rooms) - io.to.emit  (emit event to * in a room)  , socket.braodcast.to.emit  (limit to chatroom)
        callback()
    })

    socket.on('sendMessage', (message, callback) => {

        const user = getUser(socket.id)
        const filter = new Filter();

        if(filter.isProfane(message) ){
            return callback('Profanity is not allowed')
        }

        ioo.to(user.room).emit('message', generateMessage(message, user.username))
        callback('Delivered!')  //event acknowledgement setup

    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        ioo.to(user.room).emit('locationMessage', generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`, user.username))
        callback('Location Message Shared!')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            ioo.to(user.room).emit('message', generateMessage(`${user.username} has left`, 'Admin'))    //send message to every connection except of itself(leaving, joining)
            ioo.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })

    
   
})

server.listen(port, () =>{
    console.log(`Server is listening on port: `, port)
})


//let count = 0
// ioo.on('connection', (socket) => {
//     console.log('New connection ')

//     // socket.emit('countUpdated', count)  //emit an event to the socket
//     // socket.on('increment', () => {
//     //     count++
//     //     //socket.emit('countUpdated', count) //emit event to specific connection
//     //     ioo.emit('countUpdated', count) //emit event to all connection

//     // })
// })
