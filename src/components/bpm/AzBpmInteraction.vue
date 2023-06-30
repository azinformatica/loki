<template>
    <div>
        <slot :hasAuthority="hasAuthority" :components="components" :processInstance="processInstance"></slot>
    </div>
</template>

<script>
import { actionTypes, mutationTypes } from '../../store'

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
        isAuthorityWithAccess(authority) {
            return authority.hasAccess
        },
        isAuthorityValid(authority) {
            return (
                this.isAuthorityWithAccess(authority) &&
                this.isAuthorityPresentInProps(authority.name) &&
                !this.isAuthorityRevoked(authority.name)
            )
        },
        dispatchButtonActionIfAllowed(buttonType, bpmParameters) {
            const button = this.components.button[buttonType]
            if (button.disabled || !button.show) {
                throw new Error('Não foi possível realizar essa ação.')
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
                .then(() => this.processInstance)
        },
        createBpmArgumentsOnCurrentTask(bpmParameters = {}) {
            return {
                taskId: this.currentTask.id,
                bpmParameters,
            }
        },
        selectNextTasksItemsMapper(task) {
            return {
                text: task.taskName,
                value: task.taskId,
            }
        },
        selectCurrentTasksItemsMapper(task) {
            return {
                text: task.name,
                value: task.id,
            }
        },
        splitCommaSeparatedTextToArray(text) {
            return text.replace(/\s+/g, '').split(',').filter(Boolean)
        },
        initializeProcessInstance() {
            return this.$store.commit(mutationTypes.BPM.INITIALIZE_PROCESS_INSTANCE, this.processInstanceParams)
        },
        setCurrentTaskPreviouslySelected() {
            this.$store.commit(mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_INSTANCE, this.currentTaskParams())
        },
        setCurrentTaskSelected() {
            const currentTask = this.firstCurrentTaskUserHasPermission || this.firstCurrentTask || {}
            this.$store.commit(
                mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_INSTANCE,
                this.currentTaskParams(currentTask.id)
            )
            this.$store.commit(
                mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_PROCESS,
                this.currentTaskParams(currentTask.id)
            )
        },
        setCurrentTask() {
            if (this.isSetSelectedTask) {
                this.setCurrentTaskPreviouslySelected()
            } else {
                this.setCurrentTaskSelected()
            }
        },
        async getProcessInstance() {
            const type = actionTypes.BPM.GET_PROCESS_INSTANCE
            const payload = this.processInstanceParams
            const processInstance = await this.$store.dispatch(type, payload)
            this.setCurrentTask()

            return processInstance
        },
    },
    computed: {
        processInstanceParams() {
            return {
                processKey: this.processKey,
                businessKey: this.businessKey,
            }
        },
        currentTaskParams() {
            return (currentTaskId = null) => ({
                processKey: this.processKey,
                businessKey: this.businessKey,
                currentTaskId: currentTaskId ? currentTaskId : this.currentTaskSelectedId,
            })
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
        currentTaskSelected() {
            return this.bpmAtProcessKeyAtBusinessKey.currentTask || null
        },
        currentTaskSelectedId() {
            return (this.currentTaskSelected && this.currentTaskSelected.id) || null
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
        validUserAuthorities() {
            return this.userAuthorities.filter(this.isAuthorityValid.bind(this))
        },
        isSelectedTaskInCurrentTasks() {
            return Boolean(this.currentTasks.some((task) => task.id === this.currentTaskSelected.id))
        },
        isSetSelectedTask() {
            return Boolean(
                this.currentTasks.length > 1 && this.currentTaskSelected && this.isSelectedTaskInCurrentTasks
            )
        },
        firstCurrentTask() {
            return this.currentTasks.find((element, index) => index === 0) || null
        },
        firstCurrentTaskUserHasPermission() {
            return this.currentTasksUserHasPermission.find((element, index) => index === 0) || null
        },
        isUserCandidateInPreviousTaskByTask() {
            return (task) =>
                Boolean(
                    task.previousTask.assignee === this.user.name ||
                        this.userRoles.some(
                            (role) =>
                                task.previousTask.candidateGroups && task.previousTask.candidateGroups.includes(role)
                        )
                )
        },
        isUserCandidateByTask() {
            return (task) =>
                Boolean(
                    task.candidateUsers.includes(this.user.name) ||
                        this.userRoles.some((role) => task.candidateGroups.includes(role))
                )
        },
        currentTasksUserHasPermission() {
            return (
                this.currentTasks
                    .filter((task) => {
                        task.isUserCandidateByTask = this.isUserCandidateByTask(task)
                        return Boolean(task.isUserCandidateByTask || this.isUserCandidateInPreviousTaskByTask(task))
                    })
                    .sort(function (previous, actual) {
                        if (previous.isUserCandidateByTask === actual.isUserCandidateByTask) {
                            return 0
                        } else {
                            return previous.isUserCandidateByTask ? -1 : 1
                        }
                    }) || []
            )
        },
        currentTasks() {
            return (this.processInstance && this.processInstance.currentTasks) || []
        },
        currentTask() {
            return (this.processInstance && this.processInstance.currentTask) || {}
        },
        previousTask() {
            return this.currentTask.previousTask || {}
        },
        nextTasks() {
            return this.currentTask.nextTasks || []
        },
        hasNextTasks() {
            return this.nextTasks.length > 0
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
            return (this.processInstance && this.processInstance.statusInstance) || ''
        },
        assignee() {
            return this.currentTask.assignee || null
        },
        components() {
            return {
                select: {
                    humanDecision: this.selectHumanDecision,
                    parallel: this.selectParallel,
                },
                button: {
                    claim: this.buttonClaim,
                    unclaim: this.buttonUnclaim,
                    complete: this.buttonComplete,
                    uncomplete: this.buttonUncomplete,
                },
            }
        },
        selectHumanDecision() {
            return {
                show: this.selectHumanDecisionShow,
                disabled: this.selectDisabled,
                items: this.selectHumanDecisionItems,
            }
        },
        selectParallel() {
            return {
                show: this.selectParallelShow,
                disabled: this.selectDisabled,
                items: this.selectParallelItems,
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
        moreThenOneCurrentTasksUserHasPermissionForAction() {
            return this.currentTasksUserHasPermissionForAction.length > 1
        },
        currentTasksUserHasPermissionForAction() {
            return (
                this.currentTasks.filter((task) => {
                    return Boolean(
                        task.candidateUsers.includes(this.user.name) ||
                            this.userRoles.some((role) => task.candidateGroups.includes(role))
                    )
                }) || []
            )
        },
        selectParallelShow() {
            return Boolean(
                this.isStatusInstanceActive &&
                    this.firstCurrentTaskUserHasPermission &&
                    this.moreThenOneCurrentTasksUserHasPermissionForAction
            )
        },
        selectHumanDecisionShow() {
            return Boolean(
                this.isStatusInstanceActive && this.assignee && this.hasNextTasks && this.hasHumanDecisionInAllNextTasks
            )
        },
        selectDisabled() {
            return Boolean(this.isLoadingProcessInstance || !this.isUserCandidate)
        },
        selectParallelItems() {
            return this.currentTasks.map(this.selectCurrentTasksItemsMapper) || []
        },
        selectHumanDecisionItems() {
            return this.hasHumanDecisionInAllNextTasks ? this.nextTasks.map(this.selectNextTasksItemsMapper) : []
        },
        hasHumanDecisionInAllNextTasks() {
            return this.nextTasks.every((task) => task.flowExpression && task.flowExpression.includes('humanDecision'))
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
        isNextNodeParallelFromPreviousTaskHasSingleOutgoing() {
            return Boolean(this.currentTask.previousTask.isNextNodeParallelHasSingleOutgoing)
        },
        isParallelTask() {
            return Boolean(this.currentTask.isParallel)
        },
        isUncompleteTaskDisabled() {
            if (this.currentTask.previousTask.isNextNodeParallelHasMultipleOutgoing) {
                return Boolean(
                    this.currentTasks.filter(
                        (task) => task.previousTask.key === this.previousTask.key && !task.assignee
                    ).length < 2
                )
            }
            return this.isNextNodeParallelFromPreviousTaskHasSingleOutgoing || this.isParallelTask
        },
        buttonUncompleteDisabled() {
            return Boolean(
                this.isLoadingProcessInstance || !this.isUserCandidateInPreviousTask || this.isUncompleteTaskDisabled
            )
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
        isStatusInstanceActive() {
            return this.statusInstance === 'ACTIVE'
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
        hasAssignee() {
            return Boolean(this.assignee)
        },
        hasValidStatusInstance() {
            return this.isStatusInstanceActive && this.hasAssignee
        },
        hasSomeValidAuthority() {
            return this.validUserAuthorities.length > 0
        },
        hasAuthority() {
            return (
                !this.disabled &&
                !this.isLoadingProcessInstance &&
                this.hasValidStatusInstance &&
                this.hasSomeValidAuthority &&
                this.isUserCandidate
            )
        },
    },
    created() {
        this.initializeProcessInstance()
        this.getProcessInstance()
    },
}
</script>

<style scoped></style>
