import azConcat from './az-concat'

const valor = ['ME', 'EPP', 'MEI', 'EIRELI']

describe('azConcat', () => {
    it('Deve retornar o valor concatenado', () => {
        const resultado = azConcat(valor)
        expect(resultado).toEqual('ME/EPP/MEI/EIRELI')
    })

    it('Deve retornar o valor concatenado com outro separador', () => {
        const resultado = azConcat(valor, ' - ')
        expect(resultado).toEqual('ME - EPP - MEI - EIRELI')
    })

    it('Deve retornar o valor vazio', () => {
        const resultado = azConcat()
        expect(resultado).toBe('')
    })
})
