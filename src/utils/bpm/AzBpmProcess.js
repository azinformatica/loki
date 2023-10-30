import { actionTypes, mutationTypes } from '../../store'
import Vue from 'vue'

export default class AzBpmProcess {
    static _shared = {}

    constructor(store, processKey, businessKey) {
        this.store = store
        this.processKey = processKey
        this.businessKey = businessKey

        this.initialize()
    }

    load(invalidateCache = false) {
        this._startLoadingProcess()
        this._resetDebounce()

        return this._getProcessInstancePromise(invalidateCache)
            .then((processInstance) => this._resetCurrentTask(processInstance))
            .finally(() => {
                this._finishLoadingProcess()

                this._loadUpperHierarchyCodeUOs()
                this._loadAcronymTypeAdministrationCompletedUOs()
            })
    }

    initialize() {
        this._initializeProcessSharedVariables()
        this._initializeProcessInstance()
    }

    hasAuthority(authorities = []) {
        const currentTask = this.getCurrentTask()

        return (
            !this.isLoadingProcess() &&
            this._isStatusInstanceActive() &&
            this._hasAssignee(currentTask) &&
            this._hasSomeValidAuthority(currentTask, authorities) &&
            this._isUserCandidate(currentTask) &&
            this.hasPermissionCurrentUo()
        )
    }

    hasPermissionCurrentUo() {
        return (this._isUOEnabled() && this.getCurrentUoPermission()) || !this._isUOEnabled()
    }

    getCurrentUoPermission() {
        return this.getCurrentTask().currentUo ? this.getCurrentTask().currentUo.possuiPermissao : true
    }

    getOriginUoPermission() {
        return this.getCurrentTask().originUo ? this.getCurrentTask().originUo.possuiPermissao : true
    }
    getProcess() {
        return this._getBpmAtBusinessKey()
    }

    getProcessInstance() {
        const process = this.getProcess()

        return process.instance || null
    }

    getCurrentTask() {
        const processInstance = this.getProcessInstance()

        return (processInstance && processInstance.currentTask) || {}
    }

    getProcessDefinitionInfo() {
        const processInstance = this.getProcessInstance()

        return (processInstance && processInstance.processDefinitionInfo) || {}
    }

    getComponents() {
        return {
            select: {
                humanDecision: this.getSelectHumanDecision(),
                parallel: this.getSelectParallel(),
                route: this.getSelectRoute(),
                uo: this.getSelectUO(),
            },
            button: {
                claim: this.getButtonClaim(),
                unclaim: this.getButtonUnclaim(),
                complete: this.getButtonComplete(),
                uncomplete: this.getButtonUncomplete(),
                route: this.getButtonRoute(),
            },
        }
    }

    getSelectHumanDecision() {
        return {
            show: this._getSelectHumanDecisionShow(),
            disabled: this._getSelectHumanDecisionDisabled(),
            items: this._getSelectHumanDecisionItems(),
        }
    }

    getSelectParallel() {
        return {
            show: this._getSelectParallelShow(),
            disabled: this._getSelectParallelDisabled(),
            items: this._getSelectParallelItems(),
        }
    }

    getSelectRoute() {
        return {
            show: this._getSelectRouteShow(),
            disabled: this._getSelectRouteDisabled(),
            items: this._getSelectRouteItems(),
        }
    }

    getSelectUO() {
        return {
            show: this._getSelectUOShow(),
            disabled: this._getSelectUODisabled(),
            items: this._getSelectUOItems(),
        }
    }

    getButtonClaim() {
        return {
            show: this._getButtonClaimShow(),
            disabled: this._getButtonClaimDisabled(),
            label: this._getButtonClaimLabel(),
            action: this._getButtonClaimAction(),
        }
    }

    getButtonUnclaim() {
        return {
            show: this._getButtonUnclaimShow(),
            disabled: this._getButtonUnclaimDisabled(),
            label: this._getButtonUnclaimLabel(),
            action: this._getButtonUnclaimAction(),
        }
    }

    getButtonComplete() {
        return {
            show: this._getButtonCompleteShow(),
            disabled: this._getButtonCompleteDisabled(),
            label: this._getButtonCompleteLabel(),
            action: this._getButtonCompleteAction(),
        }
    }

    getButtonUncomplete() {
        return {
            show: this._getButtonUncompleteShow(),
            disabled: this._getButtonUncompleteDisabled(),
            label: this._getButtonUncompleteLabel(),
            action: this._getButtonUncompleteAction(),
        }
    }

    getButtonRoute() {
        return {
            show: this._getButtonRouteShow(),
            disabled: this._getButtonRouteDisabled(),
            label: this._getButtonRouteLabel(),
            action: this._getButtonRouteAction(),
        }
    }

    isLoadingProcess() {
        return this._isLoadingProcess()
    }

    _getBpm() {
        return this.store.state.loki.bpm || {}
    }

    _getBpmAtProcessKey() {
        const bpm = this._getBpm()

        return bpm.process[this.processKey] || {}
    }

    _getBpmAtBusinessKey() {
        const bpmAtProcessKey = this._getBpmAtProcessKey()

        return bpmAtProcessKey[this.businessKey] || {}
    }

    _loadProcessInstance() {
        return this.store.dispatch(actionTypes.BPM.GET_PROCESS_INSTANCE, this._getProcessParams())
    }

    _loadUserTasks() {
        return this.store.dispatch(actionTypes.BPM.GET_USER_TASKS, this._getProcessParams())
    }

    _loadUosFiltered(filters) {
        return this.store.dispatch(actionTypes.UO.FIND_ALL_ACTIVE, filters)
    }

    _loadAcronymTypeAdministrationCompletedUOs() {
        if (
            !this._isLoadUoAcronymTypeAdministrationCompleted() &&
            !this._hasUOs('acronymTypeAdministrationCompleted')
        ) {
            const acronymTypeAdministrationCompletedUOsFilter = { tipoAdministracaoPreenchido: true }
            const filters = this._createFiltersForUOs(acronymTypeAdministrationCompletedUOsFilter)
            this._startLoadUoAcronymTypeAdministrationCompleted()
            return this._loadUosFiltered(filters).finally(() => {
                this._finishLoadUoAcronymTypeAdministrationCompleted()
            })
        }
    }

    _loadUpperHierarchyCodeUOs() {
        if (!this._isLoadUoUpperHierarchyCode() && !this._hasUOs('upperHierarchyCode')) {
            if (this._isUOEnabled()) {
                const upperHierarchyCode = this.getCurrentTask().originUo
                    ? this.getCurrentTask().originUo.codigoHierarquia
                    : '-1'
                const upperHierarchyCodeFilter = { codigoHierarquiaSuperior: upperHierarchyCode }
                const filters = this._createFiltersForUOs(upperHierarchyCodeFilter)
                this._startLoadUoUpperHierarchyCode()
                return this._loadUosFiltered(filters).finally(() => {
                    this._finishLoadUoUpperHierarchyCode()
                })
            }
        }
    }

    _createFiltersForUOs(newFilters) {
        const defaultFilters = { somenteAtivos: true, sort: 'sigla' }
        return new URLSearchParams({ ...defaultFilters, ...newFilters })
    }

    _initializeProcessInstance() {
        return this.store.commit(mutationTypes.BPM.INITIALIZE_PROCESS_INSTANCE, this._getProcessParams())
    }

    _getKeyProcessBusiness() {
        return `${this.processKey}-${this.businessKey}`
    }

    _initializeProcessSharedVariables() {
        const key = this._getKeyProcessBusiness()

        if (!AzBpmProcess._shared[key]) {
            AzBpmProcess._shared[key] = Vue.observable({
                _debounce: null,
                _cache: null,
                _isDispatchingAction: false,
                _isLoadingProcess: false,
                _isLoadUoAcronymTypeAdministrationCompleted: false,
                _isLoadUoUpperHierarchyCode: false,
            })
        }
    }

    _getProcessSharedVariables() {
        const key = this._getKeyProcessBusiness()

        return AzBpmProcess._shared[key]
    }

    _startDispatchingAction() {
        const shared = this._getProcessSharedVariables()

        shared._isDispatchingAction = true
    }
    _startLoadUoAcronymTypeAdministrationCompleted() {
        const shared = this._getProcessSharedVariables()

        shared._isLoadUoAcronymTypeAdministrationCompleted = true
    }

    _startLoadUoUpperHierarchyCode() {
        const shared = this._getProcessSharedVariables()

        shared._isLoadUoUpperHierarchyCode = true
    }

    _finishDispatchingAction() {
        const shared = this._getProcessSharedVariables()

        shared._isDispatchingAction = false
    }
    _finishLoadUoAcronymTypeAdministrationCompleted() {
        const shared = this._getProcessSharedVariables()

        shared._isLoadUoAcronymTypeAdministrationCompleted = false
    }
    _finishLoadUoUpperHierarchyCode() {
        const shared = this._getProcessSharedVariables()

        shared._isLoadUoUpperHierarchyCode = false
    }

    _isDispatchingAction() {
        const shared = this._getProcessSharedVariables()

        return shared._isDispatchingAction
    }

    _isLoadUoAcronymTypeAdministrationCompleted() {
        const shared = this._getProcessSharedVariables()
        return shared._isLoadUoAcronymTypeAdministrationCompleted
    }

    _isLoadUoUpperHierarchyCode() {
        const shared = this._getProcessSharedVariables()
        return shared._isLoadUoUpperHierarchyCode
    }
    _startLoadingProcess() {
        const shared = this._getProcessSharedVariables()

        shared._isLoadingProcess = true
    }

    _finishLoadingProcess() {
        const shared = this._getProcessSharedVariables()

        shared._isLoadingProcess = false
    }

    _isLoadingProcess() {
        const shared = this._getProcessSharedVariables()

        return shared._isLoadingProcess
    }

    _resetDebounce() {
        this._unregisterDebounce()
        this._registerDebounce()
    }

    _registerDebounce() {
        const INACTIVITY_TIME = 300
        const shared = this._getProcessSharedVariables()

        shared._debounce = setTimeout(() => {
            this._removeCache()
        }, INACTIVITY_TIME)
    }

    _unregisterDebounce() {
        const shared = this._getProcessSharedVariables()

        clearTimeout(shared._debounce)
        shared._debounce = null
    }

    _setCache(cache) {
        const shared = this._getProcessSharedVariables()

        shared._cache = cache
    }

    _getCache() {
        const shared = this._getProcessSharedVariables()

        return shared._cache
    }

    _removeCache() {
        this._setCache(null)
    }

    _getProcessInstancePromise(invalidateCache = false) {
        let cache = this._getCache()
        if (invalidateCache || !cache) {
            cache = this._createProcessInstancePromise()
            this._setCache(cache)
        }

        return cache
    }

    _createProcessInstancePromise() {
        return this._loadProcessInstance().finally(() => {
            this._loadUserTasksOnce()
        })
    }

    _loadUserTasksOnce() {
        if (!this._hasUserTasks()) {
            return this._loadUserTasks()
        }
    }

    _resetCurrentTask(processInstance) {
        const currentTask = this._getCurrentTaskInProcess()
        this._setCurrentTaskInInstance(currentTask)

        const task = this._hasValidCurrentTask() ? this.getCurrentTask() : this._getFirstValidCurrentTask()

        this._setCurrentTaskInInstance(task)
        this._setCurrentTaskInProcess(task)

        return processInstance
    }

    _getCurrentTaskInProcess() {
        const process = this.getProcess()

        return process.currentTask || {}
    }

    _getFirstValidCurrentTask() {
        const currentTasks = [
            ...this._getCurrentTasksThatUserIsCandidate(),
            ...this._getCurrentTasksThatUserIsCandidateInPreviousTask(),
            ...this._getCurrentTasks(),
        ]

        return currentTasks.shift() || {}
    }

    _setCurrentTaskInInstance(task) {
        const payload = this._getProcessParams()
        payload.currentTaskId = task.id

        return this.store.commit(mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_INSTANCE, payload)
    }

    _setCurrentTaskInProcess(task) {
        const payload = this._getProcessParams()
        payload.currentTaskId = task.id

        return this.store.commit(mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_PROCESS, payload)
    }

    _hasCurrentTasks() {
        const currentTasks = this._getCurrentTasks()

        return currentTasks.length > 0
    }

    _hasValidCurrentTask() {
        return this._hasCurrentTasks() && this._hasCurrentTask() && this._isCurrentTaskInCurrentTasks()
    }

    _isCurrentTaskInCurrentTasks() {
        const currentTasks = this._getCurrentTasks()
        const currentTask = this.getCurrentTask()

        return currentTasks.some((task) => task.id === currentTask.id)
    }

    _getSelectHumanDecisionShow() {
        const currentTask = this.getCurrentTask()

        return Boolean(
            this._hasHumanDecisionInAllNextTasks(currentTask) &&
                this._hasNextTasks(currentTask) &&
                this._hasAssignee(currentTask) &&
                this._isStatusInstanceActive()
        )
    }

    _getSelectHumanDecisionDisabled() {
        const currentTask = this.getCurrentTask()

        return Boolean(this.isLoadingProcess() || this._isDispatchingAction() || !this._isUserCandidate(currentTask))
    }

    _getSelectHumanDecisionItems() {
        const currentTask = this.getCurrentTask()
        if (!this._hasHumanDecisionInAllNextTasks(currentTask)) {
            return []
        }

        const nextTasks = this._getNextTasks(currentTask)

        return nextTasks.map((task) => ({
            text: task.taskName,
            value: task.taskId,
            requiresUO: task.habilitarSelecaoDeUO,
        }))
    }

    _getSelectParallelShow() {
        return Boolean(
            this._isStatusInstanceActive() &&
                this._hasSomeCurrentTaskThatUserCanInteract() &&
                this._hasMultipleCurrentTasks()
        )
    }

    _getSelectParallelDisabled() {
        return Boolean(this.isLoadingProcess() || this._isDispatchingAction())
    }

    _getSelectParallelItems() {
        const currentTasks = this._getCurrentTasks()

        return currentTasks.map((task) => ({
            text: task.name,
            value: task.id,
        }))
    }

    _getSelectRouteShow() {
        return true
    }

    _getSelectRouteDisabled() {
        return Boolean(this._isDispatchingAction())
    }

    _getSelectRouteItems() {
        const currentTask = this.getCurrentTask()
        const userTasks = this._getUserTasksNotEqual(currentTask)

        return userTasks.map((userTask) => ({
            text: userTask.name,
            value: userTask.activityId,
            requiresUO: userTask.habilitarSelecaoDeUO,
        }))
    }

    _getSelectUOShow() {
        const currentTask = this.getCurrentTask()

        return Boolean(this._isUOEnabled() && !this._isParallel(currentTask))
    }

    _getSelectUODisabled() {
        return Boolean(this._isDispatchingAction() || !this._isUOEnabled())
    }

    _getSelectUOItems() {
        const uos = this._getUOs('acronymTypeAdministrationCompleted')
        return uos.map((uo) => ({
            text: this._formatUOText(uo),
            value: this._formatUOValue(uo),
        }))
    }

    _getButtonClaimShow() {
        const currentTask = this.getCurrentTask()

        return Boolean(this._isStatusInstanceActive() && !this._hasAssignee(currentTask))
    }

    _getButtonClaimDisabled() {
        const currentTask = this.getCurrentTask()

        return Boolean(
            this.isLoadingProcess() ||
                this._isDispatchingAction() ||
                !this._isUserCandidate(currentTask) ||
                !this.hasPermissionCurrentUo()
        )
    }

    _getButtonClaimLabel() {
        return 'Receber'
    }

    _getButtonClaimAction() {
        return () => {
            const actionArgs = this._createButtonClaimActionArgs()

            return this._executeButtonAction('claim', actionArgs)
        }
    }

    _createButtonClaimActionArgs() {
        const currentTask = this.getCurrentTask()

        return {
            taskId: currentTask.id,
        }
    }

    _getButtonUnclaimShow() {
        const currentTask = this.getCurrentTask()

        return Boolean(
            this._isStatusInstanceActive() && this._hasAssignee(currentTask) && !this._isFirstExecutionTask(currentTask)
        )
    }

    _getButtonUnclaimDisabled() {
        const currentTask = this.getCurrentTask()

        return Boolean(
            this.isLoadingProcess() ||
                this._isDispatchingAction() ||
                !this._isUserCandidate(currentTask) ||
                !this.hasPermissionCurrentUo()
        )
    }

    _getButtonUnclaimLabel() {
        return 'Cancelar recebimento'
    }

    _getButtonUnclaimAction() {
        return () => {
            const actionArgs = this._createButtonUnclaimActionArgs()

            return this._executeButtonAction('unclaim', actionArgs)
        }
    }

    _createButtonUnclaimActionArgs() {
        const currentTask = this.getCurrentTask()

        return {
            taskId: currentTask.id,
        }
    }

    _getButtonCompleteShow() {
        const currentTask = this.getCurrentTask()

        return Boolean(this._isStatusInstanceActive() && this._hasAssignee(currentTask))
    }

    _getButtonCompleteDisabled() {
        const currentTask = this.getCurrentTask()

        return Boolean(
            this.isLoadingProcess() ||
                this._isDispatchingAction() ||
                !this._isUserCandidate(currentTask) ||
                !this.hasPermissionCurrentUo()
        )
    }

    _getButtonCompleteLabel() {
        const currentTask = this.getCurrentTask()

        return this._hasSingleNextTask(currentTask) && this._nextTasksContainsEndEvent(currentTask)
            ? 'Finalizar'
            : 'Encaminhar'
    }

    _getButtonCompleteAction() {
        return (bpmParameters) => {
            const actionArgs = this._createButtonCompleteActionArgs(bpmParameters)

            return this._executeButtonAction('complete', actionArgs)
        }
    }

    _createButtonCompleteActionArgs(bpmParameters) {
        const currentTask = this.getCurrentTask()

        return {
            taskId: currentTask.id,
            processKey: this.processKey,
            bpmParameters: bpmParameters,
        }
    }

    _getButtonUncompleteShow() {
        const currentTask = this.getCurrentTask()

        return Boolean(
            this._isStatusInstanceActive() && !this._hasAssignee(currentTask) && !this._isFirstTask(currentTask)
        )
    }

    _getButtonUncompleteDisabled() {
        const currentTask = this.getCurrentTask()

        return Boolean(
            this.isLoadingProcess() ||
                this._isDispatchingAction() ||
                !this._isUserCandidateInPreviousTask(currentTask) ||
                this._isUncompleteTaskDisabled(currentTask)
        )
    }

    _getButtonUncompleteLabel() {
        return 'Cancelar encaminhamento'
    }

    _getButtonUncompleteAction() {
        return () => {
            const actionArgs = this._createButtonUncompleteActionArgs()

            return this._executeButtonAction('uncomplete', actionArgs)
        }
    }

    _createButtonUncompleteActionArgs() {
        const currentTask = this.getCurrentTask()

        return {
            taskId: currentTask.id,
            processKey: this.processKey,
        }
    }

    _getButtonRouteShow() {
        const currentTask = this.getCurrentTask()

        return Boolean(
            this._isStatusInstanceActive() &&
                this._isRoutingEnabled() &&
                this._isUserHasPermissionToRoute() &&
                this._hasAssignee(currentTask) &&
                !this._isParallel(currentTask)
        )
    }

    _getButtonRouteDisabled() {
        const currentTask = this.getCurrentTask()

        return Boolean(
            this.isLoadingProcess() ||
                this._isDispatchingAction() ||
                !this._isRoutingEnabled() ||
                !this._isUserHasPermissionToRoute() ||
                !this._isUserCandidate(currentTask)
        )
    }

    _getButtonRouteLabel() {
        return 'Rotear'
    }

    _getButtonRouteAction() {
        return (bpmParameters) => {
            const actionArgs = this._createButtonRouteActionArgs(bpmParameters)

            return this._executeButtonAction('route', actionArgs)
        }
    }

    _createButtonRouteActionArgs(bpmParameters) {
        const currentTask = this.getCurrentTask()

        return {
            taskId: currentTask.id,
            processKey: this.processKey,
            bpmParameters: bpmParameters,
        }
    }

    _getProcessParams() {
        return {
            processKey: this.processKey,
            businessKey: this.businessKey,
        }
    }

    _getUser() {
        return this.store.state.loki.user || null
    }

    _isStatusInstanceActive() {
        const status = this._getProcessInstanceStatus()

        return status === 'ACTIVE'
    }

    _getProcessInstanceStatus() {
        const processInstance = this.getProcessInstance()

        return (processInstance && processInstance.statusInstance) || ''
    }

    _hasAssignee(task) {
        const assignee = this._getAssignee(task)

        return Boolean(assignee)
    }

    _getAssignee(task) {
        return task.assignee || null
    }

    _isFirstExecutionTask(task) {
        return task.firstExecutionTask
    }

    _hasCurrentTask() {
        const currentTask = this.getCurrentTask()

        return currentTask.id
    }

    _hasSomeValidAuthority(task, authorities = []) {
        const validUserAuthorities = this._getValidUserAuthorities(task, authorities)

        return validUserAuthorities.length > 0
    }

    _getValidUserAuthorities(task, authorities) {
        const userAuthorities = this._getUserAuthorities()

        return userAuthorities.filter((authority) => this._isAuthorityValid(task, authority, authorities))
    }

    _getUserAuthorities() {
        const user = this._getUser()

        return user.authorities || []
    }

    _isAuthorityValid(task, authority, authorities = []) {
        return (
            this._isAuthorityWithAccess(authority) &&
            this._isAuthorityPresentInProps(authority, authorities) &&
            !this._isAuthorityRevoked(task, authority)
        )
    }

    _isAuthorityWithAccess(authority) {
        return authority.hasAccess
    }

    _isAuthorityPresentInProps(authority, authorities = []) {
        return !authorities.length || authorities.includes(authority.name)
    }

    _isAuthorityRevoked(task, authority) {
        const revokedAuthorities = this._getCurrentTaskRevokedAuthorities()

        return revokedAuthorities.length && revokedAuthorities.includes(authority.name)
    }

    _getRevokedAuthorities(task) {
        const revokedPermissions = task.revokedPermissions || ''

        return this._splitCommaSeparatedTextToArray(revokedPermissions)
    }

    _getCurrentTaskRevokedAuthorities() {
        const currentTask = this.getCurrentTask()

        return this._getRevokedAuthorities(currentTask)
    }

    _splitCommaSeparatedTextToArray(text) {
        return text.replace(/\s+/g, '').split(',').filter(Boolean)
    }

    _isUserCandidate(task) {
        return this._isUserInCandidateUsers(task) || this._isUserInCandidateGroups(task)
    }

    _isRoutingEnabled() {
        const processDefinitionInfo = this.getProcessDefinitionInfo()

        return processDefinitionInfo.routingEnabled || false
    }

    _isUserHasPermissionToRoute() {
        const processDefinitionInfo = this.getProcessDefinitionInfo()

        return processDefinitionInfo.userHasPermissionToRoute || false
    }

    _isUserInCandidateUsers(task) {
        const candidateUsers = this._getCandidateUsers(task)
        const user = this._getUser()

        return candidateUsers.includes(user.name)
    }

    _getCandidateUsers(task) {
        return task.candidateUsers || []
    }

    _isUserInCandidateGroups(task) {
        const userRoles = this._getUserRoles()
        const candidateGroups = this._getCandidateGroups(task)

        return userRoles.some((role) => candidateGroups.includes(role))
    }

    _getUserRoles() {
        const user = this._getUser()

        return user.roles || []
    }

    _isFirstTask(task) {
        return !task.previousTask
    }

    _getCandidateGroups(task) {
        return task.candidateGroups || []
    }

    _getNextTasks(task) {
        return task.nextTasks || []
    }

    _hasNextTasks(task) {
        const nextTasks = this._getNextTasks(task)

        return nextTasks.length > 0
    }

    _nextTasksContainsEndEvent(task) {
        const nextTasks = this._getNextTasks(task)

        return nextTasks.some((nextTask) => nextTask.type === 'endEvent')
    }

    _hasSingleNextTask(task) {
        const nextTasks = this._getNextTasks(task)

        return nextTasks.length === 1
    }

    _hasHumanDecisionInAllNextTasks(task) {
        const nextTasks = this._getNextTasks(task)
        const hasNextTasks = nextTasks.length > 0

        return hasNextTasks && nextTasks.every((nextTask) => this._isHumanDecisionTask(nextTask))
    }

    _isHumanDecisionTask(task) {
        const flowExpression = task.flowExpression

        return flowExpression && flowExpression.includes('humanDecision')
    }

    _getPreviousTask(task) {
        return task.previousTask || {}
    }

    _isUserAssignee(task) {
        const user = this._getUser()
        const assignee = this._getAssignee(task)

        return user.name === assignee
    }

    _isUncompleteTaskDisabled(task) {
        const previousTask = this._getPreviousTask(task)
        if (previousTask.isNextNodeParallelHasMultipleOutgoing) {
            const currentTasks = this._getCurrentTasks()
            const tasksGenerated = currentTasks.filter((task) => task.previousTask.key === previousTask.key)
            const tasksGeneratedWithoutAssignee = tasksGenerated.filter((task) => !task.assignee)
            return tasksGeneratedWithoutAssignee.length < 2
        }

        if (previousTask.isNextNodeParallelHasSingleOutgoing) {
            return true
        }

        return this._isParallel(task)
    }

    _isParallel(task) {
        return task.isParallel || false
    }

    _isUOEnabled() {
        const processDefinitionInfo = this.getProcessDefinitionInfo()

        return processDefinitionInfo.bpmUoEnabled
    }

    _getUserTasksNotEqual(task) {
        const userTasks = this._getUserTasks()

        return userTasks.filter((userTask) => userTask.activityId !== task.key)
    }

    _hasUserTasks() {
        const userTasks = this._getUserTasks()

        return userTasks.length > 0
    }

    _getUserTasks() {
        const bpmAtProcessKey = this._getBpmAtProcessKey()

        return bpmAtProcessKey.userTasks || []
    }

    _getUOs(type) {
        const uosList = this.store.state.loki.uos[type]
        return uosList || []
    }
    _hasUOs(type) {
        let uos = this._getUOs(type)

        return uos.length > 0
    }

    _getCurrentTasks() {
        const processInstance = this.getProcessInstance()

        return (processInstance && processInstance.currentTasks) || []
    }

    _hasMultipleCurrentTasks() {
        const currentTasks = this._getCurrentTasks()

        return currentTasks.length > 1
    }

    _hasSomeCurrentTaskThatUserCanInteract() {
        return (
            this._hasSomeCurrentTaskThatUserIsCandidate() || this._hasSomeCurrentTaskThatUserIsCandidateInPreviousTask()
        )
    }

    _hasSomeCurrentTaskThatUserIsCandidate() {
        const currentTasksThatUserIsCandidate = this._getCurrentTasksThatUserIsCandidate()

        return currentTasksThatUserIsCandidate.length > 0
    }

    _getCurrentTasksThatUserIsCandidate() {
        const currentTasks = this._getCurrentTasks()

        return currentTasks.filter((task) => this._isUserCandidate(task))
    }

    _hasSomeCurrentTaskThatUserIsCandidateInPreviousTask() {
        const currentTasksThatUserIsCandidateInPreviousTask = this._getCurrentTasksThatUserIsCandidateInPreviousTask()

        return currentTasksThatUserIsCandidateInPreviousTask.length > 0
    }

    _getCurrentTasksThatUserIsCandidateInPreviousTask() {
        const currentTasks = this._getCurrentTasks()

        return currentTasks.filter((task) => this._isUserCandidateInPreviousTask(task))
    }

    _isUserCandidateInPreviousTask(task) {
        const previousTask = this._getPreviousTask(task)

        return this._isUserAssignee(previousTask) || this._isUserInCandidateGroups(previousTask)
    }

    _updateButtonsThenDispatchAction(buttonType, actionArgs) {
        return this.load(true)
            .then(() => this._dispatchButtonAction(buttonType, actionArgs))
            .finally(() => this.load(true))
    }

    _executeButtonAction(buttonType, actionArgs) {
        const currentTasks = this._getCurrentTasks()
        const actionResult = this._createDefaultButtonActionResult(buttonType)
        const actionPromise = this._updateButtonsThenDispatchAction(buttonType, actionArgs)

        return this._formatActionPromiseResult(actionPromise, actionResult, currentTasks)
    }

    _formatActionPromiseResult(actionPromise, actionResult, currentTasks) {
        return actionPromise
            .then((actionResponse) => {
                this._setActionResultResponse(actionResult, actionResponse)
                this._setActionResultProcessInstance(actionResult)
                this._setActionResultToTasks(actionResult, currentTasks)

                return actionResult
            })
            .catch((error) => {
                this._setActionResultError(actionResult, error)

                return actionResult
            })
    }

    _setActionResultProcessInstance(actionResult) {
        actionResult.processInstance = this.getProcessInstance()
    }

    _setActionResultToTasks(actionResult, currentTasks) {
        actionResult.toTasks = this._getGeneratedTasks(currentTasks)
    }

    _setActionResultResponse(actionResult, actionResponse) {
        actionResult.response = actionResponse
    }

    _setActionResultError(actionResult, error) {
        actionResult.error = error
    }

    _dispatchButtonAction(buttonType, actionArgs) {
        if (this._isDispatchingAction()) {
            throw new Error('Já existe uma ação sendo executada.')
        }

        if (!this._isButtonAllowed(buttonType)) {
            throw new Error('Não foi possível realizar essa ação.')
        }

        this._startDispatchingAction()

        const actionType = this._createButtonActionType(buttonType)

        return this.store.dispatch(actionType, actionArgs).finally(() => this._finishDispatchingAction())
    }

    _isButtonAllowed(buttonType) {
        const components = this.getComponents()
        const button = components.button[buttonType]

        return !button.disabled && button.show
    }

    _createButtonActionType(buttonType) {
        const actionName = buttonType.toUpperCase()

        return actionTypes.BPM[actionName]
    }

    _createDefaultButtonActionResult(buttonType) {
        return {
            action: buttonType,
            fromTask: this.getCurrentTask(),
            toTasks: [],
            processInstance: null,
            response: null,
            error: null,
        }
    }

    _getGeneratedTasks(previousTasks) {
        const currentTasks = this._getCurrentTasks()
        const previousTasksKeys = previousTasks.map((task) => task.key)

        return currentTasks.filter((task) => !previousTasksKeys.includes(task.key))
    }

    _formatUOValue(uo) {
        return uo.id
    }

    _formatUOText(uo) {
        const code = this._formatHierarchyCode(uo.codigoHierarquia)
        const title = this._joinAcronymAndName(uo)

        return `${code} - ${title}`
    }

    _formatHierarchyCode(hierarchyCode) {
        let code = hierarchyCode

        code = code.split('.')
        code = code.map((digits) => parseInt(digits))
        code = code.join('.')

        return code
    }

    _joinAcronymAndName(uo) {
        if (uo.sigla) {
            return `${uo.sigla} - ${uo.nome}`
        }

        return uo.nome
    }
}
