import azDate from './az-date'

describe('azDate', () => {

    it('Deve retornar valor "-"', () => {
        const resultado = azDate()
        expect(resultado).toEqual('-')
    })

    it('Deve retornar data formatada com formato default', () => {
        const resultado = azDate('2018-01-01')
        expect(resultado).toEqual('01/01/2018')
    })

    it('Deve retornar data formatada com formatado passado por parâmetro', () => {
        const resultado = azDate('2018-01-01', 'YYYY/MM/DD')
        expect(resultado).toEqual('2018/01/01')
    })
})
