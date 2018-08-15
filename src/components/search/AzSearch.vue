<template>
    <div class="az-search">
        <div v-if="(!hasSearch && isClosedAdvancedSearch)" class="simple-search">
            <div class="input_search">
                <input class="input-text" v-model="searchText" :placeholder="simpleSearchPlaceholder"
                       @focus="onFocus()" @blur="onBlur()" @keyup.enter="simpleSearch()"/>
            </div>

            <a class="btn-search" @click="simpleSearch()" v-if="!isSimpleSearch">
                <v-icon small>search</v-icon>
            </a>
            <a class="btn-search__clear-btn" @click="simpleClear()" v-else>
                Limpar
            </a>
        </div>

        <a class="btn-search__clear" @click="advancedClear()" v-if="hasSearch">
            Limpar
        </a>

        <a :class="{'btn-search__active' : hasSearch, 'btn-search__inactive' : !hasSearch}" @click="toggle()">
            <v-icon small>chevron_left</v-icon>
            Filtros
        </a>

        <v-navigation-drawer permanent absolute right width="400" :mini-variant.sync="isClosedAdvancedSearch"
                             mini-variant-width="0" floating>
            <div class="title">
                <a class="fechar" @click="toggle()">
                    <v-icon>close</v-icon>
                </a>
                <span>Busca Avançada</span>
            </div>
            <div class="items">
                <slot name="search-items"></slot>
            </div>
            <div class="actions">
                <a class="ad-search" @click="advancedSearch()">Buscar</a>
                <a class="ad-clear" @click="advancedClear()">Limpar</a>
            </div>
        </v-navigation-drawer>
    </div>
</template>
<script>
    import mutationTypes from '../../store/mutations-types'

    export default {
        props: {
            simpleSearchPlaceholder: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                searchText: null,
                isClosedAdvancedSearch: true,
                isSimpleSearch: false,
                hasSearch: false
            }
        },
        methods: {
            onBlur() {
                document.getElementsByClassName('input_search')[0].classList.remove('extended')
            },
            onFocus() {
                document.getElementsByClassName('input_search')[0].classList.add('extended')
            },
            cancel() {
                this.toggle()
            },
            toggle() {
                this.isClosedAdvancedSearch = !this.isClosedAdvancedSearch
                this.closeAsideMenu()
            },
            closeAsideMenu() {
                this.$store.commit(mutationTypes.SET_ASIDE, true)
            },
            simpleSearch() {
                this.isSimpleSearch = true
                this.$emit('simple-search', this.searchText)
            },
            simpleClear() {
                this.isSimpleSearch = false
                this.searchText = null
                this.$emit('simple-search', this.searchText)
            },
            advancedSearch() {
                this.$emit('advanced-search')
                this.hasSearch = true
            },
            advancedClear() {
                this.$emit('advanced-clear')
                this.hasSearch = false
            }
        },
        watch: {
            searchText: function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    this.isSimpleSearch = false
                }
            }
        }
    }
</script>
<style lang="stylus">
    .az-search
        display: flex
        align-items: center
        .simple-search
            display: flex
            .input_search
                width: 300px
                background-color: #eee
                border-radius: 20px 0 0 20px
                transition: 0.2s
                .input-text
                    height: 30px
                    padding: 10px 15px
                    width: 100%
                    outline: none
                    color: #777777

            .extended
                width: 500px
                background-color: #eee
                border-radius: 20px 0 0 20px
                transition: 0.2s
                .input-text
                    height: 30px
                    padding: 10px 15px
                    width: 100%
                    outline: none
                    color: #777777
            ::placeholder
                color: #cccccc !important
            :-ms-input-placeholder
                color: #cccccc !important
        .btn-search
            margin-right: 10px
            padding: 5px 10px
            background-color: #3a6861
            border-radius: 0 20px 20px 0

            i
                color: rgba(255, 255, 255, 0.8)
                font-size: 13px
                font-weight: bold

            &__clear-btn
                font-size: 14px
                background-color: #d28a2c
                color: white
                font-weight: normal
                margin-right: 10px
                padding: 5px 10px
                border-radius: 0 20px 20px 0

            &__clear
                font-size: 14px
                color: #777
                font-weight: bold
                margin-right: 10px

            &__inactive
                background-color: #777777
                padding: 5px
                border-radius: 20px 0 0 20px
                color: rgba(255, 255, 255, 0.8)

                i
                    color: rgba(255, 255, 255, 0.8)
                    font-size: 16px
                    font-weight: bold

            &__active
                background-color: #d28a2c
                padding: 5px
                border-radius: 20px 0 0 20px
                color: rgba(255, 255, 255, 0.8)

                i
                    color: rgba(255, 255, 255, 0.8)
                    font-size: 16px
                    font-weight: bold

        .v-navigation-drawer
            height: 100%
            margin-top: 60px !important
            -webkit-transform: translateX(0px)
            transform: translateX(0px)
            width: 400px
            padding: 0
            overflow-y: hidden
            position: fixed
            border-left: 1px solid #ddd
            .items
                height: -webkit-calc(100% - 194px);
                height: -moz-calc(100% - 194px);
                height: calc(100% - 194px);
                overflow-y: auto
                margin: 75px 0 70px 0
            .actions
                padding: 15px
                position: fixed
                bottom: 60px
                height: 60px
                width: 400px
                right: 0
                display: flex
                border-top: 1px solid #eee
                .ad-search
                    width: 70%
                    margin-right: 10px
                    background-color: #D28A2C
                    color: white
                    border: 1px solid #D28A2C
                    text-align: center
                    padding: 5px
                    font-size: 13px
                    border-radius: 2px
                    &:hover
                        background-color: lighten(#D28A2C,10%)
                        border: 1px solid lighten(#D28A2C,10%)
                .ad-clear
                    width: 30%
                    margin-left: 10px
                    color: #777
                    border: 1px solid #777
                    text-align: center
                    padding: 5px
                    font-size: 13px
                    border-radius: 2px
                    margin: 0
                    &:hover
                        background-color: #777
                        color: white
            .title
                background-color: #3a6861
                color: rgba(255, 255, 255, 0.8)
                position: fixed
                display: flex
                top: 0
                right: 0
                text-align: center
                width: 400px
                height: 60px
                align-items center
                a
                    width: 10%
                    i
                        font-size: 18px
                        color: rgba(255, 255, 255, 0.8)
                        font-weight: bold
                span
                    padding: 20px
                    font-size: 14px
                    font-weight: bold
                    width: 90%

    @media (max-width: 450px)
        .btn-search__inactive
            display: none !important
        .btn-search__active
            display: none !important
        .input_search
            width: 100% !important
        .simple-search
            width: 100%
        .btn-search
            padding: 5px 10px
            margin-right: 0 !important
        .search
            position: absolute
            right: unset !important
            top: 15px
            display: -webkit-box
            display: -ms-flexbox
            display: flex
            width: 100%
            padding: 0 20px
        .az-search
            width: 100%
</style>
