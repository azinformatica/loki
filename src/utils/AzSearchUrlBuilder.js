class AzSearchUrlBuilder {

    build(urlPath = '', filters = {}, pagingAndSorting = {}) {

        const hasFilters = this._hasFilters(filters)
        const hasPagingAndSorting = this._hasPagingAndSorting(pagingAndSorting)

        if (hasFilters) {
            this._validateFilters(filters)
        }

        const paramFilters = this._buildFilters(filters)
        const paramPagingAndSorting = this._buildPagingAndSorting(pagingAndSorting, hasFilters)
        return `${urlPath}${hasFilters || hasPagingAndSorting ? '?' : ''}${paramFilters}${paramPagingAndSorting}`
    }

    _validateFilters(filters) {
        const pagingAndSortingKeys = ['page', 'size', 'sort', 'direction']

        for (const key of pagingAndSortingKeys) {
            if (filters.hasOwnProperty(key)) {
                throw new TypeError(`O atributo "${key}" é utilizado como parâmetro da paginação.`)
            }
        }
    }

    _hasFilters(filters) {
        let hasValidFilters = false
        for (const [key] of Object.entries(filters)) {
            if (filters[key].value) {
                hasValidFilters = true
                break
            }
        }
        return hasValidFilters
    }

    _hasPagingAndSorting(pagingAndSorting) {
        return Object.keys(pagingAndSorting).length > 0
    }

    _buildFilters(filters) {
        const param = []

        for (const [key] of Object.entries(filters)) {
            if (filters[key].value) {
                param.push(`${key}=${filters[key].value}`)
            }
        }
        return param.join('&')
    }

    _buildPagingAndSorting(pagingAndSorting, hasFilters) {
        let param = ''

        if (pagingAndSorting.page) {
            param += `&page=${pagingAndSorting.page}`
        }

        if (pagingAndSorting.rowsPerPage) {
            param += `&size=${pagingAndSorting.rowsPerPage}`
        }

        if (pagingAndSorting.sortBy) {
            param += `&sort=${pagingAndSorting.sortBy}`
            param += `&direction=${!pagingAndSorting.descending ? 'ASC' : 'DESC'}`
        }

        if (!hasFilters) {
            param = param.length > 0 ? param.substr(1) : param
        }

        return param
    }
}

export default new AzSearchUrlBuilder()
