const formatMessage = (username, text) => {
    const dateObj = new Date()
    return {
        username,
        text,
        time: dateObj.toGMTString()
    }
}

module.exports = formatMessage;