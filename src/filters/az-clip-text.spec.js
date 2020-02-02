import azClipText from './az-clip-text'

describe('azClipText', () => {
    it('Deve retornar valor delimitado com sufixo default', () => {
        const texto = 'bla bla bla bla bla bla'
        const resultado = azClipText(texto, 7)
        expect(resultado).toEqual('bla bla...')
    })

    it('Deve retornar valor sem ultrapassar limite', () => {
        const texto = 'bla'
        const resultado = azClipText(texto, 7)
        expect(resultado).toEqual('bla')
    })

    it('Deve retornar valor delimitado com sufixo passado por parametro', () => {
        const texto = 'bla bla bla bla bla bla'
        const sufixo = '............'
        const resultado = azClipText(texto, 7, sufixo)
        expect(resultado).toEqual('bla bla' + sufixo)
    })
})
