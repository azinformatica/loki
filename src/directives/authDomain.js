import hasDomainPermissions from '../utils/AzHasDomainPermissions'

export default {
    inserted(el, { value }, vnode) {
        const userDomainPermissions = vnode.context.$store.state.loki.user.domains
        const requiredPermissions = value && value.permissions ? value.permissions.split(',') : []

        if (!hasDomainPermissions(userDomainPermissions, requiredPermissions, value.domainId)) {
            el.parentNode.removeChild(el)
        }
    },
}
