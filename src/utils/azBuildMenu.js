import _ from 'lodash'

export default function menu(store, router) {
    const actions = []
    router.options.routes.forEach((route) => {
        if (shouldShowInMenu(store, route)) {
            let action = createAction(route)
            if (hasChildren(route)) {
                action.expanded = false
                action.children = createSubActions(store, route)
            }
            actions.push(action)
        }
    })
    return actions
}

function createAction(route) {
    return {
        name: route.meta.menu.title,
        icon: route.meta.menu.icon,
        path: route.path,
        selected: false,
    }
}

function createSubActions(store, route) {
    let subactions = []
    route.children.forEach((subRoute) => {
        if (shouldShowInMenu(store, subRoute)) {
            let child = createAction(subRoute)
            subactions.push(child)
        }
    })
    return subactions
}

function shouldShowInMenu(store, route) {
    return route.meta && route.meta.menu && hasAuthorities(store, route)
}

function hasChildren(route) {
    return route.children && route.children.length > 0
}

function hasAuthorities(store, route) {
    let allowed = true
    if (!_.isEmpty(route.meta.authorities)) {
        const userAuthorities = store.state.loki.user.authorities
        const expectedAuthorities = convertToAuthoritiesObject(route.meta.authorities, store.state.loki.product.id)
        allowed = isAllowed(userAuthorities, expectedAuthorities)
    }
    return allowed
}

function isAllowed(sourceAuthorities, expectedAuthorities) {
    let allowed = false
    _.forEach(sourceAuthorities, (authority) => {
        if (_.findIndex(expectedAuthorities, authority) > -1) {
            return (allowed = true)
        }
    })
    return allowed
}

function convertToAuthoritiesObject(authoritiesSimpleArray, productId) {
    let authoritiesObject = []
    _.forEach(authoritiesSimpleArray, (value) => {
        authoritiesObject.push({ name: value, hasAccess: true, produtoId: productId })
    })
    return authoritiesObject
}
