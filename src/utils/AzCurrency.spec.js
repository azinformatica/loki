import azCurrency from './AzCurrency'

describe('AzCurrency.spec.js', () => {
    it('Deve retornar um valor no formato da moeda brasileira', () => {
        const valor = 4999.99
        expect(azCurrency.formatarMoeda(valor, 2)).toBe('4.999,99')
    })

    it('Deve retornar um valor no formato de quantidade', () => {
        const valor = 123456789
        expect(azCurrency.formatarNumero(valor)).toBe('123.456.789')
    })
})
