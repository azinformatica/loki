import azCurrency from './az-currency'

describe('azCurrency', () => {
    it('Deve retornar valor formatado', () => {
        const resultado = azCurrency(1267.9)
        expect(resultado).toEqual('R$ 1.267,90')
    })

    it('Deve retornar valor ZERO', () => {
        const resultado = azCurrency()
        expect(resultado).toEqual('R$ 0,00')
    })
})
