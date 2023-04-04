<template>
	<div>
    	<slot
			name="default"
			:hasAuthority="hasAuthority"
			:components="components"
			:processInstance="processInstance"
		> </slot>
	</div>
</template>

<script>
import _ from "lodash"
import { actionTypes, mutationTypes } from "../../store"
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
    methods: {
        isAuthorityRevoked(authorityName) {
            return this.revokedAuthorities.length && this.revokedAuthorities.includes(authorityName)
        },
        isAuthorityPresentInProps(authorityName) {
            return !this.authorities.length || this.authorities.includes(authorityName)
        },
        getProcessInstance() {
            return this.$store.dispatch(actionTypes.BPM.GET_PROCESS_INSTANCE, this.processInstanceParams)
        },
		initializeProcessInstance() {
			return this.$store.commit(mutationTypes.BPM.INITIALIZE_PROCESS_INSTANCE, this.processInstanceParams)
		},
		dispatchBpmAction(actionType, { taskId, bpmParameter }) {
			return this.$store.dispatch(actionType, { taskId, bpmParameter })
		},
		dispatchBpmActionThenReloadProcessInstance(actionType, taskId, bpmParameter = {}) {
			return this.dispatchBpmAction(actionType, { taskId, bpmParameter }).then(() => this.getProcessInstance())
		},
		splitCommaSeparatedTextToArray(text) {
			return text
				.replaceAll(/\s+/g, '')
				.split(',')
				.filter(Boolean)
		}
    },
    computed: {
		processInstanceParams() {
			return {
				processKey: this.processKey,
				businessKey: this.businessKey
			}
		},
		bpm() {
			return this.$store.state.loki.bpm
		},
		bpmAtProcessKey() {
			return this.bpm[this.processKey] || {}
		},
		bpmAtProcessKeyAtBusinessKey() {
			return this.bpmAtProcessKey[this.businessKey] || {}
		},
		processInstance() {
			return this.bpmAtProcessKeyAtBusinessKey.processInstance || null
		},
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
		previousTask() {
			return (this.processInstance && this.processInstance.previousTask) || {}
		},
		nextTasks() {
			return (this.processInstance && this.processInstance.nextTasks) || []
		},
		hasNextTasks() {
			return this.nextTasks.length > 0
		},
		hasHumanDecisionInAllNextTasks() {
			return this.nextTasks.every(task => task.flowExpression && task.flowExpression.includes('humanDecision'))
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
		previousTaskCandidateGroups() {
			return this.previousTask.candidateGroups || []
		},
		previousTaskAssignee() {
			return this.previousTask.assignee || null
		},
		statusInstance() {
			return (this.processInstance && this.processInstance.statusInstance) || bpmConstants.STATUS_INSTANCE.ENDED
		},
		assignee() {
			return this.currentTask.assignee || null
		},
		components() {
			return {
				select: this.select,
				button: {
					[bpmConstants.BUTTON_TYPES.CLAIM]: this.buttonClaim,
					[bpmConstants.BUTTON_TYPES.UNCLAIM]: this.buttonUnclaim,
					[bpmConstants.BUTTON_TYPES.COMPLETE]: this.buttonComplete,
					[bpmConstants.BUTTON_TYPES.UNCOMPLETE]: this.buttonUncomplete
				}
			}
		},
		select() {
			return {
				show: this.selectShow,
				disabled: this.selectDisabled,
				items: this.selectItems
			}
		},
		buttonClaim() {
			return {
				show: this.buttonClaimShow,
				disabled: this.buttonClaimDisabled,
				label: this.buttonClaimLabel,
				action: this.buttonClaimAction
			}
		},
		buttonUnclaim() {
			return {
				show: this.buttonUnclaimShow,
				disabled: this.buttonUnclaimDisabled,
				label: this.buttonUnclaimLabel,
				action: this.buttonUnclaimAction
			}
		},
		buttonComplete() {
			return {
				show: this.buttonCompleteShow,
				disabled: this.buttonCompleteDisabled,
				label: this.buttonCompleteLabel,
				action: this.buttonCompleteAction
			}
		},
		buttonUncomplete() {
			return {
				show: this.buttonUncompleteShow,
				disabled: this.buttonUncompleteDisabled,
				label: this.buttonUncompleteLabel,
				action: this.buttonUncompleteAction
			}
		},
		selectShow() {
			return Boolean(this.isStatusInstanceActive && this.assignee && this.hasNextTasks && this.hasHumanDecisionInAllNextTasks)
		},
		selectDisabled() {
			return Boolean(this.isLoadingProcessInstance || !this.isUserCandidate)
		},
		selectItems() {
			return this.nextTasks.map(task => ({
				text: task.taskName,
				value: task.taskId
			}))
		},
		buttonClaimShow() {
			return Boolean(this.isStatusInstanceActive && !this.assignee)
		},
		buttonClaimDisabled() {
			return Boolean(this.isLoadingProcessInstance || !this.isUserCandidate)
		},
		buttonClaimLabel() {
			return 'Receber'
		},
		buttonClaimAction() {
			return () => this.dispatchBpmActionThenReloadProcessInstance(
				actionTypes.BPM.CLAIM,
				this.currentTask.id
			)
		},
		buttonUnclaimShow() {
			return Boolean(this.isStatusInstanceActive && this.assignee)
		},
		buttonUnclaimDisabled() {
			return Boolean(this.isLoadingProcessInstance || !this.isUserCandidate)
		},
		buttonUnclaimLabel() {
			return 'Cancelar recebimento'
		},
		buttonUnclaimAction() {
			return () => this.dispatchBpmActionThenReloadProcessInstance(
				actionTypes.BPM.UNCLAIM,
				this.currentTask.id
			)
		},
		buttonCompleteShow() {
			return Boolean(this.isStatusInstanceActive && this.assignee)
		},
		buttonCompleteDisabled() {
			return Boolean(this.isLoadingProcessInstance || !this.isUserCandidate)
		},
		buttonCompleteLabel() {
			return !this.hasNextTasks
				? 'Finalizar'
				: 'Encaminhar'
		},
		buttonCompleteAction() {
			return (taskId, bpmParameter = {}) => {
				const argumento = _.cloneDeep(bpmParameter)
				if (taskId) {
					argumento.humanDecision = taskId
				}

				return this.dispatchBpmActionThenReloadProcessInstance(
					actionTypes.BPM.COMPLETE,
					this.currentTask.id,
					argumento
				)
			}
		},
		buttonUncompleteShow() {
			return Boolean(this.isStatusInstanceActive && !this.assignee && !this.isFirstTask)
		},
		buttonUncompleteDisabled() {
			return Boolean(this.isLoadingProcessInstance || !this.isUserCandidateInPreviousTask)
		},
		buttonUncompleteLabel() {
			return 'Cancelar encaminhamento'
		},
		buttonUncompleteAction() {
			return () => this.dispatchBpmActionThenReloadProcessInstance(
				actionTypes.BPM.UNCOMPLETE,
				this.currentTask.id
			)
		},
		isFirstTask() {
			return this.currentTask.firstTask || false
		},
		isLoadingProcessInstance() {
			return this.bpmAtProcessKeyAtBusinessKey.isLoading || false
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
		isUserInPreviousTaskCandidateUsers() {
			return this.previousTaskAssignee === this.user.name
		},
		isUserInPreviousTaskCandidateGroups() {
			return this.userRoles.some(role => this.previousTaskCandidateGroups.includes(role))
		},
		isUserCandidateInPreviousTask() {
			return this.isUserInPreviousTaskCandidateUsers || this.isUserInPreviousTaskCandidateGroups
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
            return !this.disabled && !this.isLoadingProcessInstance && this.hasAuthorityToInteraction
		},
    },
    async created() {
		this.initializeProcessInstance()
		await this.getProcessInstance()
    },
}
</script>

<style scoped></style>
