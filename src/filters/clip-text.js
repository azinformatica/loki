const filter = (text, length, suffix = '...') => {
    if (!text) {
        retun ''
    }
    return text.length > length ? text.substring(0, length) + suffix : text
}

export default filter
