import filtroTelefone from './phone'

describe('FiltroTelefone', () => {
    it('Deve retornar valor "Não informado"', () => {
        const resultado = filtroTelefone()
        expect(resultado).toEqual('Não informado')
    })

    it('Deve retornar valor telefone com menos de 11 caracteres formatado', () => {
        const resultado = filtroTelefone('6781616161')
        expect(resultado).toEqual('(67) 8161-6161')
    })

    it('Deve retornar valor telefone com mais de 10 caracteres formatado', () => {
        const resultado = filtroTelefone('67981616161')
        expect(resultado).toEqual('(67) 98161-6161')
    })
})
