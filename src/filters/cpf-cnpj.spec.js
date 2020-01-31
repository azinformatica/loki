import filtroCpfCnpj from './cpf-cnpj'

describe('FiltroCpfCnpj', () => {
    it('Deve retornar valor "Não informado"', () => {
        const resultado = filtroCpfCnpj()
        expect(resultado).toEqual('Não informado')
    })

    it('Deve retornar valor cpf formatado', () => {
        const resultado = filtroCpfCnpj('56454528600')
        expect(resultado).toEqual('564.545.286-00')
    })

    it('Deve retornar valor cnpj formatado', () => {
        const resultado = filtroCpfCnpj('38878062000173')
        expect(resultado).toEqual('38.878.062/0001-73')
    })
})
