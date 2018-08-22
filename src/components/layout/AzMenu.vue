<template>
    <div class="az-menu">
        <v-list subheader>
            <div v-for="menu in menuActions" :key="menu.name">
                <v-list-tile active-class="secondary" dark v-if="!menu.children" :to="menu.path" exact @click="redirectTo(menu.path)" class="menu-item">
                    <v-list-tile-action>
                        <v-icon>{{ menu.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ menu.name }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-group v-else
                              v-model="menu.expanded"
                              no-action>
                    <v-list-tile active-class="secondary" slot="activator">
                        <v-list-tile-action>
                            <v-icon>{{ menu.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ menu.name }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <div class="az-submenu">
                        <v-list-tile active-class="secondary" v-if="!asideClosed" :to="submenu.path" v-for="submenu in menu.children"
                                     :key="submenu.name" @click="redirectTo(submenu.path)">
                            <div class="az-submenu__tile">
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ submenu.name }}</v-list-tile-title>
                                </v-list-tile-content>
                            </div>
                        </v-list-tile>
                    </div>
                </v-list-group>
            </div>
            <div class="mobile">
                <v-list class="menu-avatar-mobile">
                    <v-list-tile v-for="item in avatarActions" :key="item.title" @click="redirectTo(item.path)" class="item">
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
        methods: {
            redirectTo(item) {
                this.$router.push({path: item})
            },
            logout() {
                window.location.href = this.$store.state.loki.product.logoutUrl
            }
        },
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
        }
    }
</script>
<style lang="stylus">
    .menu-avatar-mobile .item
        border-top: 1px solid rgba(255,255,255,.2)
        border-bottom: 1px solid rgba(0,0,0,0.2);

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
            padding-left: 50px
            height: 30px
            border-top: none
            border-bottom: none

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
            &__group
                border-bottom: 1px solid rgba(255, 255, 255, 0.10)
                .v-list
                    &__tile
                        border-top: none
                        border-bottom: none
                        height: 30px
                        &__tile--active
                            background-color: transparent !important
                &__header
                    height: 44px
                    &__prepend-icon
                        padding-right: 10px !important
                    &__append-icon
                        padding: 0 5px 0 0
            &__tile
                height: 44px
                padding: 0 12px
                color: rgba(255, 255, 255, 0.8)
                :hover
                    color: rgba(255, 255, 255, 0.8) !important
                &__title
                    font-size: 14px
                    font-weight: bold
                &__action
                    min-width: unset
                    padding-right: 10px
                    padding-left: 5px
                    i
                        font-size: 20px
    .menu-item
        border-top: 1px solid rgba(255,255,255,.2)
        border-bottom: 1px solid rgba(0,0,0,0.2);
    @media (min-width: 450px)
        .mobile
            display: none
</style>
