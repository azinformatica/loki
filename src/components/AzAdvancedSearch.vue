<template>

    <div class="az-advanced-search">
        <a :class="{'btn-search__active' : isActiveAdvancedSearch, 'btn-search__inactive' : !isActiveAdvancedSearch}" @click="toggle()">
            <v-icon small>chevron_left</v-icon>
            Filtros
            <span>3</span>
        </a>

        <v-navigation-drawer permanent absolute right width="400" :mini-variant.sync="isClosed"
                             mini-variant-width="0" floating>
            <div class="busca">
                <div class="titulo">
                    <a class="fechar" @click="toggle()"><v-icon>close</v-icon></a>
                    <div class="texto">Busca Avançada</div>
                </div>
                <div class="itens">
                    <slot name="filters"></slot>
                </div>
                <div class="acoes">
                    <a class="btn__buscar" @click="callSearch()">Buscar</a>
                    <a class="btn__cancelar" @click="cancel()">Cancelar</a>
                </div>
            </div>
        </v-navigation-drawer>
    </div>
</template>

<script>
    import mutationTypes from '../store/mutations-types'

    export default {
        data () {
            return {
                isClosed: true,
                isActiveAdvancedSearch : false
            }
        },
        methods: {
            cancel () {
                this.toggle()
            },
            toggle () {
                this.isClosed = !this.isClosed
                this.closeAsideMenu()
            },
            closeAsideMenu () {
                this.$store.commit(mutationTypes.SET_ASIDE, true)
            },
            callSearch () {
                this.$emit('search')
            }
        }
    }
</script>

<style lang="less">
    .adSearch{
        height: 100%;
    }
    .v-list {
        &__tile {
            height: 30px;
            font-size: 14px;
        }
        .v-input-group{
            .primary--text {
                color: black !important;
            }
        }
    }

    .az-advanced-search {
        display: flex;

        .v-navigation-drawer {
            height: 100%;
            margin-top: 60px !important;
            max-height: calc(~"100% -" 60px);
            transform: translateX(0px);
            width: 400px;
            padding: 0;
            overflow-y: hidden;
            position: fixed;
            border-left: 1px solid #ddd;
        }

        .btn-search {
            &__active{
                background-color: #3a6861;
                padding: 5px;
                border-radius: 20px 0 0 20px;
                color: rgba(255, 255, 255, 0.8);
                i {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 18px;
                    font-weight: bold;
                }

                span {
                    margin-left: 5px;
                    color: #3a6861;
                    background-color: rgba(255, 255, 255, 0.8);
                    padding: 0 4px;
                    border-radius: 50%;
                    font-weight: bold;
                    font-size: 13px;
                }
            }

            &__inactive{
                background-color: #777777;
                padding: 5px;
                border-radius: 20px 0 0 20px;
                color: rgba(255, 255, 255, 0.8);
                i {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 18px;
                    font-weight: bold;
                }

                span {
                    display: none;
                }
            }
        }
        .busca {
            height: 100%;
            .input-group input {
                font-size: 14px;
                color: #777 !important;
            }

            label {
                color: #bbb;
                font-size: 14px;
            }

            .input-group__selections__comma {
                font-size: 14px;
                color: #777 !important;
            }

            .titulo {
                background-color: #3a6861;
                color: rgba(255, 255, 255, 0.8);
                position: fixed;
                display: flex;
                top: 0;
                right: 0;
                text-align: center;
                width: 400px;
                max-height: 60px;

                .fechar{
                    padding: 10px;
                    margin: 10px 0;
                    width: 10%;
                    i{
                        font-size: 18px;
                        color: rgba(255, 255, 255, 0.8);
                        font-weight: bold;
                    }
                }

                .texto{
                    padding: 20px;
                    font-size: 14px;
                    font-weight: bold;
                    width: 90%;
                }
            }
            .itens {
                height: 100%;
                padding: 60px 0 62px 20px;
                .lista {
                    overflow-y: auto;
                    height: 100%;
                    padding-right: 15px;
                    padding-top: 10px;
                    .input-group {
                        height: 60px;
                    }
                    .primary--text {
                        color: #D28A2C !important;
                    }
                }
            }
            .acoes {
                padding: 15px;
                position: fixed;
                bottom: 0;
                width: 400px;
                right: 0;
                display: flex;
                border-top: 1px solid #eee;
                .btn {
                    &__cancelar {
                        width: 30%;
                        background-color: white;
                        border: 1px solid #ddd;
                        color: #777;
                        text-align: center;
                        padding: 5px;
                        font-size: 13px;
                        border-radius: 2px;
                    }
                    &__buscar {
                        width: 70%;
                        background-color: #D28A2C;
                        color: white;
                        border: 1px solid #D28A2C;
                        margin-right: 10px;
                        text-align: center;
                        padding: 5px;
                        font-size: 13px;
                        border-radius: 2px;
                    }
                }
            }
            .buscar {
                position: fixed;
                bottom: 0;
                width: 400px;
                right: 0;
                background-color: #D28A2C;
                color: white;
                padding: 10px;
                text-align: center;
            }
            .cancelar {
                position: fixed;
                bottom: 0;
                width: 400px;
                right: 0;
                background-color: transparent;
                color: white;
                padding: 10px;
                text-align: center;
            }
        }

    }
</style>
