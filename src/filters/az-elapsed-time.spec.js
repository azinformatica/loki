import azElapsedTime from './az-elapsed-time'

describe('azElapsedTime', () => {
    it('Deve retornar string vazia', () => {
        const resultado = azElapsedTime()
        expect(resultado).toEqual('')
    })

    it('Deve retornar o tempo em segundos', () => {
        const resultado = azElapsedTime(new Date())
        expect(resultado).toEqual('0 seg.')
    })
})
