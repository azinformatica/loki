const filter = (value, separator = '/') => {
    if (!value || value.length === 0) {
        return ''
    }
    return value.join(separator)
}

export default filter
