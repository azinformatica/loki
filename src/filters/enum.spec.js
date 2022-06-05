import enumFiltro from './enum'
const texto = {
    EM_ELABORACAO: 'Em Elaboração',
    ABERTA: 'Aberta',
}

describe('enum.spec.js', () => {
    it('Deve retornar o valor correspondente ao enum referente ao nome em elaboração', () => {
        const resultado = enumFiltro('EM_ELABORACAO', texto)
        expect(resultado).toEqual('Em Elaboração')
    })

    it('Deve retornar o valor correspondente ao enum referente ao nome aberta', () => {
        const resultado = enumFiltro('ABERTA', texto)
        expect(resultado).toEqual('Aberta')
    })

    it('Deve retornar o valor vazio ao nome novo texto', () => {
        const resultado = enumFiltro('NOVO_TEXTO', texto)
        expect(resultado).toBeUndefined()
    })

    it('Deve retornar uma string vazia quando o valor ou o enumObject forem vazios', () => {
        const resultado1 = enumFiltro('', texto)
        const resultado2 = enumFiltro('Aberta')
        expect(resultado1).toEqual('')
        expect(resultado2).toEqual('')
    })
})
