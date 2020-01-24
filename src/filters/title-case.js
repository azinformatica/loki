const filter = str => {
    if (!str) {
        return ''
    }
    const strLowerCase = str.toLowerCase()
    return strLowerCase[0].toUpperCase() + strLowerCase.substr(1, str.length)
}

export default filter
