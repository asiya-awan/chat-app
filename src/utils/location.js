const generateLocation = (url, username) => {
    return {
        url,
        username,
        // createdAt: `${moment().get('hour')}:${moment().get('minute')}:${moment().get('second')}`
        createdAt: new Date().getTime()
    }
}

module.exports = {generateLocation}