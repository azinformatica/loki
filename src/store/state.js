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
        1: { title: "Profile", icon: 'person', path: '/profile'
        },
        2: { title: "Settings", icon: 'settings', path: '/settings'
        }
    },
    menuActions: [],
    alert: {},

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
    }

}
