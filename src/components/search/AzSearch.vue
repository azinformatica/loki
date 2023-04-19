<template>
    <div class="az-search">
        <div class="simple-search">
            <div class="input-search" :style="inputSearchStyle">
                <v-tooltip top v-for="(val, key) in filledFilters" :key="val.value">
                    <template v-slot:activator="{ on }">
                        <v-chip close @click:close="removeFilter(key)" v-on="on" small>
                            <strong>{{ val.label }}:</strong>&nbsp;<span>{{
                                val.valueTruncated ? val.valueTruncated : val.value
                            }}</span>
                        </v-chip>
                    </template>
                    <span>{{ val.label }}: {{ val.value }}</span>
                </v-tooltip>

                <input
                    class="input-text"
                    v-model="searchText"
                    :maxlength="maxlengthInput"
                    :placeholder="simpleSearchPlaceholder"
                    @keyup.enter="simpleSearch()"
                />
            </div>

            <v-btn class="icon-search" fab dark small depressed color="primary" @click="simpleSearch()">
                <v-icon small>mdi-magnify</v-icon>
            </v-btn>
        </div>

        <v-btn
            class="btn-advanced-search"
            depressed
            color="primary"
            @click="toggle()"
            v-if="hasAdvancedSearchItems"
        >
            <v-icon small>mdi-chevron-left</v-icon>Filtros
        </v-btn>

        <v-navigation-drawer
            absolute
            right
            width="340"
            v-model="isClosedAdvancedSearch"
            mini-variant-width="0"
            floating
            class="advanced-search-bar"
        >
            <v-toolbar flat class="title" color="primary">
                <v-btn class="btn-close" icon small @click.prevent="toggle()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                Busca Avançada
            </v-toolbar>

            <div class="items">
                <slot name="search-items"></slot>
            </div>

            <div class="actions">
                <v-btn class="ad-search" depressed color="primary" @click="advancedSearch()">Buscar</v-btn>
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
            required: true,
        },
        maxlengthInput: {
            type: Number,
            default: 65,
        },
        simpleSearchPlaceholder: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            hasAdvancedSearchItems: false,
            searchText: null,
            isClosedAdvancedSearch: false,
            isSimpleSearch: false,
            searchTextSize: 200,
        }
    },
    computed: {
        inputSearchStyle() {
            let size = Object.keys(this.filter).length * 100 + this.searchTextSize
            return 'width: ' + size + 'px'
        },
        filledFilters() {
            return Object.keys(this.filter)
                .filter((key) => this.filter[key].value)
                .reduce((obj, key) => {
                    obj[key] = this.filter[key]
                    return obj
                }, {})
        },
    },
    mounted() {
        const advancedSearchItems = this.$children[1].$children.filter((child) => {
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
        },
    },
}
</script>

<style lang="stylus">
.az-search
    display flex
    align-items center

    .v-overlay__scrim
        opacity 0 !important
        background-color transparent !important
        border-color  transparent !important

    .simple-search
        display flex

        .input-search
            display flex
            border 1px solid #ddd
            background-color #eee
            border-radius 20px 0 0 20px
            transition .2s
            align-items center

            .v-chip
                max-width none
                padding 0 10px
                overflow initial
                margin-left 5px

            .input-text
                height 30px
                padding 10px 15px
                width 100%
                outline none
                color #777777
                font-size 14px

        ::placeholder
            color #cccccc !important

        :-ms-input-placeholder
            color #cccccc !important

    .icon-search
        border-radius 0 20px 20px 0
        width 33px
        height 32px
        margin 0 10px 0 0
        padding 0
        font-weight normal

    .btn-advanced-search
        border-radius 20px 0 0 20px
        width 70px
        height 32px
        margin 0
        padding 0
        text-transform unset
        color #fff
        font-weight normal
        min-width 70px !important
        font-size 12px

    .btn-search
        margin-right 10px
        padding 5px 10px

        i
            color rgba(255, 255, 255, .8)
            font-size 13px
            font-weight bold

    .v-navigation-drawer
        height 100%
        margin-top 60px !important
        -webkit-transform translateX(0)
        transform translateX(0)
        width 340px
        padding 0
        overflow-y hidden
        position fixed
        border-left 1px solid #ddd
        z-index 4

        .btn-close
            font-size 20px
            color rgba(255, 255, 255, .8)
            margin-right 10px !important

        .items
            height -webkit-calc(100% - 194px)
            height -moz-calc(100% - 194px)
            height calc(100% - 194px)
            overflow-y auto
            margin 75px 0 70px 0

        .actions
            padding 15px
            position fixed
            bottom 60px
            height 60px
            width 340px
            right 0
            display flex
            border-top 1px solid #eee

            .ad-search
                width 70%
                color white
                font-size 13px
                height 30px
                margin 0 10px 0 0
                text-transform unset

            .ad-clear
                width 30%
                margin-left 10px
                color var(--v-primary-base)
                text-align center
                padding 5px
                font-size 13px

        .title
            color rgba(255, 255, 255, .8)
            position fixed
            display flex
            width 340px
            height 60px !important
            align-items center
            font-size 16px !important
            font-weight bold

@media (max-width 720px)
    .advanced-search-bar
        display none

    .btn-advanced-search
        display none !important

    .btn-search__active
        display none !important

    .input-search
        width 100% !important

    .simple-search
        width 100%

    .btn-search
        padding 5px 10px
        margin-right 0 !important

    .search
        right unset !important
        top 15px
        display -webkit-box
        display -ms-flexbox
        display flex
        width 100%
        padding 0 20px 0 5px

    .az-search
        width 100%

        .icon-search
            margin 0
</style>
