import azEnum from './az-enum'
const texto = {
    EM_ELABORACAO: 'Em Elaboração',
    ABERTA: 'Aberta',
}

describe('azEnum', () => {
    it('Deve retornar o valor correspondente ao enum referente ao nome em elaboração', () => {
        const resultado = azEnum('EM_ELABORACAO', texto)
        expect(resultado).toEqual('Em Elaboração')
    })

    it('Deve retornar o valor correspondente ao enum referente ao nome aberta', () => {
        const resultado = azEnum('ABERTA', texto)
        expect(resultado).toEqual('Aberta')
    })

    it('Deve retornar o valor vazio ao nome novo texto', () => {
        const resultado = azEnum('NOVO_TEXTO', texto)
        expect(resultado).toBeUndefined()
    })

    it('Deve retornar uma string vazia quando o valor ou o enumObject forem vazios', () => {
        const resultado1 = azEnum('', texto)
        const resultado2 = azEnum('Aberta')
        expect(resultado1).toEqual('')
        expect(resultado2).toEqual('')
    })
})
