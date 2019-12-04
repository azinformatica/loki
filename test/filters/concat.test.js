import concatFiltro from '../../src/filters/concat'

const valor = ['ME', 'EPP', 'MEI', 'EIRELI']

describe('concatFiltro', () => {
    it('Deve retornar o valor concatenado', () => {
        const resultado = concatFiltro(valor)
        expect(resultado).toEqual('ME/EPP/MEI/EIRELI')
    })

    it('Deve retornar o valor concatenado com outro separador', () => {
        const resultado = concatFiltro(valor, ' - ')
        expect(resultado).toEqual('ME - EPP - MEI - EIRELI')
    })

    it('Deve retornar o valor vazio', () => {
        const resultado = concatFiltro()
        expect(resultado).toBe('')
    })
})