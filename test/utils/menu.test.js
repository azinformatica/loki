import menu from '../../src/utils/az-menu'

describe('menu.test.js', () => {
    let store

    beforeEach(() => {
        store = {
            state: {
                loki: {
                    product: {
                        id: 150
                    },
                    user: {
                        authorities: [
                            {
                                name: 'A',
                                hasAccess: true,
                                produtoId: 150
                            },
                            {
                                name: 'B',
                                hasAccess: true,
                                produtoId: 150
                            },
                            {
                                name: 'C',
                                hasAccess: true,
                                produtoId: 0
                            },
                            {
                                name: 'D',
                                hasAccess: false,
                                produtoId: 150
                            }
                        ]
                    }
                }
            }
        }
    })

    describe('empty returns', () => {
        it('should create a empty object for empty router', () => {
            const router = { options: { routes: [] } }
            expect(menu(store, router)).toEqual([])
        })

        it('should create a empty object for router without meta object', () => {
            const router = {
                options: {
                    routes: [
                        {
                            path: '/a',
                            name: 'a'
                        },
                        {
                            path: '/b',
                            name: 'b'
                        }
                    ]
                }
            }
            expect(menu(store, router)).toEqual([])
        })

        it('should create a empty object for router without menu in meta object', () => {
            const router = {
                options: {
                    routes: [
                        {
                            path: '/a',
                            name: 'a',
                            meta: {
                                page: {
                                    title: 'a',
                                    subtitle: 'a'
                                }
                            }
                        },
                        {
                            path: '/b',
                            name: 'b',
                            meta: {
                                page: {
                                    title: 'b',
                                    subtitle: 'b'
                                }
                            }
                        }
                    ]
                }
            }
            expect(menu(store, router)).toEqual([])
        })
    })

    describe('nenu one level', () => {
        it('should create one level menu for all routes with menu in meta object', () => {
            const router = {
                options: {
                    routes: [
                        {
                            path: '/a',
                            name: 'a',
                            meta: {
                                menu: {
                                    title: 'a',
                                    icon: 'a'
                                }
                            }
                        },
                        {
                            path: '/b',
                            name: 'b',
                            meta: {
                                menu: {
                                    title: 'b',
                                    icon: 'b'
                                }
                            }
                        }
                    ]
                }
            }
            const expectedMenu = [
                {
                    name: 'a',
                    icon: 'a',
                    path: '/a',
                    selected: false
                },
                {
                    name: 'b',
                    icon: 'b',
                    path: '/b',
                    selected: false
                }
            ]
            expect(menu(store, router)).toEqual(expectedMenu)
        })

        it('should create one level menu for all routes with menu in meta object and current user has permission', () => {
            const router = {
                options: {
                    routes: [
                        {
                            path: '/a',
                            name: 'a',
                            meta: {
                                menu: {
                                    title: 'a',
                                    icon: 'a'
                                },
                                authorities: ['A']
                            }
                        },
                        {
                            path: '/b',
                            name: 'b',
                            meta: {
                                menu: {
                                    title: 'b',
                                    icon: 'b'
                                },
                                authorities: ['A', 'B']
                            }
                        }
                    ]
                }
            }
            const expectedMenu = [
                {
                    name: 'a',
                    icon: 'a',
                    path: '/a',
                    selected: false
                },
                {
                    name: 'b',
                    icon: 'b',
                    path: '/b',
                    selected: false
                }
            ]
            expect(menu(store, router)).toEqual(expectedMenu)
        })

        it('should create one level menu just one route because current user has not permission', () => {
            const router = {
                options: {
                    routes: [
                        {
                            path: '/a',
                            name: 'a',
                            meta: {
                                menu: {
                                    title: 'a',
                                    icon: 'a'
                                },
                                authorities: ['A']
                            }
                        },
                        {
                            path: '/d',
                            name: 'd',
                            meta: {
                                menu: {
                                    title: 'd',
                                    icon: 'd'
                                },
                                authorities: ['D']
                            }
                        }
                    ]
                }
            }
            const expectedMenu = [
                {
                    name: 'a',
                    icon: 'a',
                    path: '/a',
                    selected: false
                }
            ]
            expect(menu(store, router)).toEqual(expectedMenu)
        })

        it('should create one level menu just one route because current user has a permission for another productId', () => {
            const router = {
                options: {
                    routes: [
                        {
                            path: '/a',
                            name: 'a',
                            meta: {
                                menu: {
                                    title: 'a',
                                    icon: 'a'
                                },
                                authorities: ['A']
                            }
                        },
                        {
                            path: '/c',
                            name: 'c',
                            meta: {
                                menu: {
                                    title: 'c',
                                    icon: 'c'
                                },
                                authorities: ['C']
                            }
                        }
                    ]
                }
            }
            const expectedMenu = [
                {
                    name: 'a',
                    icon: 'a',
                    path: '/a',
                    selected: false
                }
            ]
            expect(menu(store, router)).toEqual(expectedMenu)
        })
    })

    describe('nenu two levels', () => {
        it('should create two levels menu for all routes with menu in meta object', () => {
            const router = {
                options: {
                    routes: [
                        {
                            path: '/a',
                            name: 'a',
                            meta: {
                                menu: {
                                    title: 'a',
                                    icon: 'a'
                                },
                                authorities: ['A', 'B']
                            },
                            children: [
                                {
                                    path: '/a1',
                                    name: 'a1',
                                    meta: {
                                        menu: {
                                            title: 'a1',
                                            icon: 'a1'
                                        },
                                        authorities: ['A']
                                    }
                                },
                                {
                                    path: '/a2',
                                    name: 'a2',
                                    meta: {
                                        menu: {
                                            title: 'a2',
                                            icon: 'a2'
                                        },
                                        authorities: ['B']
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
            const expectedMenu = [
                {
                    name: 'a',
                    icon: 'a',
                    path: '/a',
                    selected: false,
                    expanded: false,
                    children: [
                        {
                            name: 'a1',
                            icon: 'a1',
                            path: '/a1',
                            selected: false
                        },
                        {
                            name: 'a2',
                            icon: 'a2',
                            path: '/a2',
                            selected: false
                        }
                    ]
                }
            ]
            expect(menu(store, router)).toEqual(expectedMenu)
        })
    })
})
