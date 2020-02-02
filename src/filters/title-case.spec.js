import filtroTitleCase from './title-case'

describe('title-case.spec.js', () => {
    it('Deve retornar string vazia', () => {
        const resultado = filtroTitleCase()
        expect(resultado).toEqual('')
    })

    it('Deve retornar valor com primeira letra maiúscula', () => {
        const resultado = filtroTitleCase('valor')
        expect(resultado).toEqual('Valor')
    })
})
