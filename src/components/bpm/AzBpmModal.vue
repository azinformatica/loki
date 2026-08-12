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
                    <v-col class="az-bpm-modal__item" cols="12" v-if="isButtonTypeComplete">
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
                            :disabled="selectHumanDecisionDisabled || !selectHumanDecisionItems.length"
                            return-object
                            hide-details
                        ></v-select>
                        <v-form ref="form" class="pt-4 pb-0 px-0" v-if="nextTaskFilteredWithSelectedHumanDecision">
                            <div class="az-bpm-modal__item">
                                <div class="az-text">
                                    <label for="activities" class="grey--text text--darken-3">
                                        <b> {{ getAttributeJustification('label', 'Motivo') }} </b>
                                    </label>
                                    <span class="red--text">*</span>
                                </div>
                                <v-textarea
                                    id="observacao"
                                    v-model="justificationField"
                                    :rules="[(rulesText) => regras[0](rulesText, getAttributeJustification('maxLength', 1000))]"
                                    style="height: auto !important"
                                    name="Motivo"
                                    :hint="charCount(getAttributeJustification('maxLength', 1000))"
                                    :maxLength="getAttributeJustification('maxLength', 1000)"
                                    no-resize
                                    rows="3"
                                    placeholder="Informe"
                                ></v-textarea>
                            </div>
                        </v-form>
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
                    <v-col class="az-bpm-modal__item" cols="12" v-if="selectUOShow">
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
                            :items="selectUOItems"
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
                    :disabled="
                        (isButtonTypeComplete && !selectedHumanDecision) ||
                        (selectedNextTaskRequiresUO && !selectedUO)
                    "
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
            default: false
        },
        buttonType: {
            type: String,
            default: ''
        },
        currentTask: {
            type: Object,
            default: () => ({})
        },
        components: {
            type: Object,
            default: () => ({})
        },
    },
    inject: ['$validator'],
    data() {
        return {
            selectedUO: '',
            selectedHumanDecision: null,
            selectedRoute: null,
            selectedOrganizationalStructure: null,
            justificationField: '',
            organizationalStructure: [
                {
                    value: 'acronymTypeAdministrationCompleted',
                    text: 'Órgão'
                },
                {
                    value: 'upperHierarchyCode',
                    text: 'Unidade Organizacional'
                }
            ]
        }
    },
    methods: {
        async emitActionEvent() {
            let validatedForm = true
            if (this.nextTaskFilteredWithSelectedHumanDecision && this.$refs.form) {
                validatedForm = await this.$refs.form.validate()
            }

            if (validatedForm) {
                this.$emit('action', {
                    buttonType: this.buttonType,
                    bpmParameters: this.bpmParameters
                })
            }
        },
        initializeUOSelect() {
            if (this.selectUOShow && !this.selectedUO) {
                this.selectedUO = this.originUOId || this.getFirstItemValue(this.selectUOItems)
            }
        },
        resetUOSelectIfInvalidValue() {
            if (this.selectedUO && !this.selectHasGivenValue(this.selectUOItems, this.selectedUO)) {
                this.resetUOSelect()
            }
        },
        resetJustificationField() {
            this.justificationField = ''

            if (this.nextTaskFilteredWithSelectedHumanDecision && this.$refs.form) {
                this.$refs.form.reset()
            }
        },
        resetUOSelect() {
            this.selectedUO = ''
        },
        initializeHumanDecisionSelect() {
            if (this.isButtonTypeComplete && !this.selectedHumanDecision) {
                this.selectedHumanDecision = this.getFirstItem(this.selectHumanDecisionItems)
            }
        },
        resetHumanDecisionSelectIfInvalidValue() {
            if (this.selectedHumanDecision && !this.selectHasGivenValue(this.selectHumanDecisionItems, this.selectedHumanDecision.value)) {
                this.resetHumanDecisionSelect()
            }
        },
        resetHumanDecisionSelect() {
            this.selectedHumanDecision = null
        },
        initializeRouteSelect() {
            if (this.isButtonTypeRoute && !this.selectedRoute) {
                this.selectedRoute = this.getFirstItem(this.selectRouteItems)
            }
        },
        resetRouteSelectIfInvalidValue() {
            if (this.selectedRoute && !this.selectHasGivenValue(this.selectRouteItems, this.selectedRoute.value)) {
                this.resetRouteSelect()
            }
        },
        resetRouteSelect() {
            this.selectedRoute = null
        },
        resetSelectedOrganizationalStructureIfInvalidValue() {
            if (this.selectedOrganizationalStructure && !this.selectHasGivenValue(this.organizationalStructure, this.selectedOrganizationalStructure.value)) {
                this.resetSelectedOrganizationalStructure()
            }
        },
        resetSelectedOrganizationalStructure() {
            this.selectedOrganizationalStructure = null
        },
        resetAll() {
            if (this.nextTaskFilteredWithSelectedHumanDecision && this.$refs.form) {
                this.$refs.form.reset()
            }
            this.resetUOSelect()
            this.resetHumanDecisionSelect()
            this.resetRouteSelect()
            this.resetSelectedOrganizationalStructure()
            this.resetJustificationField()

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
        selectHasGivenValue(items, value) {
            if (items.length) {
                return items.some((item) => item.value === value)
            }

            return false
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
        addJustificationFieldIfNeeded(bpmParameters) {
            if (this.nextTaskFilteredWithSelectedHumanDecision) {
                _.merge(bpmParameters, { justificationField: this.justificationField })
            }
        },
        getAttributeJustification(attribute, defaultValue) {
            if (this.nextTaskFilteredWithSelectedHumanDecision && Object.keys(this.nextTaskFilteredWithSelectedHumanDecision).includes(attribute)) {
                return this.nextTaskFilteredWithSelectedHumanDecision[attribute]
            } else {
                return defaultValue
            }
        },
        charCount(limite = 100) {
            if (this.justificationField) {
                if (this.justificationField.length < limite) {
                    return `${limite - this.justificationField.length} caracteres restantes.`
                } else {
                    return `Limite de ${limite} caracteres foi atingido`
                }
            } else {
                return ''
            }
        }
    },
    watch: {
        show() {
            this.resetAll()
            this.initializeAll()
        },
        selectHumanDecisionItems() {
            this.resetHumanDecisionSelectIfInvalidValue()
            this.initializeHumanDecisionSelect()
        },
        selectRouteItems() {
            this.resetRouteSelectIfInvalidValue()
            this.initializeRouteSelect()
        },
        selectUOItems() {
            this.resetUOSelectIfInvalidValue()
            this.initializeUOSelect()
        },
        originUO() {
            this.resetUOSelectIfInvalidValue()
            this.initializeUOSelect()
        },
        selectedNextTaskRequiresUO() {
            this.resetUOSelectIfInvalidValue()
            this.initializeUOSelect()
        },
        selectedRoute() {
            this.resetSelectedOrganizationalStructureIfInvalidValue()
            this.resetUOSelectIfInvalidValue()
        },
        selectedHumanDecision() {
            this.resetSelectedOrganizationalStructureIfInvalidValue()
            this.resetUOSelectIfInvalidValue()
            this.resetJustificationField()
        }
    },
    computed: {
        uos() {
            return this.$store.state.loki.uos
        },
        nextTasks() {
            return this.currentTask.nextTasks || []
        },
        nextTaskFilteredWithSelectedHumanDecision() {
            if (this.selectedHumanDecision && this.nextTasks.length) {
                const nextTask = this.nextTasks.find((nextTask) => nextTask.taskId === this.selectedHumanDecision.value)

                if (nextTask && Object.keys(nextTask).includes('justificativa')) {
                    return JSON.parse(nextTask.justificativa)
                }
            }

            return null
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
        selectUOShow() {
            return this.selectedOrganizationalStructure || false
        },
        selectUOItems() {
            if (!this.selectedOrganizationalStructure) {
                return []
            }

            const uos = this.uos[this.selectedOrganizationalStructure.value] || []

            return uos.map((uo) => ({
                text: `${uo.codigoHierarquiaFormatado} - ${uo.sigla} - ${uo.nome}`,
                value: uo.id
            }))
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
            this.addJustificationFieldIfNeeded(parameters)

            return parameters
        },
        completeParameters() {
            return {
                humanDecision: this.selectedHumanDecision && this.selectedHumanDecision.value
            }
        },
        routeParameters() {
            return {
                activityIdDestination: this.selectedRoute && this.selectedRoute.value
            }
        },
        uoDestinationParameters() {
            return {
                uoDestinationId: this.selectedUO
            }
        },
        organizationalStructureShow() {
            return (
                (this.selectedHumanDecision && this.selectedHumanDecision.requiresUO) ||
                (this.selectedRoute && this.selectedRoute.requiresUO)
            )
        },
        regras: () => [
            (value, maxLength = 4000, message = 'Campo obrigatório!') => {
                if (typeof value === 'string') {
                    if (value.length <= maxLength) {
                        return (!!value && value.trim().length > 0) || message
                    } else {
                        return `O campo deve conter no máximo ${maxLength} caracteres!`
                    }
                } else {
                    return !!value || message
                }
            },
        ],
    },
    created() {
        this.resetAll()
        this.initializeAll()
    }
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
