const filter = (value, enumObject) => {
    if (!value || !enumObject) {
        return ''
    }
    return enumObject[value]
}

export default filter
