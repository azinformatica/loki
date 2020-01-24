import filtroData from '../../src/filters/date'
import store from '../../src/store'

describe('FiltroData', () => {
    const stateOriginal = store.state

    beforeEach(() => {
        store.replaceState({
            loki: {
                timezone: 'America/Sao_Paulo'
            }
        })
    })

    afterEach(() => {
        store.replaceState(stateOriginal)
    })

    it('Deve retornar valor "-"', () => {
        const resultado = filtroData()
        expect(resultado).toEqual('-')
    })

    it('Deve retornar data formatada com formato default', () => {
        const resultado = filtroData('2018-01-01')
        expect(resultado).toEqual('01/01/2018')
    })

    it('Deve retornar data formatada com formatado passado por parâmetro', () => {
        const resultado = filtroData('2018-01-01', 'YYYY/MM/DD')
        expect(resultado).toEqual('2018/01/01')
    })
})
