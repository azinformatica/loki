<template>
    <div class="az-menu">
        <v-list subheader>
            <div v-for="menu in menuActions" :key="menu.name">
                <v-list-item
                    active-class="active-menu"
                    v-if="!menu.children"
                    :to="menu.path"
                    @click="redirectTo(menu.path)"
                    class="menu-item">
                    <v-list-item-action>
                        <v-tooltip right color="dark-grey" v-if="asideClosed">
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">{{ menu.icon }}</v-icon>
                            </template>
                            <span>{{ menu.name }}</span>
                        </v-tooltip>

                        <v-icon v-else>{{ menu.icon }}</v-icon>
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>{{ menu.name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-group v-else v-model="menu.expanded" no-action :prepend-icon="menu.icon" class="menu-item">
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>{{ menu.name }}</v-list-item-title>
                        </v-list-item-content>
                    </template>

                    <div class="az-submenu" v-if="!asideClosed">
                        <v-list-item
                            v-for="submenu in menu.children"
                            :to="submenu.path"
                            :key="submenu.name"
                            @click="redirectTo(submenu.path)"
                            :class="submenuStyle(submenu)"
                        >
                            <v-list-item-action>
                                <v-icon>{{ submenu.icon }}</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>{{ submenu.name }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </div>
                </v-list-group>
            </div>

            <div class="mobile">
                <v-list class="menu-avatar-mobile">
                    <v-list-item
                        v-for="item in avatarActions"
                        :key="item.title"
                        @click="redirectTo(item.path)"
                        class="item"
                        v-az-auth="item.authorities"
                    >
                        <v-list-item-action>
                            <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title v-text="item.title"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item @click="logout()" class="item">
                        <v-list-item-action>
                            <v-icon>exit_to_app</v-icon>
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title>Sair</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
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
                'az-submenu-item': true,
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

    .v-list-item__title
        color #fff
        font-weight bold

    .v-list-item__action i
        color #fff !important

    &::after
        content ''
        position absolute
        border-top 8px solid transparent
        border-bottom 8px solid transparent
        border-right 10px solid #eee
        left 95%

.v-navigation-drawer--mini-variant .active-menu::after
    left 83%
    opacity 1

.v-navigation-drawer--is-mobile .active-menu::after
    opacity 0
    border none

.menu-avatar-mobile .item
    border-top 1px solid rgba(255, 255, 255, .1)
    border-bottom 1px solid rgba(0, 0, 0, .2)

.v-list__group__items--no-action .v-list-item
    padding-left 0

.az-submenu
    background-color rgba(0, 0, 0, .1)

    .v-list-item
        padding-left 0 !important

    &-item
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

            .v-list-item__action i
                color #fff !important

        .v-list-item:hover
            background-color var(--v-primary-darken1) !important
            transition 0 !important
            color #fff !important
            font-weight bold !important

            .v-list-item__action i
                color #fff !important

.az-menu
    font-size 13px
    height 100%
    overflow-y auto
    overflow-x hidden

    &::-webkit-scrollbar
        width 6px

    &::-webkit-scrollbar-thumb
        background rgba(255, 255, 255, .5)

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

            .v-list-item__action i
                color #fff !important

        &__group
            border-bottom 1px solid rgba(255, 255, 255, .2)

            &--active::before
                background none !important

            .v-list-item
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

                    .v-list-item__action i
                        color #fff !important

        &-item
            height 44px
            padding 0 10px
            color rgba(255, 255, 255, .8)
            transition unset !important
            margin-right 0 !important

            &:hover
                background-color var(--v-primary-darken1) !important
                color #fff !important
                font-weight bold !important

                .v-list-item__action i
                    color #fff !important

                &:not(.v-list-item--active):not(.v-list-item--disabled)
                    color #fff !important

            &__title
                font-size 14px

            &__action
                min-width unset
                padding-right 15px
                padding-left 8px
                margin-right 0 !important
                background-color transparent !important

                .v-icon
                    font-size 18px

            &:not(.v-list-item--active):not(.v-list-item--disabled)
                color rgba(255, 255, 255, .8) !important

        &-group
            &__header
                padding 0
                &__prepend-icon
                    min-width unset
                    padding-right 15px
                    padding-left 8px
                    margin-right 0 !important
                    background-color transparent !important

                    .v-icon
                        font-size 18px

@media (min-width 720px)
    .mobile
        display none
</style>
