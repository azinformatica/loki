<template>
    <v-toolbar-items class="az-avatar">
        <v-menu class="hidden-xs-only" bottom="bottom" left="left" offset-y="offset-y" attach="attach">
            <v-btn class="az-avatar__username" slot="activator" flat="flat" :color="color">
                <div class="infos">
                    <div class="name">{{ userName }}</div>
                    <div class="plan" v-if="plan">{{plan}}</div>
                </div>
                <v-icon right="right">keyboard_arrow_down</v-icon>
            </v-btn>
            <v-list>
                <v-list-tile v-for="item in avatarActions" :key="item.title" @click="redirectTo(item.path)"
                             v-az-auth="item.authorities" :class="{'item-html': item.isHtml }">
                    <v-list-tile-action v-if="!item.isHtml">
                        <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="logout()" class="az-avatar__logout">
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Sair</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-menu>
        <v-avatar v-if="userName" class="az-avatar__picture" size="32px">
            <v-icon medium v-if="!userPhoto" :color="color">account_circle</v-icon>
            <img v-if="userPhoto" :src="userPhoto" alt="Foto do usuário"/>
        </v-avatar>
    </v-toolbar-items>
</template>
<script>
    export default {
        props: {
            color: {
                type: String,
                default: '#777'
            }
        },
        computed: {
            userPhoto() {
                return this.$store.state.loki.user.photo
            },
            userName() {
                return this.$store.state.loki.user.name
            },
            avatarActions() {
                return this.$store.state.loki.avatarActions
            },
            plan() {
                return this.$store.state.loki.user.plan
            }
        },
        methods: {
            redirectTo(item) {
                this.$router.push({path: item})
            },
            logout() {
                window.location.href = this.$store.state.loki.product.logoutUrl
            }
        }
    }
</script>
<style lang="stylus">
    .az-avatar
        position unset
        top 0
        right 20px
        display block
        font-size 14px
        align-items center
        &__logout
            border-top 1px solid #ccc

        &__username
            margin-right 10px
            text-align end
            .infos
                display block
                margin-right 5px
                .plan
                    font-size 10px
                    opacity 0.7

        &__picture
            margin-right 0

        .v-btn
            text-transform none
            .v-icon--right
                margin-left 0

            &__content
                font-weight normal
                font-size 14px
                i
                    color #777777

        .v-list
            padding 0
            &__tile
                color #7f7f7f
                height 38px
                &__title
                    font-size 14px

                &__action
                    min-width unset
                    padding-right 10px
                    .material-icons
                        font-size 13px

        .item-html
            .v-list
                &__tile
                    height auto
                    padding 0
                    &__title
                        height auto
                        overflow auto
                &__tile--link
                    cursor initial

    @media (max-width: 720px)
        .az-avatar
            display none !important
</style>
