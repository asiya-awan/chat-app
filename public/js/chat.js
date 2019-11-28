const socket = io()

//Elements
const $messageForm = document.getElementById('message-form');
const $messageFormBtn = document.getElementById('sendMessage');
const $sendLocationBtn = document.getElementById('sendLocation');
const $messageFormInput = document.getElementById('message');
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible Height
    const visibleHeight = $messages.offsetHeight

    //Height of messages contianer
    const containerHeight = $messages.scrollHeight

    //How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight
    console.log(`newMessageOffsetHeight:${$newMessage.offsetHeight}, newMessageMargin: ${newMessageMargin}, newMessageHeight: ${newMessageHeight} `);
    console.log(`continerHeight: ${containerHeight}, visibleHeight: ${visibleHeight}, messages.scrollTop: ${$messages.scrollTop}`)
    if((containerHeight - newMessageHeight) <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    //const user = getUser(socket.id)
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message:message.text,
        username:message.username,
        createdAt: moment(message.createdAt).format('h:mm a')  //moment.format()
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (location) => {
    
    const html = Mustache.render(locationTemplate, {
        url: location.url,
        username:location.username,
        createdAt: moment(location.createdAt).format('h:mm a') 

    })
    console.log(location.username)
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({room, users}) => {
    //const user = getUser(socket.id)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
        
    })
    $sidebar.innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
$messageFormBtn.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value;
    //const message = $messageFormInput

    socket.emit('sendMessage', message, (error) => {
        $messageFormBtn.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error) {
          return  console.log(error)
        }
        console.log('Message delivered.')
    })
})

$sendLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by this browser.");
    } 
    $sendLocationBtn.setAttribute('disabled','disabled')
 
     navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
             latitude: position.coords.latitude,
             longitude: position.coords.longitude
         }, () => {
            $sendLocationBtn.removeAttribute('disabled')
            console.log('Location shared!')
         });  
    })

    
})

socket.emit('join', {username, room}, (error) => {
    
    if(error) {
      alert(error)
      location.href='/'
    }
})

// COUNT
// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated',count)
// })


// document.getElementById('increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')

// })