const filter = (text, length, suffix = '...') => {
    if (!text) {
        return ''
    }
    return text.length > length ? text.substring(0, length) + suffix : text
}

export default filter
