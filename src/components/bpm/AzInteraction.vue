<template>
    <div>
        <slot name="default" :hasAuthority="hasAuthority" :processInstance="processInstance"> </slot>
    </div>
</template>

<script>
import _ from 'lodash'
import { actionTypes } from '../../store'
import bpmConstants from './bpm-constants'

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
            processInstance: null
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
		splitCommaSeparatedTextToArray(text) {
			return text
				.replaceAll(/\s+/g, '')
				.split(',')
				.filter(Boolean)
		}
    },
    computed: {
        user() {
            return _.get(this.$store, 'state.loki.user', {})
        },
        userAuthorities() {
            return this.user.authorities || []
        },
		userRoles() {
			return this.user.roles || []
		},
        userAuthoritiesWithAccess() {
            return this.userAuthorities.filter((authority) => authority.hasAccess)
        },
		currentTask() {
			return (this.processInstance && this.processInstance.currentTask) || {}
		},
        revokedAuthorities() {
			return this.splitCommaSeparatedTextToArray(this.currentTask.revokedPermissions || '')
        },
		candidateUsers() {
			return this.currentTask.candidateUsers || []
		},
		candidateGroups() {
			return this.currentTask.candidateGroups || []
		},
		statusInstance() {
			return this.processInstance.statusInstance || bpmConstants.STATUS_INSTANCE.ENDED
		},
		assignee() {
			return this.currentTask.assignee || null
		},
		isStatusInstanceEnded() {
			return this.statusInstance === bpmConstants.STATUS_INSTANCE.ENDED
		},
		isStatusInstanceActive() {
			return this.statusInstance === bpmConstants.STATUS_INSTANCE.ACTIVE
		},
		isUserInCandidateUsers() {
			return this.candidateUsers.includes(this.user.name)
		},
		isUserInCandidateGroups() {
			return this.userRoles.some(role => this.candidateGroups.includes(role))
		},
		isUserCandidate() {
			return this.isUserInCandidateUsers || this.isUserInCandidateGroups
		},
		isStatusInstanceActiveWithoutAssignee() {
			return this.isStatusInstanceActive && !this.assignee
		},
        hasSomeRevokedAuthority() {
            return this.userAuthoritiesWithAccess.some((authority) => this.isAuthorityRevoked(authority.name))
        },
        hasSomeAuthorityPresentInProps() {
            return this.userAuthoritiesWithAccess.some((authority) => this.isAuthorityPresentInProps(authority.name))
        },
		hasAuthorityToBpmRule() {
			return !this.isStatusInstanceEnded && !this.isStatusInstanceActiveWithoutAssignee && this.isUserCandidate
		},
        hasAuthorityToInteraction() {
            return !this.hasSomeRevokedAuthority && this.hasAuthorityToBpmRule && this.hasSomeAuthorityPresentInProps
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
