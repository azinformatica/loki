export default {
    DOCUMENT: {
        CLEAR_RENDER_CONTEXT: 'clearRenderContex',
        CLEAR_RENDERED_PAGES: 'clearRenderedPages',
        DECREASE_SCALE: 'decreaseScale',
        FETCH_DOCUMENT: 'fetchDocument',
        INCREASE_SCALE: 'increaseScale',
        RENDER_PAGE: 'renderPage',
        RESTORE_SCALE: 'restoreScale',
        UPDATE_CURRENT_PAGE_NUM: 'updateCurrentPageNum',
        UPDATE_PAGE_CONTAINER: 'updatePageContainer',
        UPDATE_RENDERED_PAGES: 'updateRenderedPages',
    },
    SIGNATURE: {
        DIGITAL: {
            START: 'startDigitalSignature',
            FINISH: 'finishDigitalSignature',
        },
    },
    BPM: {
        GET_PROCESS_LOGS: 'getProcessLogs',
        GET_PROCESS_INSTANCE: 'getProcessInstance',
        GET_USER_TASKS: 'getUserTasks',
        ROUTE: 'routeToTask',
        CLAIM: 'getTaskAccess',
        UNCLAIM: 'releaseTaskAccess',
        COMPLETE: 'goToNextTask',
        UNCOMPLETE: 'goToPreviousTask',
    },
    UO: {
        FIND_ALL_ACTIVE: 'findAllActiveUOs',
    },
}
