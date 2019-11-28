const users = []

const addUser = ({id, username, room}) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
      return  user.username === username && user.room === room
    })

    //validate username
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }

    // Stor user
    const user = {id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index!== -1)  {
        // console.log(users.splice(index, 1)[0])
         return  users.splice(index, 1)[0]
    }
}


const getUser = (id) => users.find((user) => user.id === id)

const getUsersInRoom = (room) =>  {
    room = room.trim().toLowerCase()
   return users.filter((user) => user.room === room)
} 

// addUser({
//     id:32,
//     username:' Shazi',
//     room: 'south Piley'
// })
//   addUser({
//         id:33,
//         username:' Nazi',
//         room: 'south Piley'
//     })
//     addUser({
//         id:34,
//         username:' Safi',
//         room: 'north Piley'
//     })

//removeUser(32)
//     console.log(res)

// const user32 = getUser(32)
// //console.log(user32)

// const roomUsers = getUsersInRoom('south Piley')
// console.log(roomUsers)

module.exports = {addUser, removeUser, getUser, getUsersInRoom}