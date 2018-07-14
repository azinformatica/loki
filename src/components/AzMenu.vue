<template>
    <div class="az-menu">
        <v-list subheader>
            <div v-for="menu in menuActions" :key="menu.name">
                <v-list-tile v-if="!menu.children" :to="menu.path" exact @click="redirectTo(menu.path)">
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
                    <v-list-tile slot="activator">
                        <v-list-tile-action>
                            <v-icon>{{ menu.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ menu.name }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <div class="az-submenu">
                        <v-list-tile v-if="!asideClosed" :to="submenu.path" v-for="submenu in menu.children"
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
        </v-list>
    </div>
</template>
<script>
    export default {
        methods: {
            redirectTo(item) {
                console.log(item)
            }
        },
        computed: {
            menuActions() {
                return this.$store.state.loki.menuActions
            },
            asideClosed() {
                return this.$store.state.loki.asideClosed
            }
        }
    }
</script>
<style lang="less">

    .az-menu {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .v-list__group__items--no-action .v-list__tile {
        padding-left: 0;
    }

    .az-menu::-webkit-scrollbar {
        width: 6px;
    }

    .az-menu::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.5);
    }


    .az-aside::-webkit-scrollbar {
        width: 6px;
    }

    .az-aside::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.5);
    }

    .az-submenu {
        background-color: rgba(0, 0, 0, 0.1);
        &__tile {
            padding-left: 50px;
            height: 30px;
            border-top: none;
            border-bottom: none;
        }
    }

    .az-menu {
        font-size: 13px;
        .icon {
            color: rgba(255, 255, 255, 0.8);
        }
        .primary--text {
            color: rgba(255, 255, 255, 0.8) !important;
        }

        .material-icons {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.8);
        }
        .v-list {
            padding: 0;
            &__group {
                border-bottom: 1px solid rgba(255, 255, 255, 0.10);
                .v-list {
                    &__tile {
                        border-top: none;
                        border-bottom: none;
                        height: 30px;
                    }
                    &__tile--active {
                        background-color: transparent !important;
                        color: #D28A2C !important;
                    }
                }
                &__header {
                    height: 44px;
                    &__prepend-icon {
                        padding-right: 10px !important;
                    }
                    &__append-icon {
                        padding: 0 5px 0 0;
                    }
                }
            }
            &__tile--active {
                background-color: #D28A2C !important;
            }
            &__tile {
                height: 44px;
                padding: 0 12px;
                color: rgba(255, 255, 255, 0.8);
                :hover {
                    color: rgba(255, 255, 255, 0.8) !important;
                }
                &__title {
                    font-size: 13px;
                }
                &__action {
                    min-width: unset;
                    padding-right: 10px;
                    padding-left: 5px;
                    i{
                        font-size: 20px;
                    }
                }
            }
        }
    }
</style>
