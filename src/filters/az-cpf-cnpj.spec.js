import azCpfCnpj from './az-cpf-cnpj'

describe('azCpfCnpj', () => {
    it('Deve retornar valor "Não informado"', () => {
        const resultado = azCpfCnpj()
        expect(resultado).toEqual('Não informado')
    })

    it('Deve retornar valor cpf formatado', () => {
        const resultado = azCpfCnpj('56454528600')
        expect(resultado).toEqual('564.545.286-00')
    })

    it('Deve retornar valor cnpj formatado', () => {
        const resultado = azCpfCnpj('38878062000173')
        expect(resultado).toEqual('38.878.062/0001-73')
    })
})
