<template>
    <div class="az-search">
        <div class="simple-search" >
            <div class="input-search" :style="inputSearchStyle">
                <v-tooltip top v-for="(val, key) in filter" :key="val.value" v-if="val.value">
                    <v-chip close @input="removeFilter(key)" slot="activator">
                        <strong>{{val.label}}:</strong>&nbsp;
                        <span>{{val.valueTruncated ? val.valueTruncated : val.value}}</span>
                    </v-chip>
                    <span>{{val.label}}: {{val.value}}</span>
                </v-tooltip>
                <input class="input-text" v-model="searchText" :placeholder="simpleSearchPlaceholder"
                       @keyup.enter="simpleSearch()"/>
            </div>
            <v-btn class="icon-search" fab dark small depressed color="primary" @click="simpleSearch()">
                <v-icon small>search</v-icon>
            </v-btn>
        </div>

        <v-btn class="btn-advanced-search" depressed color="grey darken-1" @click="toggle()" v-if="hasAdvancedSearchItems">
            <v-icon small>chevron_left</v-icon>Filtros
        </v-btn>

        <v-navigation-drawer absolute right width="400" v-model="isClosedAdvancedSearch"
                             mini-variant-width="0" floating class="advanced-search-bar">
            <v-toolbar flat class="title" color="primary">
                <v-btn class="btn-close" icon small @click.prevent="toggle()">
                    <v-icon>close</v-icon>
                </v-btn>
                Busca Avançada
            </v-toolbar>
            <div class="items">
                <slot name="search-items"></slot>
            </div>
            <div class="actions">
                <v-btn class="ad-search" depressed color="secondary" @click="advancedSearch()">Buscar</v-btn>
                <a class="ad-clear" @click="clear()">Limpar</a>
            </div>
        </v-navigation-drawer>
    </div>
</template>
<script>
    import mutationTypes from '../../store/mutation-types'

    export default {
        props: {
            filter: {
                type: Object,
                required: true
            },
            simpleSearchPlaceholder: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                hasAdvancedSearchItems: false,
                searchText: null,
                isClosedAdvancedSearch: false,
                isSimpleSearch: false,
                searchTextSize: 200
            }
        },
        mounted() {
            const advancedSearchItems = this.$children[1].$children.filter(child => {
                return child.$options._componentTag === 'az-search-item'
            })
            this.hasAdvancedSearchItems = advancedSearchItems.length > 0
        },
        methods: {
            cancel() {
                this.toggle()
            },
            clear() {
                this.$emit('clear')
            },
            closeAsideMenu() {
                this.$store.state.asideClosed = true
                this.$store.commit(mutationTypes.SET_ASIDE, true)
            },
            removeFilter(key) {
                this.$emit('remove-filter', key)
            },
            simpleSearch() {
                this.$emit('simple-search', this.searchText)
                this.searchText = null
            },
            advancedSearch() {
                this.$emit('advanced-search')
            },
            toggle() {
                this.isClosedAdvancedSearch = !this.isClosedAdvancedSearch
                this.closeAsideMenu()
            }
        },
        computed: {
            inputSearchStyle () {
                let size = (Object.keys(this.filter).length * 180) + this.searchTextSize
                return 'width: ' + size + 'px'
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
            .input-search
                display: flex
                border: 1px solid #ddd
                background-color: #eee
                border-radius: 20px 0 0 20px
                transition: 0.2s
                .v-chip
                    height: 22px
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
        .icon-search
            border-radius: 0 20px 20px 0
            width: 33px
            height 32px
            margin: 0 10px 0 0
            padding: 0
            font-weight normal
        .btn-advanced-search
            border-radius: 20px 0 0 20px
            width: 32px
            height: 32px
            margin: 0
            padding: 0
            text-transform: unset
            color white
            font-weight normal
        .btn-search
            margin-right: 10px
            padding: 5px 10px

            i
                color: rgba(255, 255, 255, 0.8)
                font-size: 13px
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
            .btn-close
                font-size: 20px
                color: rgba(255,255,255,0.8)
                margin-right: 10px

            .items
                height: -webkit-calc(100% - 194px)
                height: -moz-calc(100% - 194px)
                height: calc(100% - 194px)
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
                    color: white
                    font-size: 13px
                    height: 30px
                    margin: 0 10px 0 0
                    text-transform unset
                .ad-clear
                    width: 30%
                    margin-left: 10px
                    color: #777
                    border: 1px solid #777
                    text-align: center
                    padding: 5px
                    font-size: 13px
                    border-radius: 2px
                    &:hover
                        background-color: #777
                        color: white
            .title
                color: rgba(255, 255, 255, 0.8)
                position: fixed
                display: flex
                width: 400px
                height: 60px
                align-items center
                font-size: 18px !important
                font-weight: bold

    @media (max-width: 720px)
        .advanced-search-bar
            display: none
        .btn-advanced-search
            display: none !important
        .btn-search__active
            display: none !important
        .input-search
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
            .icon-search
                margin 0
</style>