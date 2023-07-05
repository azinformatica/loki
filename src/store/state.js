export default {
    product: {
        id: null,
        name: '',
        mainLogo: '',
        symbolLogo: '',
        version: '',
        copywrite: '',
        logoutUrl: '/logout',
    },

    page: {
        title: '',
        subtitle: '',
    },

    user: {
        name: '',
        fullName: '',
        photo: '',
    },

    asideClosed: false,
    asideHide: true,
    avatarActions: {
        1: { title: 'Profile', icon: 'mdi-account', path: '/profile' },
        2: { title: 'Settings', icon: 'mdi-cogs', path: '/settings' },
    },
    autoSave: {
        show: false,
        saving: false,
        savingMessage: '<i class="mdi mdi-loading mdi-spin mr-1"></i> Salvando...',
        autoSavedMessage: '<i class="mdi mdi-check mr-1"></i> Salvo Automaticamente',
        autoSavedDescription: 'Salvo ${date} atrás',
    },
    menuActions: [],
    alert: {},
    rollback: false,

    file: {
        api: '/public/arquivos',
        maxSize: '16Mb',
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
        title: 'Notificações',
        endNotificationText: 'Fim das notificações.',
        noNotificationText: 'Nenhuma notificação encontrada...',
        viewMoreText: 'Ver mais',
        notificationIcon: 'mdi-bell',
        whenIcon: 'mdi-alarm',
        closeIcon: 'mdi-close',
        allowLoadingViewMore: false,
        closeMenuOnVisit: false,
    },

    document: {
        pageContainer: {
            height: 0,
            width: 0,
        },
        pages: [],
        paginator: {
            currentPageNum: '-',
            totalPageNum: '-',
        },
        renderedPages: [],
        scale: {
            current: 1.5,
            default: 1.0,
            max: 3.0,
        },
    },

    flowbee: {
        accessToken: null,
        license: null,
    },

    bpm: {
        api: 'api/bpm',
        process: {},
    },

    keycloak: {
        accessToken: null,
    },
}
