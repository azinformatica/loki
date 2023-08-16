<template>
    <az-modal>
        <template #title>
            <div class="d-flex flex-grow-1 flex-nowrap justify-space-between">
                <h4>{{ actionLabel }} processo</h4>
                <v-btn icon color="white" @click="emitCloseEvent" data-test="button-close">
                    <v-icon> mdi-close </v-icon>
                </v-btn>
            </div>
        </template>
        <template #body>
            <div class="pt-5">
                <div class="d-flex mb-4">
                    <div class="grey--text text--darken-3">Atividade atual:</div>
                    <div class="ml-2 grey--text text--darken-1">{{ currentTaskName }}</div>
                </div>
                <div v-if="isButtonTypeComplete && components.select.humanDecision.show">
                    <label for="human-decision-select" class="grey--text text--darken-3"> Encaminhar para: </label>
                    <v-select
                        id="human-decision-select"
                        class="pt-0"
                        placeholder="Selecione uma opção"
                        v-model="selectedHumanTask"
                        :items="components.select.humanDecision.items"
                        hide-details
                    ></v-select>
                </div>
                <div v-if="isButtonTypeRoute">
                    <label for="route-select" class="grey--text text--darken-3"> Encaminhar para: </label>
                    <v-select
                        id="route-select"
                        class="pt-0"
                        placeholder="Selecione uma opção"
                        v-model="selectedRoute"
                        :items="components.select.route.items"
                        hide-details
                    >
                    </v-select>
                </div>
            </div>
        </template>
        <template #actions>
            <v-divider class="mx-2 pb-2"></v-divider>
            <div class="d-flex flex-grow-1 justify-space-between pa-2">
                <v-btn outlined color="grey lighten-1" @click="emitCloseEvent" data-test="button-cancel">
                    Cancelar
                </v-btn>
                <v-btn color="primary" @click="emitActionEvent" data-test="button-action"> {{ actionLabel }} </v-btn>
            </div>
        </template>
    </az-modal>
</template>

<script>
export default {
    name: 'AzBpmModal',
    props: {
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
            selectedHumanTask: '',
            selectedRoute: '',
        }
    },
    methods: {
        emitCloseEvent() {
            this.$emit('close')
        },
        emitActionEvent() {
            const buttonType = this.buttonType
            const selectedBpmParameters = {
                humanDecision: this.selectedHumanTask,
                activityIdDestination: this.selectedRoute,
            }

            this.$emit('action', { buttonType, selectedBpmParameters })
        },
        initializeHumanDecisionSelect() {
            this.selectedHumanTask = this.getFirstItemValue(this.selectHumanDecisionItems)
        },
        initializeRouteSelect() {
            this.selectedRoute = this.getFirstItemValue(this.selectRouteItems)
        },
        getFirstItemValue(items) {
            const firstItem = items[0] || {}

            return firstItem.value || ''
        },
    },
    watch: {
        selectHumanDecisionItems() {
            this.initializeHumanDecisionSelect()
        },
        selectRouteItems() {
            this.initializeRouteSelect()
        },
    },
    computed: {
        actionLabel() {
            return this.selectedButton.label || '-'
        },
        currentTaskName() {
            return (this.currentTask && this.currentTask.name) || '-'
        },
        isButtonTypeComplete() {
            return this.buttonType === 'complete'
        },
        isButtonTypeRoute() {
            return this.buttonType === 'route'
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
        selectHumanDecisionItems() {
            return this.selectHumanDecision.items || []
        },
        selectRoute() {
            return this.select.route || {}
        },
        selectRouteItems() {
            return this.selectRoute.items || []
        },
    },
    created() {
        this.initializeHumanDecisionSelect()
        this.initializeRouteSelect()
    },
}
</script>
