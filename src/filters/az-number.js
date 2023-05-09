import azCurrency from '../utils/AzCurrency'

const filter = (value) => {
    if (!value && value !== 0) {
        return ''
    }
    return azCurrency.formatarNumero(value)
}

export default filter
