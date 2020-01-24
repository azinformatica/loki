import azCurrency from '../utils/AzCurrency'

const filter = (value, precision = 2) => {
    if (!value) {
        let decimalZerado = ''
        for (let i = 0; i < precision; i++) {
            decimalZerado += '0'
        }
        return `R$ 0,${decimalZerado}`
    }
    const formatedValue = azCurrency.formatarMoeda(value, precision)
    // TODO tratar localização e idioma da moerda (sugestão i18n)
    return `R$ ${formatedValue}`
}

export default filter
