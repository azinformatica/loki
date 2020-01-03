import azCurrency from '../utils/AzCurrency'

const filter = (value) => {
    if (!value) {
        return ''
    }
    return azCurrency.formatarNumero(value)
}

export default filter