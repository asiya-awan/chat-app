const generateMessage = (text, username) => {
    return {   
        text,
        username,
        // createdAt: `${moment().get('hour')}:${moment().get('minute')}:${moment().get('second')}`
        createdAt: new Date().getTime()
    }
}

module.exports = {generateMessage}