import concatFiltro from './concat'

const valor = ['ME', 'EPP', 'MEI', 'EIRELI']

describe('concat.spec.js', () => {
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
