<template>
    <div v-if="hasComponents" class="d-flex justify-center align-center">
        <v-select
            v-model="selectedParallelTask"
            v-show="select.parallel.show"
            :items="select.parallel.items"
            :label="select.parallel.label"
            :disabled="disabled || select.parallel.disabled"
            v-bind="selectMergedAttrs"
        ></v-select>
        <v-btn
            v-for="buttonType of buttonTypes"
            :key="buttonType"
            v-show="button[buttonType].show"
            :disabled="disabled || button[buttonType].disabled"
            v-bind="buttonMergedAttrs[buttonType]"
            @click="handleButtonClick(buttonType)"
        >
            <slot :name="buttonType" :button="button[buttonType]">
                {{ button[buttonType].label }}
            </slot>
        </v-btn>
        <az-bpm-modal
            :show="showModal"
            :button-type="selectedButtonType"
            :current-task="currentTask"
            :components="components"
            @close="closeModal"
            @action="handleModalAction"
        />
    </div>
</template>

<script>
import _ from 'lodash'
import AzBpmInteraction from './AzBpmInteraction'
import AzBpmModal from './AzBpmModal'
import { mutationTypes } from '../../store'
import AzBpmProcess from '../../utils/bpm/AzBpmProcess'

export default {
    name: 'AzBpmAction',
    components: { AzBpmModal },
    props: {
        disabled: {
            default: false,
            type: Boolean,
        },
        processKey: {
            default: '',
            type: String,
        },
        businessKey: {
            default: '',
            type: String,
        },
        bpmParameters: {
            default: () => ({}),
            type: Object,
        },
        selectAttrs: {
            default: () => ({}),
            type: Object,
            validator: (selectAttrs) =>
                ['humanDecision', 'parallel', 'route'].every(
                    (selectType) =>
                        !selectAttrs.hasOwnProperty(selectType) || typeof selectAttrs[selectType] === 'object'
                ),
        },
        buttonAttrs: {
            default: () => ({}),
            type: Object,
            validator: (buttonAttrs) =>
                ['claim', 'unclaim', 'complete', 'uncomplete', 'route'].every(
                    (buttonType) =>
                        !buttonAttrs.hasOwnProperty(buttonType) || typeof buttonAttrs[buttonType] === 'object'
                ),
        },
        beforeAction: {
            type: Function,
            default: () => true,
        },
        afterAction: {
            type: Function,
            default: () => null,
        },
    },
    data() {
        return {
            showModal: false,
            selectedParallelTask: '',
            selectedButtonType: '',
            selectDefaultAttrs: {},
            buttonDefaultAttrs: {
                claim: {},
                unclaim: {},
                complete: {},
                uncomplete: {},
            },
            interaction: null,
            process: null,
        }
    },
    methods: {
        async executeButtonAction(buttonType, bpmParameters = {}) {
            this.addUoOriginIfMissing(bpmParameters)
            this.addUoDestinationIfMissing(bpmParameters)
            this.addPropsBpmParameters(bpmParameters)
            const shouldExecuteAction = await this.beforeAction(buttonType, bpmParameters)
            if (shouldExecuteAction) {
                const button = this.getButton(buttonType)
                const actionResponse = await button.action(bpmParameters)
                await this.afterAction(actionResponse)
            }
        },
        addUoOriginIfMissing(bpmParameters) {
            if (!bpmParameters.uoOriginId && this.currentUoId) {
                bpmParameters.uoOriginId = this.currentUoId
            }
        },
        addUoDestinationIfMissing(bpmParameters) {
            if (!bpmParameters.uoDestinationId && this.currentUoId) {
                bpmParameters.uoDestinationId = this.currentUoId
            }
        },
        addPropsBpmParameters(bpmParameters) {
            if (this.hasBpmParameters) {
                _.merge(bpmParameters, _.merge({}, this.bpmParameters, bpmParameters))
            }
        },
        getButton(buttonType) {
            return this.button[buttonType]
        },
        isButtonTypeComplete(buttonType) {
            return buttonType === 'complete'
        },
        isButtonTypeRoute(buttonType) {
            return buttonType === 'route'
        },
        hasHumanDecision() {
            return this.select.humanDecision.show && !this.select.humanDecision.disabled
        },
        shouldOpenModal(buttonType) {
            return (
                (this.isButtonTypeComplete(buttonType) && this.hasHumanDecision()) || this.isButtonTypeRoute(buttonType)
            )
        },
        setSelectedButtonType(buttonType) {
            this.selectedButtonType = buttonType
        },
        async handleButtonClick(buttonType) {
            if (this.shouldOpenModal(buttonType)) {
                this.setSelectedButtonType(buttonType)
                this.openModal()
            } else {
                await this.executeButtonAction(buttonType)
            }
        },
        async handleModalAction({ buttonType, bpmParameters }) {
            await this.executeButtonAction(buttonType, bpmParameters)
            this.closeModal()
        },
        openModal() {
            this.showModal = true
        },
        closeModal() {
            this.showModal = false
        },
        initializeProcess() {
            if (!this.currentProcessKey) {
                throw new Error('É necessário informar uma "processKey" na prop ou no AzBpmInteraction ascendente.')
            }

            if (!this.currentProcessKey) {
                throw new Error('É necessário informar uma "businessKey" na prop ou no AzBpmInteraction ascendente.')
            }

            this.process = new AzBpmProcess(this.$store, this.currentProcessKey, this.currentBusinessKey)
            this.process.load()
        },
        initializeInteraction() {
            this.interaction = this.findClosestInteraction(this.$parent)
        },
        getComponentName(vm) {
            return (vm && vm.$options && vm.$options.name) || ''
        },
        isBpmInteraction(vm) {
            return this.getComponentName(vm) === AzBpmInteraction.name
        },
        findClosestInteraction(vm) {
            if (!vm) {
                return null
            }

            if (this.isBpmInteraction(vm)) {
                return vm
            }

            return this.findClosestInteraction(vm.$parent)
        },
        setCurrentTaskSelected() {
            if (this.isSetCurrentTaskValid) {
                this.$store.commit(mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_PROCESS, this.setCurrentTaskParams)
                this.$store.commit(mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_INSTANCE, this.setCurrentTaskParams)
            }
        },
        selectParallelTask() {
            if (this.currentTask) {
                this.selectedParallelTask = this.currentTask.id
            }
        },
    },
    watch: {
        select() {
            this.selectParallelTask()
        },
        selectedParallelTask() {
            this.setCurrentTaskSelected()
        },
    },
    computed: {
        setCurrentTaskParams() {
            return {
                processKey: this.currentProcessKey,
                businessKey: this.currentBusinessKey,
                currentTaskId: this.selectedParallelTask,
            }
        },
        isSetCurrentTaskValid() {
            return (
                this.isSelectedParallelTaskValid &&
                this.currentProcessKey &&
                this.currentBusinessKey &&
                this.selectedParallelTask
            )
        },
        isSelectedParallelTaskValid() {
            return this.select.parallel.items.some((obj) => {
                return obj.value === this.selectedParallelTask
            })
        },
        select() {
            return this.components.select || {}
        },
        selectMergedAttrs() {
            return _.merge({}, this.selectDefaultAttrs, this.selectAttrs)
        },
        button() {
            return this.components.button || {}
        },
        buttonTypes() {
            return Object.keys(this.button)
        },
        buttonMergedAttrs() {
            return _.merge({}, this.buttonDefaultAttrs, this.buttonAttrs)
        },
        interactionProps() {
            return (this.interaction && this.interaction.$props) || {}
        },
        currentProcessKey() {
            return this.processKey || this.interactionProps.processKey || ''
        },
        currentBusinessKey() {
            return this.businessKey || this.interactionProps.businessKey || ''
        },
        components() {
            return (this.process && this.process.getComponents()) || {}
        },
        currentTask() {
            return (this.process && this.process.getCurrentTask()) || {}
        },
        currentUo() {
            return this.currentTask.currentUo || null
        },
        currentUoId() {
            return this.currentUo ? this.currentUo.id.toString() : ''
        },
        hasComponents() {
            return !_.isEmpty(this.components)
        },
        hasBpmParameters() {
            return !_.isEmpty(this.bpmParameters)
        },
    },
    created() {
        this.initializeInteraction()
        this.initializeProcess()
    },
}
</script>
