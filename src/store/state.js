export default {
    productId: 1,
    productName: 'bla',
    mainLogo: 'https://svgshare.com/i/6Zz.svg',
    symbolLogo: 'https://svgshare.com/i/6_V.svg',
    version: '1.2.3',
    copywrite: 'AZ Informática',
    pageTitle: 'Home',
    pageSubtitle: 'Subtitulo',
    userName: 'Charles Viegas',
    asideClosed: false,
    userPhoto: 'https://lh3.googleusercontent.com/-TKlOasafxO8/AAAAAAAAAAI/AAAAAAAAAAA/AIcfdXC20RzAXx8TwvxtQTffQy4nmmArow/s32-c-mo/photo.jpg',
    avatarActions: {
        1: { title: "Profile", icon: 'star', path: '/profile'
        },
        2: { title: "Settings", icon: 'settings', path: '/settings'
        }
    },
    menuActions: [
        {
            name: 'Início',
            icon: 'home',
            path: '/',
            selected: false,
        },
        {
            name: 'Licitações',
            icon: 'menu',
            path: '/formulario',
            selected: false,
        },
        {
            name: 'Cadastro básico',
            icon: 'settings',
            path: '/cadastro',
            expanded: false,
            children: [
                {
                    name: 'Órgão',
                    icon: '',
                    path: '/cadastro/orgao',
                    selected: false
                },
                {
                    name: 'Usuário',
                    icon: '',
                    path: '/cadastro/usuario',
                    selected: false
                }
            ]
        },
        {
            name: 'Relatórios',
            icon: 'insert_chart',
            path: '/relatorio',
            expanded: false,
            children: [
                {
                    name: 'Pregão',
                    icon: '',
                    path: '/relatorio/pregao',
                    selected: false,
                    expanded: false,
                },
                {
                    name: 'Pregão 2',
                    icon: '',
                    path: '/relatorio/pregao 2',
                    selected: false,
                    expanded: false,
                },
                {
                    name: 'Pregão 3',
                    icon: '',
                    path: '/relatorio/pregao 3',
                    selected: false,
                    expanded: false,
                }
            ]
        }
    ]
}
