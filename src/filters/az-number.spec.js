import azNumber from './az-number'

describe('azNumber', () => {
    it('Deve retornar valor formatado', () => {
        const resultado = azNumber(239045.99)
        expect(resultado).toEqual('239.046')
    })

    it('Deve retornar valor vazio', () => {
        const resultado = azNumber()
        expect(resultado).toEqual('')
    })
})
