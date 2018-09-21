<template>
    <div class="az-menu">
        <v-list subheader>
            <div v-for="menu in menuActions" :key="menu.name">
                <v-list-tile active-class="secondary" dark v-if="!menu.children" :to="menu.path" exact
                             @click="redirectTo(menu.path)" class="menu-item">
                    <v-list-tile-action>
                        <v-icon>{{ menu.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ menu.name }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-group v-else
                              v-model="menu.expanded"
                              no-action class="menu-item">
                    <v-list-tile active-class="secondary" slot="activator">
                        <v-list-tile-action>
                            <v-icon>{{ menu.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ menu.name }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <div class="az-submenu">
                        <v-list-tile v-if="!asideClosed" :to="submenu.path" v-for="submenu in menu.children"
                                     :key="submenu.name" @click="redirectTo(submenu.path)"
                                     :class="submenuStyle(submenu)">
                            <v-list-tile-action>
                                <v-icon>{{ submenu.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ submenu.name }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </div>
                </v-list-group>
            </div>
            <div class="mobile">
                <v-list class="menu-avatar-mobile">
                    <v-list-tile v-for="item in avatarActions" :key="item.title" @click="redirectTo(item.path)"
                                 class="item">
                        <v-list-tile-action>
                            <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title v-text="item.title"></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="logout()" class="item">
                        <v-list-tile-action>
                            <v-icon>exit_to_app</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Sair</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </div>
        </v-list>
    </div>
</template>
<script>
    export default {
        computed: {
            menuActions() {
                return this.$store.state.loki.menuActions
            },
            asideClosed() {
                return this.$store.state.loki.asideClosed
            },
            avatarActions() {
                return this.$store.state.loki.avatarActions
            }
        },
        mounted() {
            const currentActiveMenu = this.getCurrentActiveMenu()
            if (this.hasChildren(currentActiveMenu)) {
                this.expand(currentActiveMenu)
            }
        },
        methods: {
            expand(currentActiveMenu) {
                currentActiveMenu.expanded = true
            },
            getCurrentActiveMenu() {
                for (let i = 0; i < this.menuActions.length; i++) {
                    const menu = this.menuActions[i]
                    if (this.isMenuItemActive(menu) || this.isSubmenuActive(menu)) {
                        return menu
                    }
                }
                return undefined
            },
            hasChildren(menu) {
                return menu && menu.children && menu.children.length > 0
            },
            isMenuItemActive(menuItem) {
                return this.$route.path === menuItem.path
            },
            isSubmenuActive(menu) {
                if (!this.hasChildren(menu)) {
                    return false
                }
                for (let i = 0; i < menu.children.length; i++) {
                    const submenu = menu.children[i]
                    if (this.isMenuItemActive(submenu)) {
                        return true
                    }
                }
                return false
            },
            logout() {
                window.location.href = this.$store.state.loki.product.logoutUrl
            },
            redirectTo(item) {
                this.$router.push({path: item})
            },
            submenuStyle(submenu) {
                return {
                    'az-submenu__tile': true,
                    'secondary': this.isMenuItemActive(submenu)
                }
            }
        }
    }
</script>
<style lang="stylus">
    .menu-avatar-mobile .item
        border-top: 1px solid rgba(255, 255, 255, .1)
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);

    .az-menu
        height: 100%
        overflow-y: auto
        overflow-x: hidden

    .v-list__group__items--no-action .v-list__tile
        padding-left: 0

    .az-menu::-webkit-scrollbar
        width: 6px

    .az-menu::-webkit-scrollbar-thumb
        background: rgba(255, 255, 255, 0.5)

    .az-submenu
        background-color: rgba(0, 0, 0, 0.1)
        &__tile
            padding-top: 3px
            padding-left: 25px
            height: 35px
            border-top: none
            border-bottom: none
            &:hover
                background-color lighten(#d79641, 20%) !important
                transition: 0 !important

            .v-list__tile:hover
                background-color lighten(#d79641, 20%) !important
                transition: 0 !important

    .az-menu
        font-size: 13px
        .icon
            color: rgba(255, 255, 255, 0.8)
        .primary--text
            color: rgba(255, 255, 255, 0.8) !important
        .material-icons
            font-size: 20px
            color: rgba(255, 255, 255, 0.8)
        .v-list
            padding: 0
            a:hover
                color: rgba(255, 255, 255, 0.8) !important
                background-color lighten(#d79641, 20%) !important
            &__group
                border-bottom: 1px solid rgba(255, 255, 255, 0.2)
                &--active::before
                    background none !important
                .v-list
                    &__tile
                        border-top: none
                        border-bottom: none
                        height: 30px

                &__header
                    height: 44px
                    &__prepend-icon
                        padding-right: 10px !important
                    &__append-icon
                        padding: 0 5px 0 0
                    &:hover
                        background-color: lighten(#d79641, 20%) !important
            &__tile
                height: 44px
                padding: 0 12px
                color: rgba(255, 255, 255, 0.8)
                transition unset !important
                &:hover
                    background-color lighten(#d79641, 20%) !important
                &__title
                    font-size: 14px
                &__action
                    min-width: unset
                    padding-right: 10px
                    padding-left: 5px
                    background-color: none !important
                    i
                        font-size: 20px

    .menu-item
        border-bottom: 1px solid rgba(255, 255, 255, .2)

    @media (min-width: 720px)
        .mobile
            display: none
</style>
