<template>
    <div>
        <slot name="default" :hasAuthority="hasAuthority" :processInstance="processInstance"> </slot>
    </div>
</template>

<script>
import _ from 'lodash'
import { actionTypes } from '../../store'

export default {
    name: 'AzInteraction',
    props: {
        id: {
            type: String,
            required: true,
        },
        authorities: {
            default: () => [],
            type: Array,
        },
        businessKey: {
            type: String,
            required: true,
        },
        processKey: {
            type: String,
            required: true,
        },
        disabled: {
            default: false,
            type: Boolean,
        },
    },
    data() {
        return {
            processInstance: null,
        }
    },
    methods: {
        isAuthorityRevoked(authorityName) {
            return this.revokedAuthorities.length && this.revokedAuthorities.includes(authorityName)
        },
        isAuthorityPresentInProps(authorityName) {
            return !this.authorities.length || this.authorities.includes(authorityName)
        },
        getProcessInstance(processKey, businessKey) {
            return this.$store.dispatch(actionTypes.BPM.PROCESS_INSTANCE, {
                processKey,
                businessKey,
            })
        },
    },
    computed: {
        user() {
            return _.get(this.$store, 'state.loki.user', {})
        },
        userAuthorities() {
            return this.user.authorities || []
        },
        userAuthoritiesWithAccess() {
            return this.userAuthorities.filter((authority) => authority.hasAccess)
        },
        revokedAuthorities() {
            return _.get(this.processInstance, 'currentTask.revokedPermissions', '')
                .replaceAll(/\s+/g, '')
                .split(',')
                .filter(Boolean)
        },
        hasSomeRevokedAuthority() {
            return this.userAuthoritiesWithAccess.some((authority) => this.isAuthorityRevoked(authority.name))
        },
        hasSomeAuthorityPresentInProps() {
            return this.userAuthoritiesWithAccess.some((authority) => this.isAuthorityPresentInProps(authority.name))
        },
        hasAuthorityToInteraction() {
            return !this.hasSomeRevokedAuthority && this.hasSomeAuthorityPresentInProps
        },
        hasAuthority() {
            return !this.disabled && this.hasAuthorityToInteraction
        },
    },
    mounted() {
        this.getProcessInstance(this.processKey, this.businessKey).then((processInstance) => {
            this.processInstance = processInstance
        })
    },
}
</script>

<style scoped></style>
