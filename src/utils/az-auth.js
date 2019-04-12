function userHasPermission(userPermissions, requiredPermission) {
    let hasPermission = false
    for (let i = 0; i < userPermissions.length && !hasPermission; i++) {
        const userPermission = userPermissions[i]
        if (userPermission.name === requiredPermission && userPermission.hasAccess) {
            hasPermission = true
        }
    }
    return hasPermission
}

function needsPermission(requiredPermissions) {
    return requiredPermissions.length > 0
}

function hasAccess(userPermissions, requiredPermissions) {
    if (!needsPermission(requiredPermissions)) {
        return true
    }
    let hasPermission = false
    for (let i = 0; i < requiredPermissions.length && !hasPermission; i++) {
        const requiredPermission = requiredPermissions[i]
        hasPermission = userHasPermission(userPermissions, requiredPermission)
    }
    return hasPermission
}

export default function (userPermissions, requiredPermissions) {
    return hasAccess(userPermissions, requiredPermissions)
}