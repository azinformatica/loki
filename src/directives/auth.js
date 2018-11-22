const userHasPermission = (userPermissions, requiredPermission) => {
    let hasPermission = false
    for (let i = 0; i < userPermissions.length && !hasPermission; i++) {
        const userPermission = userPermissions[i]
        if (userPermission.name === requiredPermission && userPermission.hasAccess) {
            hasPermission = true
        }
    }
    return hasPermission
}

const hasAccess = (userPermissions, requiredPermissions) => {
    let hasPermission = false
    for (let i = 0; i < requiredPermissions.length && !hasPermission; i++) {
        const requiredPermission = requiredPermissions[i]
        hasPermission = userHasPermission(userPermissions, requiredPermission)
    }
    return hasPermission
}

export default {
    inserted(el, {value}, vnode) {
        const userPermissions = vnode.context.$store.state.loki.user.authorities
        const requiredPermissions = value.split(',')

        if (!hasAccess(userPermissions, requiredPermissions)) {
            el.parentNode.removeChild(el)
        }
    }
}
