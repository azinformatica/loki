import hasPermissions from '../utils/az-auth'

export default {
    inserted(el, { value }, vnode) {
        const userPermissions = vnode.context.$store.state.loki.user.authorities
        const requiredPermissions = value ? value.split(',') : []

        if (!hasPermissions(userPermissions, requiredPermissions)) {
            el.parentNode.removeChild(el)
        }
    },
}
