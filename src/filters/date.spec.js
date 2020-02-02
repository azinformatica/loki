import date from './date'

describe('date.spec.js', () => {
    it('Deve retornar valor "-"', () => {
        const resultado = date()
        expect(resultado).toEqual('-')
    })

    it('Deve retornar data formatada com formato default', () => {
        const resultado = date('2018-01-01 12:00:00')
        expect(resultado).toEqual('01/01/2018')
    })

    it('Deve retornar data formatada com formatado passado por parâmetro', () => {
        const resultado = date('2018-01-01 12:00:00', 'YYYY/MM/DD')
        expect(resultado).toEqual('2018/01/01')
    })
})
