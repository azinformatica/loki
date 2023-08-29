<template>
    <v-dialog :value="show" scrollable persistent max-width="500px">
        <v-card class="az-bpm-modal">
            <slot name="title">
                <v-card-title class="justify-center primary py-2 text-center text-subtitle-1 white--text">
                    <span>{{ actionLabel }}</span>
                    <v-spacer></v-spacer>
                    <v-icon dark @click="$emit('close')" data-test="icon-close"> mdi-close</v-icon>
                </v-card-title>
            </slot>
            <v-card-text class="pt-0 pb-0 pl-0 pr-0">
                <v-row dense class="az-form-content">
                    <v-col class="az-bpm-modal__item" cols="12">
                        <div class="az-text">
                            <label for="uo" class="grey--text text--darken-3">
                                <b> Atividade Atual: </b>
                            </label>
                            <span class="ml-2 grey--text text--darken-1">
                                {{ currentTaskName }}
                            </span>
                        </div>
                    </v-col>
                    <v-col class="az-bpm-modal__item" cols="12" v-if="isButtonTypeComplete && selectHumanDecisionShow">
                        <div class="az-text">
                            <label for="human-decision-select" class="grey--text text--darken-3">
                                <b> Encaminhar para <span class="red--text">*</span> </b>
                            </label>
                        </div>
                        <v-select
                            id="human-decision-select"
                            class="pt-0"
                            placeholder="Selecione uma opção"
                            dense
                            v-model="selectedHumanDecision"
                            :items="selectHumanDecisionItems"
                            :disabled="selectHumanDecisionDisabled"
                            return-object
                            hide-details
                        ></v-select>
                    </v-col>
                    <v-col class="az-bpm-modal__item" cols="12" v-if="isButtonTypeRoute && selectRouteShow">
                        <div class="az-text">
                            <label for="route-select" class="grey--text text--darken-3">
                                <b> Encaminhar para <span class="red--text">*</span> </b>
                            </label>
                        </div>
                        <v-select
                            id="route-select"
                            class="pt-0"
                            placeholder="Selecione uma opção"
                            dense
                            v-model="selectedRoute"
                            :items="selectRouteItems"
                            :disabled="selectRouteDisabled"
                            return-object
                            hide-details
                        >
                        </v-select>
                    </v-col>
                    <v-col class="az-bpm-modal__item" cols="12" v-if="selectUOShow && selectedNextTaskRequiresUO">
                        <div class="az-text">
                            <label for="uo" class="grey--text text--darken-3">
                                <b> Unidade Organizacional <span class="red--text">*</span> </b>
                            </label>
                        </div>
                        <v-autocomplete
                            id="uo-select"
                            class="pt-0"
                            dense
                            placeholder="Selecione uma opção"
                            v-model="selectedUO"
                            :items="selectUOItems"
                            :disabled="selectUODisabled"
                            hide-details
                            :menu-props="{ maxWidth: '468px' }"
                        />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn
                    width="100px"
                    class="text-capitalize"
                    outlined
                    color="grey lighten-1"
                    @click="$emit('close')"
                    data-test="button-cancel"
                >
                    Cancelar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    :disabled="selectedButton.disabled"
                    width="100px"
                    class="text-capitalize"
                    color="primary"
                    @click="emitActionEvent"
                    data-test="button-action"
                >
                    {{ actionLabel }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import _ from 'lodash'

export default {
    name: 'AzBpmModal',
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        buttonType: {
            type: String,
            default: '',
        },
        currentTask: {
            type: Object,
            default: () => ({}),
        },
        components: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            selectedUO: '',
            selectedHumanDecision: null,
            selectedRoute: null,
        }
    },
    methods: {
        emitActionEvent() {
            this.$emit('action', {
                buttonType: this.buttonType,
                bpmParameters: this.bpmParameters,
            })
        },
        initializeUOSelect() {
            this.selectedUO = this.originUOId || this.getFirstItemValue(this.selectUOItems)
        },
        resetUOSelect() {
            this.selectedUO = ''
        },
        initializeHumanDecisionSelect() {
            if (this.isButtonTypeComplete) {
                this.selectedHumanDecision = this.getFirstItem(this.selectHumanDecisionItems)
            }
        },
        resetHumanDecisionSelect() {
            this.selectedHumanDecision = null
        },
        initializeRouteSelect() {
            if (this.isButtonTypeRoute) {
                this.selectedRoute = this.getFirstItem(this.selectRouteItems)
            }
        },
        resetRouteSelect() {
            this.selectedRoute = null
        },
        resetAll() {
            this.resetUOSelect()
            this.resetHumanDecisionSelect()
            this.resetRouteSelect()
        },
        initializeAll() {
            this.initializeUOSelect()
            this.initializeHumanDecisionSelect()
            this.initializeRouteSelect()
        },
        getFirstItemValue(items) {
            const firstItem = this.getFirstItem(items)

            return firstItem ? firstItem.value : ''
        },
        getFirstItem(items) {
            const [firstItem] = items

            return firstItem || null
        },
    },
    watch: {
        show() {
            this.resetAll()
            this.initializeAll()
        },
        selectHumanDecisionItems() {
            this.resetHumanDecisionSelect()
            this.initializeHumanDecisionSelect()
        },
        selectRouteItems() {
            this.resetUOSelect()
            this.initializeRouteSelect()
        },
        selectUOItems() {
            this.resetUOSelect()
            this.initializeUOSelect()
        },
        originUO() {
            this.resetUOSelect()
            this.initializeUOSelect()
        },
        selectedNextTaskRequiresUO() {
            this.resetUOSelect()
            this.initializeUOSelect()
        },
    },
    computed: {
        nextTasks() {
            return this.currentTask.nextTasks || []
        },
        currentTaskName() {
            return this.currentTask ? this.currentTask.name : '-'
        },
        actionLabel() {
            return this.selectedButton.label || '-'
        },
        isButtonTypeComplete() {
            return this.buttonType === 'complete'
        },
        isButtonTypeRoute() {
            return this.buttonType === 'route'
        },
        selectedHumanDecisionRequiresUO() {
            return this.selectedHumanDecision && this.selectedHumanDecision.requiresUO
        },
        selectedRouteRequiresUO() {
            return this.selectedRoute && this.selectedRoute.requiresUO
        },
        selectedNextTaskRequiresUO() {
            return this.selectedHumanDecisionRequiresUO || this.selectedRouteRequiresUO
        },
        selectedButton() {
            return this.components.button[this.buttonType] || {}
        },
        select() {
            return this.components.select || {}
        },
        selectHumanDecision() {
            return this.select.humanDecision || {}
        },
        selectHumanDecisionShow() {
            return this.selectHumanDecision.show || false
        },
        selectHumanDecisionDisabled() {
            return this.selectHumanDecision.disabled || false
        },
        selectHumanDecisionItems() {
            return this.selectHumanDecision.items || []
        },
        selectRoute() {
            return this.select.route || {}
        },
        selectRouteShow() {
            return this.selectRoute.show || false
        },
        selectRouteDisabled() {
            return this.selectRoute.disabled || false
        },
        selectRouteItems() {
            return this.selectRoute.items || []
        },
        selectUO() {
            return this.select.uo || {}
        },
        selectUOShow() {
            return this.selectUO.show || false
        },
        selectUODisabled() {
            return this.selectUO.disabled || false
        },
        selectUOItems() {
            return this.selectUO.items
        },
        originUO() {
            return this.currentTask ? this.currentTask.currentUo : null
        },
        originUOId() {
            return this.originUO ? this.originUO.id.toString() : ''
        },
        bpmParameters() {
            const selectedParameters = _.cloneDeep(this.uoParameters)

            if (this.isButtonTypeComplete && this.selectedHumanDecision) {
                _.merge(selectedParameters, this.completeParameters)
            }

            if (this.isButtonTypeRoute && this.selectedRoute) {
                _.merge(selectedParameters, this.routeParameters)
            }

            return selectedParameters
        },
        completeParameters() {
            return {
                humanDecision: this.selectedHumanDecision && this.selectedHumanDecision.value,
            }
        },
        routeParameters() {
            return {
                activityIdDestination: this.selectedRoute && this.selectedRoute.value,
            }
        },
        uoParameters() {
            return {
                uoOriginId: this.originUOId,
                uoDestinationId: this.selectedUO,
            }
        },
    },
    created() {
        this.resetAll()
        this.initializeAll()
    },
}
</script>
<style lang="stylus">
.az-bpm-modal
    &__item
        margin-bottom 16px

        &:last-child
            margin-bottom 0

    .v-card
        &__title
            padding-left 16px !important
            padding-right 16px !important

        &__actions
            padding 16px !important

    .az-form-content
        padding 16px !important

        .col
            padding 0 !important
</style>
