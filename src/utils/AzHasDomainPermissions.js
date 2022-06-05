function userHasDomainPermission(userDomainPermissions, requiredPermission, domainId) {
    let hasPermission = false
    for (let i = 0; i < userDomainPermissions.length && !hasPermission; i++) {
        const userDomainPermission = userDomainPermissions[i]
        if (
            userDomainPermission.domainName === requiredPermission &&
            userDomainPermission.domainId.indexOf(domainId) >= 0
        ) {
            hasPermission = true
            break
        }
    }
    return hasPermission
}

function needsPermission(requiredPermissions) {
    return requiredPermissions.length > 0
}

function hasAccess(userDomainPermissions, requiredPermissions, domainId) {
    if (!needsPermission(requiredPermissions)) {
        return true
    }
    let hasPermission = false
    for (let i = 0; i < requiredPermissions.length && !hasPermission; i++) {
        const requiredPermission = requiredPermissions[i]
        if (userHasDomainPermission(userDomainPermissions, requiredPermission, domainId)) {
            hasPermission = true
            break
        }
    }
    return hasPermission
}

export default function (userDomainPermissions, requiredPermissions, domainId) {
    return hasAccess(userDomainPermissions, requiredPermissions, domainId)
}
