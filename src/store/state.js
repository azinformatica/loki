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
        1: { title: "Profile", icon: 'star', path: '/profile'
        },
        2: { title: "Settings", icon: 'settings', path: '/settings'
        }
    },
    menuActions: [],
    notification: {},

    filesApi: '/public/arquivos',
    uploadFileProgress: {},
    uploadedFiles: [],

    isGlobalLoadingEnabled: true,
    isLoading: false,
    loadingMessage: 'Please, wait...',

    timezone: 'America/Sao_Paulo',
    offset: '-03:00'

}
