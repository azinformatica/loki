import filtroCurrency from './currency'

describe('currency.spec.js', () => {
    it('Deve retornar valor formatado', () => {
        const resultado = filtroCurrency(1267.9)
        expect(resultado).toEqual('R$ 1.267,90')
    })

    it('Deve retornar valor ZERO', () => {
        const resultado = filtroCurrency()
        expect(resultado).toEqual('R$ 0,00')
    })
})
