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
                                <b>Encaminhar para <span class="red--text">*</span> </b>
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
                                <b>Encaminhar para <span class="red--text">*</span> </b>
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
                    <v-col class="az-bpm-modal__item" cols="12" v-if="organizationalStructureShow">
                        <div class="az-text">
                            <label for="route-select" class="grey--text text--darken-3">
                                <b> Estrutura Organizacional <span class="red--text">*</span> </b>
                            </label>
                        </div>
                        <v-select
                            id="organizational-structure-select"
                            class="pt-0"
                            placeholder="Selecione uma opção"
                            dense
                            v-model="selectedOrganizationalStructure"
                            :items="organizationalStructure"
                            return-object
                            hide-details
                        ></v-select>
                    </v-col>
                    <v-col class="az-bpm-modal__item" cols="12" v-if="showselectUOsFilteredItems">
                        <div class="az-text">
                            <label for="uo" class="grey--text text--darken-3">
                                <b> {{ selectedOrganizationalStructure.text }} <span class="red--text">*</span> </b>
                            </label>
                        </div>
                        <v-autocomplete
                            id="uo-select"
                            class="pt-0"
                            dense
                            placeholder="Selecione uma opção"
                            v-model="selectedUO"
                            :items="selectUOsFilteredItems"
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
                    :disabled="selectedNextTaskRequiresUO && !selectedUO"
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
            selectedOrganizationalStructure: null,
            selectUOsFiltered: [],
            organizationalStructure: [
                {
                    value: 'acronymTypeAdministrationCompleted',
                    text: 'Órgão',
                },
                {
                    value: 'upperHierarchyCode',
                    text: 'Unidade Organizacional',
                },
            ],
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
            if (this.selectUOShow) {
                this.selectedUO = this.originUOId || this.getFirstItemValue(this.selectUOItems)
            }
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
        resetSelectedOrganizationalStructure() {
            this.selectedOrganizationalStructure = null
        },
        resetAll() {
            this.resetUOSelect()
            this.resetHumanDecisionSelect()
            this.resetRouteSelect()
            this.resetSelectedOrganizationalStructure()
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
        addUoDestinationParametersIfNeeded(bpmParameters) {
            if (this.selectUOShow && this.selectedNextTaskRequiresUO && this.selectedUO) {
                _.merge(bpmParameters, this.uoDestinationParameters)
            }
        },
        addHumanDecisionParametersIfNeeded(bpmParameters) {
            if (this.isButtonTypeComplete && this.selectedHumanDecision) {
                _.merge(bpmParameters, this.completeParameters)
            }
        },
        addRouteParametersIfNeeded(bpmParameters) {
            if (this.isButtonTypeRoute && this.selectedRoute) {
                _.merge(bpmParameters, this.routeParameters)
            }
        },
        mountItemsForSelectUOs(uosList) {
            return uosList.map((uos) => ({
                text: `${uos.codigoHierarquiaFormatado} - ${uos.sigla} - ${uos.nome}`,
                value: uos.id,
            }))
        },
        setSeletedUOWithCurrentUO(uosList) {
            this.selectedUO = null

            const currentUO = this.currentTask.currentUo ? this.currentTask.currentUo.id : null
            if (uosList.some((obj) => obj.id === currentUO)) {
                this.selectedUO = this.currentTask.currentUo.id
            }
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
        selectedRoute() {
            this.resetSelectedOrganizationalStructure()
            this.resetUOSelect()
        },
        selectedHumanDecision() {
            this.resetSelectedOrganizationalStructure()
            this.resetUOSelect()
        },
        selectedOrganizationalStructure(newValue) {
            if (newValue) {
                const uosList = this.uos[newValue.value]
                this.selectUOsFiltered = this.mountItemsForSelectUOs(uosList)
                if (uosList) {
                    this.setSeletedUOWithCurrentUO(uosList)
                }
            }
        },
    },
    computed: {
        uos() {
            return this.$store.state.loki.uos
        },
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
        selectUOItems() {
            return this.selectUO.items
        },
        selectUOsFilteredItems() {
            return this.selectUOsFiltered
        },
        originUO() {
            return this.currentTask ? this.currentTask.currentUo : null
        },
        originUOId() {
            return this.originUO ? this.originUO.id : null
        },
        bpmParameters() {
            const parameters = {}
            this.addUoDestinationParametersIfNeeded(parameters)
            this.addHumanDecisionParametersIfNeeded(parameters)
            this.addRouteParametersIfNeeded(parameters)

            return parameters
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
        uoDestinationParameters() {
            return {
                uoDestinationId: this.selectedUO,
            }
        },
        organizationalStructureShow() {
            return (
                (this.selectedHumanDecision && this.selectedHumanDecision.requiresUO) ||
                (this.selectedRoute && this.selectedRoute.requiresUO)
            )
        },
        showselectUOsFilteredItems() {
            return this.selectedOrganizationalStructure
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
