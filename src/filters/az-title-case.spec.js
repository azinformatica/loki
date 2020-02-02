import azTitleCase from './az-title-case'

describe('azTitleCase', () => {
    it('Deve retornar string vazia', () => {
        const resultado = azTitleCase()
        expect(resultado).toEqual('')
    })

    it('Deve retornar valor com primeira letra maiúscula', () => {
        const resultado = azTitleCase('valor')
        expect(resultado).toEqual('Valor')
    })
})
