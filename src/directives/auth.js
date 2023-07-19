import hasPermissions from '../utils/AzHasPermissions'

export default {
    inserted(el, { value }, vnode) {
        const userPermissions = vnode.context.$store.state.loki.user.authorities
        const requiredPermissions = value ? value.split(',') : []

        if (!hasPermissions(userPermissions, requiredPermissions)) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el)
            }
        }
    }
}
