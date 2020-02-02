import azSearchUrlBuilder from './AzSearchUrlBuilder'

describe('AzSearchUrlBuilder.spec.js', () => {
    let pathUrl, filters, pagination

    beforeEach(function() {
        pathUrl = '/pregao'
        filters = {
            filtroInvalido: {},
            status: { value: 'ABERTO' },
            responsavel: { value: 'SAD' },
            edital: { value: '0001/2018' }
        }
        pagination = {
            page: 1,
            rowsPerPage: 10,
            sortBy: 'dataAbertura',
            descending: false
        }
    })

    it('Deve retornar a url SEM path SEM filtros, SEM paginação e SEM ordenação', () => {
        pathUrl = undefined
        filters = undefined
        pagination = undefined
        expect(azSearchUrlBuilder.build(pathUrl, filters, pagination)).toMatch('')
    })

    it('Deve retornar a url construída SEM filtros, SEM paginação e SEM ordenação', () => {
        filters = undefined
        pagination = undefined
        expect(azSearchUrlBuilder.build(pathUrl, filters, pagination)).toMatch('/pregao')
    })

    it('Deve retornar a url construída com os filtros SEM paginação e SEM ordenação', () => {
        pagination = undefined
        expect(azSearchUrlBuilder.build(pathUrl, filters)).toMatch(
            '/pregao?status=ABERTO&responsavel=SAD&edital=0001/2018'
        )
    })

    it('Deve retornar a url construída SEM filtros, com paginação e ordenação CRESCENTE', () => {
        filters = undefined
        expect(azSearchUrlBuilder.build(pathUrl, filters, pagination)).toMatch(
            '/pregao?page=1&size=10&sort=dataAbertura&direction=ASC'
        )
    })

    it('Deve retornar a url construída com os filtros, paginação e ordenação CRESCENTE', () => {
        expect(azSearchUrlBuilder.build(pathUrl, filters, pagination)).toMatch(
            '/pregao?status=ABERTO&responsavel=SAD&edital=0001/2018&page=1&size=10&sort=dataAbertura&direction=ASC'
        )
    })

    it('Deve retornar a url construída com os filtros, paginação e ordenação DECRESCENTE', () => {
        pagination.descending = true
        expect(azSearchUrlBuilder.build(pathUrl, filters, pagination)).toMatch(
            '/pregao?status=ABERTO&responsavel=SAD&edital=0001/2018&page=1&size=10&sort=dataAbertura&direction=DESC'
        )
    })

    it('Deve retornar uma exceção descrevendo o atributo do filtro que o nome é igual ao atributo utilizado', () => {
        filters.page = 1
        let error = () => {
            azSearchUrlBuilder.build(pathUrl, filters, pagination)
        }

        expect(error).toThrowError('O atributo "page" é utilizado como parâmetro da paginação.')
    })
})
