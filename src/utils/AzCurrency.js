import accounting from 'accounting'

export default class AzCurrency {

    static formatarMoeda(valor, precision) {
        return accounting.formatNumber(valor, precision, '.', ',')
    }

    static formatarNumero(valor) {
        return accounting.formatNumber(valor, '.', '.')
    }
}
