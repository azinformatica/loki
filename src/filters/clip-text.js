const filter = (text, length, suffix = '...') => {
    return text.length > length ? text.substring(0, length) + suffix : text
}

export default filter
