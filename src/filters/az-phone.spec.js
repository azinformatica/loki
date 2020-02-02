import azPhone from './az-phone'

describe('azPhone', () => {
    it('Deve retornar valor "Não informado"', () => {
        const resultado = azPhone()
        expect(resultado).toEqual('Não informado')
    })

    it('Deve retornar valor telefone com menos de 11 caracteres formatado', () => {
        const resultado = azPhone('6781616161')
        expect(resultado).toEqual('(67) 8161-6161')
    })

    it('Deve retornar valor telefone com mais de 10 caracteres formatado', () => {
        const resultado = azPhone('67981616161')
        expect(resultado).toEqual('(67) 98161-6161')
    })
})
