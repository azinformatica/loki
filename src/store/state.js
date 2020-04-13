export default {
    product: {
        id: null,
        name: '',
        mainLogo: '',
        symbolLogo: '',
        version: '',
        copywrite: '',
        logoutUrl: '/logout'
    },

    page: {
        title: '',
        subtitle: ''
    },

    user: {
        name: '',
        fullName: '',
        photo: ''
    },

    asideClosed: false,
    asideHide: true,
    avatarActions: {
        1: { title: 'Profile', icon: 'person', path: '/profile' },
        2: { title: 'Settings', icon: 'settings', path: '/settings' }
    },
    autoSave: {
        show: false,
        saving: false,
        savingMessage: '<i class="fas fa-redo fa-spin mr-1"></i> Salvando...',
        autoSavedMessage: '<i class="fas fa-check mr-1"></i> Salvo Automaticamente',
        autoSavedDescription: 'Salvo ${date} atrás'
    },
    menuActions: [],
    alert: {},
    rollback:false,

    file: {
        api: '/public/arquivos',
        maxSize: '16Mb'
    },
    uploadFileProgress: {},
    uploadedFiles: [],

    isGlobalLoadingEnabled: true,
    isLoading: false,
    loadingMessage: 'Please, wait...',

    timezone: 'America/Sao_Paulo',
    offset: '-03:00',

    notification: {},
    notificationConfig: {
        refreshTimeout: 30 * 1000,
        activeFilter: 'Todas',
        filters: ['Todas', 'Lidas', 'Não Lidas'],
        title: 'Notificações'
    },

    document: {
        pageContainer: {
            height: 0,
            width: 0
        },
        pages: [],
        paginator: {
            currentPageNum: '-',
            totalPageNum: '-'
        },
        renderedPages: [],
        scale: {
            current: 1.5,
            default: 1.0,
            max: 3.0
        }
    }
}
