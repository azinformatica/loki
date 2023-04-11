<template>
    <div>
        <slot :hasAuthority="hasAuthority" :components="components" :processInstance="processInstance"> </slot>
    </div>
</template>

<script>
import { actionTypes, mutationTypes } from '../../store'
import bpmConstants from './bpm-constants'

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
        dispatchButtonActionIfAllowed(buttonType, bpmParameters) {
            const button = this.components.button[buttonType]
            if (button.disabled || !button.show) {
                throw Error('Não foi possível realizar essa ação.')
            }

            const actionName = buttonType.toUpperCase()
            const actionType = actionTypes.BPM[actionName]
            const args = this.createBpmArgumentsOnCurrentTask(bpmParameters)

            return this.$store.dispatch(actionType, args)
        },
        dispatchButtonActionOnCurrentTask(buttonType, bpmParameters) {
            return this.getProcessInstance()
                .then(() => this.$nextTick())
                .then(() => this.dispatchButtonActionIfAllowed(buttonType, bpmParameters))
                .then(() => this.getProcessInstance())
        },
        createBpmArgumentsOnCurrentTask(bpmParameters = {}) {
            return {
                taskId: this.currentTask.id,
                bpmParameters,
            }
        },
        splitCommaSeparatedTextToArray(text) {
            return text.replace(/\s+/g, '').split(',').filter(Boolean)
        },
    },
    computed: {
        processInstanceParams() {
            return {
                processKey: this.processKey,
                businessKey: this.businessKey,
            }
        },
        bpm() {
            return this.$store.state.loki.bpm
        },
        bpmAtProcessKey() {
            return this.bpm.process[this.processKey] || {}
        },
        bpmAtProcessKeyAtBusinessKey() {
            return this.bpmAtProcessKey[this.businessKey] || {}
        },
        processInstance() {
            return this.bpmAtProcessKeyAtBusinessKey.instance || null
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
            return this.nextTasks.every((task) => task.flowExpression && task.flowExpression.includes('humanDecision'))
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
                    claim: this.buttonClaim,
                    unclaim: this.buttonUnclaim,
                    complete: this.buttonComplete,
                    uncomplete: this.buttonUncomplete,
                },
            }
        },
        select() {
            return {
                show: this.selectShow,
                disabled: this.selectDisabled,
                items: this.selectItems,
            }
        },
        buttonClaim() {
            return {
                show: this.buttonClaimShow,
                disabled: this.buttonClaimDisabled,
                label: this.buttonClaimLabel,
                action: this.buttonClaimAction,
            }
        },
        buttonUnclaim() {
            return {
                show: this.buttonUnclaimShow,
                disabled: this.buttonUnclaimDisabled,
                label: this.buttonUnclaimLabel,
                action: this.buttonUnclaimAction,
            }
        },
        buttonComplete() {
            return {
                show: this.buttonCompleteShow,
                disabled: this.buttonCompleteDisabled,
                label: this.buttonCompleteLabel,
                action: this.buttonCompleteAction,
            }
        },
        buttonUncomplete() {
            return {
                show: this.buttonUncompleteShow,
                disabled: this.buttonUncompleteDisabled,
                label: this.buttonUncompleteLabel,
                action: this.buttonUncompleteAction,
            }
        },
        selectShow() {
            return Boolean(
                this.isStatusInstanceActive && this.assignee && this.hasNextTasks && this.hasHumanDecisionInAllNextTasks
            )
        },
        selectDisabled() {
            return Boolean(this.isLoadingProcessInstance || !this.isUserCandidate)
        },
        selectItems() {
            return this.nextTasks.map((task) => ({
                text: task.taskName,
                value: task.taskId,
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
            return () => this.dispatchButtonActionOnCurrentTask('claim')
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
            return () => this.dispatchButtonActionOnCurrentTask('unclaim')
        },
        buttonCompleteShow() {
            return Boolean(this.isStatusInstanceActive && this.assignee)
        },
        buttonCompleteDisabled() {
            return Boolean(this.isLoadingProcessInstance || !this.isUserCandidate)
        },
        buttonCompleteLabel() {
            return !this.hasNextTasks ? 'Finalizar' : 'Encaminhar'
        },
        buttonCompleteAction() {
            return (bpmParameters) => this.dispatchButtonActionOnCurrentTask('complete', bpmParameters)
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
            return () => this.dispatchButtonActionOnCurrentTask('uncomplete')
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
            return this.userRoles.some((role) => this.candidateGroups.includes(role))
        },
        isUserCandidate() {
            return this.isUserInCandidateUsers || this.isUserInCandidateGroups
        },
        isUserInPreviousTaskCandidateUsers() {
            return this.previousTaskAssignee === this.user.name
        },
        isUserInPreviousTaskCandidateGroups() {
            return this.userRoles.some((role) => this.previousTaskCandidateGroups.includes(role))
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
            return this.hasSomeAuthorityPresentInProps && !this.hasSomeRevokedAuthority && this.hasAuthorityToBpmRule
        },
        hasAuthority() {
            return !this.disabled && !this.isLoadingProcessInstance && this.hasAuthorityToInteraction
        },
    },
    created() {
        this.initializeProcessInstance()
        this.getProcessInstance()
    },
}
</script>

<style scoped></style>
