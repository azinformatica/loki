<template>
    <div>
        <slot name="default" :hasAuthority="hasAuthority" :processInstance="processInstance"> </slot>
    </div>
</template>

<script>
import { actionTypes } from "../../store"
import bpmConstants from "./bpm-constants"

export default {
    name: 'AzBpmInteraction',
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
			return this.$store.state.loki.user
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
		userAuthoritiesPresentInProps() {
			return this.userAuthoritiesWithAccess.filter((authority) => this.isAuthorityPresentInProps(authority.name))
		},
		currentTask() {
			return (this.processInstance && this.processInstance.currentTask) || {}
		},
		nextTasks() {
			return (this.processInstance && this.processInstance.nextTasks) || []
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
			return (this.processInstance && this.processInstance.statusInstance) || bpmConstants.STATUS_INSTANCE.ENDED
		},
		assignee() {
			return this.currentTask.assignee || null
		},
		tasksOptions() {
			return this.nextTasks.map(task => ({
				text: task.taskName,
				value: task.taskId,

			}))
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
		hasSomeAuthorityPresentInProps() {
			return this.userAuthoritiesPresentInProps.length > 0
		},
        hasSomeRevokedAuthority() {
            return this.userAuthoritiesPresentInProps.some((authority) => this.isAuthorityRevoked(authority.name))
        },
		hasAuthorityToBpmRule() {
			return !this.isStatusInstanceEnded && !this.isStatusInstanceActiveWithoutAssignee && this.isUserCandidate
		},
        hasAuthorityToInteraction() {
            return !this.hasSomeRevokedAuthority && this.hasSomeAuthorityPresentInProps && this.hasAuthorityToBpmRule
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
