<template>
    <div class="az-menu">
        <v-list subheader>
            <div v-for="menu in menuActions" :key="menu.name">
                <v-list-tile
                    active-class="active-menu"
                    dark
                    v-if="!menu.children"
                    @click="redirectTo(menu.path)"
                    class="menu-item"
                >
                    <v-list-tile-action>
                        <v-tooltip right color="dark-grey" v-if="asideClosed">
                            <v-icon slot="activator">{{ menu.icon }}</v-icon>
                            <span>{{ menu.name }}</span>
                        </v-tooltip>
                        <v-icon v-else>{{ menu.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ menu.name }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-group v-else v-model="menu.expanded" no-action class="menu-item">
                    <v-list-tile active-class="active-menu" slot="activator">
                        <v-list-tile-action>
                            <v-icon>{{ menu.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ menu.name }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <div class="az-submenu">
                        <v-list-tile
                            v-for="submenu in menu.children"
                            :to="submenu.path"
                            :key="submenu.name"
                            @click="redirectTo(submenu.path)"
                            :class="submenuStyle(submenu)"
                        >
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
                    <v-list-tile
                        v-for="item in avatarActions"
                        :key="item.title"
                        @click="redirectTo(item.path)"
                        class="item"
                        v-az-auth="item.authorities"
                    >
                        <v-list-tile-action>
                            <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title v-text="item.title" />
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
            this.$router.push({ path: item })
        },
        submenuStyle(submenu) {
            return {
                'az-submenu__tile': true,
                'active-menu': this.isMenuItemActive(submenu)
            }
        }
    }
}
</script>
<style lang="stylus">
.active-menu
    color #fff !important
    font-weight bold !important
    background-color var(--v-primary-darken1) !important

    &::after
        content ''
        position absolute
        border-top 8px solid transparent
        border-bottom 8px solid transparent
        border-right 10px solid #eee
        right 0

    .v-list__tile__title
        color #fff
        font-weight bold

    .v-list__tile__action i
        color #fff !important

.v-navigation-drawer--mini-variant .active-menu::after
    left 83%
    opacity 1

.v-navigation-drawer--is-mobile .active-menu::after
    opacity 0
    border none

.menu-avatar-mobile .item
    border-top 1px solid rgba(255, 255, 255, .1)
    border-bottom 1px solid rgba(0, 0, 0, .2)

.az-menu
    height 100%
    overflow-y auto
    overflow-x hidden

.v-list__group__items--no-action .v-list__tile
    padding-left 0

.az-menu::-webkit-scrollbar
    width 6px

.az-menu::-webkit-scrollbar-thumb
    background rgba(255, 255, 255, .5)

.az-submenu
    background-color rgba(0, 0, 0, .1)

    .v-list__tile
        padding-left 0 !important

    &__tile
        padding-top 3px
        padding-left 25px
        height 35px
        border-top none
        border-bottom none

        &:hover
            background-color var(--v-primary-darken1) !important
            transition 0 !important
            color #fff !important
            font-weight bold !important

            .v-list__tile__action i
                color #fff !important

        .v-list__tile:hover
            background-color var(--v-primary-darken1) !important
            transition 0 !important
            color #fff !important
            font-weight bold !important

            .v-list__tile__action i
                color #fff !important

.az-menu
    font-size 13px

    .icon
        color rgba(255, 255, 255, .5)

    .primary--text
        color rgba(255, 255, 255, .5) !important

    .material-icons
        font-size 20px
        color rgba(255, 255, 255, .5) !important

    .v-list
        padding 0

        a:hover
            background-color var(--v-primary-darken1) !important
            color #fff !important
            font-weight bold !important

            .v-list__tile__action i
                color #fff !important

        &__group
            border-bottom 1px solid rgba(255, 255, 255, .2)

            &--active::before
                background none !important

            .v-list__tile
                border-top none
                border-bottom none
                height 30px

            &__header
                height 44px

                &__prepend-icon
                    padding-right 10px !important

                &__append-icon
                    padding 0 5px 0 0

                &:hover
                    background-color var(--v-primary-darken1) !important
                    color #fff !important
                    font-weight bold !important

                    .v-list__tile__action i
                        color #fff !important

        &__tile
            height 44px
            padding 0 10px
            color rgba(255, 255, 255, .8)
            transition unset !important

            &:hover
                background-color var(--v-primary-darken1) !important
                color #fff !important
                font-weight bold !important

                .v-list__tile__action i
                    color #fff !important

            &__title
                font-size 14px

            &__action
                min-width unset
                padding-right 20px
                padding-left 8px
                background-color none !important

                i
                    font-size 20px

@media (min-width 720px)
    .mobile
        display none
</style>
