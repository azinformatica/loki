import { actionTypes, mutationTypes } from '../../store'

export default class AzBpmProcess {
    constructor(store, processKey, businessKey) {
        this.store = store
        this.processKey = processKey
        this.businessKey = businessKey

        this.initialize()
    }

    getProcess() {
        const bpm = this.store.state.loki.bpm || {}
        const bpmAtProcessKey = bpm[this.processKey] || {}

        return bpmAtProcessKey[this.businessKey] || {}
    }

    getProcessInstance() {
        const process = this.getProcess()

        return process.instance || null
    }

    isLoadingProcess() {
        const process = this.getProcess()

        return process.isLoading || false
    }

    hasAuthority(authorities = []) {
        return (
            !this.isLoadingProcess() &&
            this._hasValidStatusInstance() &&
            this._hasSomeValidAuthority(authorities) &&
            this._isUserCandidate()
        )
    }

    load() {
        return this.store.dispatch(actionTypes.BPM.GET_PROCESS_INSTANCE, this._getProcessParams())
    }

    initialize() {
        return this.store.commit(mutationTypes.BPM.INITIALIZE_PROCESS_INSTANCE, this._getProcessParams())
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

    _hasValidStatusInstance() {
        return this._isStatusInstanceActive && this._hasAssignee
    }

    _isStatusInstanceActive() {
        const status = this._getProcessInstanceStatus()

        return status === 'ACTIVE'
    }

    _getProcessInstanceStatus() {
        const processInstance = this.getProcessInstance()

        return (processInstance && processInstance.statusInstance) || ''
    }

    _hasAssignee() {
        const assignee = this._getAssignee()

        return Boolean(assignee)
    }

    _getAssignee() {
        const currentTask = this._getCurrentTask()

        return currentTask.assignee || null
    }

    _getCurrentTask() {
        const processInstance = this.getProcessInstance()

        return (processInstance && processInstance.currentTask) || {}
    }

    _hasSomeValidAuthority(authorities = []) {
        const validUserAuthorities = this._getValidUserAuthorities(authorities)

        return validUserAuthorities.length > 0
    }

    _getValidUserAuthorities(authorities = []) {
        const userAuthorities = this._getUserAuthorities()

        return userAuthorities.filter((authority) => this._isAuthorityValid(authority, authorities))
    }

    _getUserAuthorities() {
        const user = this._getUser()

        return user.authorities || []
    }

    _isAuthorityValid(authority, authorities = []) {
        return (
            this._isAuthorityWithAccess(authority) &&
            this._isAuthorityPresentInProps(authority, authorities) &&
            !this._isAuthorityRevoked(authority)
        )
    }

    _isAuthorityWithAccess(authority) {
        return authority.hasAccess
    }

    _isAuthorityPresentInProps(authority, authorities = []) {
        return !authorities.length || authorities.includes(authority.name)
    }

    _isAuthorityRevoked(authority) {
        const revokedAuthorities = this._getRevokedAuthorities()

        return revokedAuthorities.length && revokedAuthorities.includes(authority.name)
    }

    _getRevokedAuthorities() {
        const currentTask = this._getCurrentTask()
        const revokedPermissions = currentTask.revokedPermissions || ''

        return this._splitCommaSeparatedTextToArray(revokedPermissions)
    }

    _splitCommaSeparatedTextToArray(text) {
        return text.replace(/\s+/g, '').split(',').filter(Boolean)
    }

    _isUserCandidate() {
        return this._isUserInCandidateUsers() || this._isUserInCandidateGroups()
    }

    _isUserInCandidateUsers() {
        const candidateUsers = this._getCandidateUsers()
        const user = this._getUser()

        return candidateUsers.includes(user.name)
    }

    _getCandidateUsers() {
        const currentTask = this._getCurrentTask()

        return currentTask.candidateUsers || []
    }

    _isUserInCandidateGroups() {
        const userRoles = this._getUserRoles()
        const candidateGroups = this._getCandidateGroups()

        return userRoles.some((role) => candidateGroups.includes(role))
    }

    _getUserRoles() {
        const user = this._getUser()

        return user.roles || []
    }

    _getCandidateGroups() {
        const currentTask = this._getCurrentTask()

        return currentTask.candidateGroups || []
    }
}
