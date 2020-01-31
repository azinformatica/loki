import filtroNumero from './number'

describe('FiltroNumero', () => {
    it('Deve retornar valor formatado', () => {
        const resultado = filtroNumero(239045.99)
        expect(resultado).toEqual('239.046')
    })

    it('Deve retornar valor vazio', () => {
        const resultado = filtroNumero()
        expect(resultado).toEqual('')
    })
})
