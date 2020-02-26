import azElapsedTime from './elapsed-time'

describe('azElapsedTime', () => {
    it('Must return empty string', () => {
        const resultado = azElapsedTime()
        expect(resultado).toEqual('')
    })

    it('Time should return in seconds', () => {
        const resultado = azElapsedTime(new Date())
        expect(resultado).toEqual('0 seg.')
    })
})