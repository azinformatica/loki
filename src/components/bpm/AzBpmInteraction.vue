<template>
    <div>
        <slot :hasAuthority="hasAuthority" :components="components" :processInstance="processInstance"></slot>
    </div>
</template>

<script>
import AzBpmProcess from '../../utils/bpm/AzBpmProcess'

export default {
    name: 'AzBpmInteraction',
    props: {
        id: {
            type: String,
            required: true,
        },
        authorities: {
            default: () => [],
            type: Array,
        },
        businessKey: {
            type: String,
            required: true,
        },
        processKey: {
            type: String,
            required: true,
        },
        disabled: {
            default: false,
            type: Boolean,
        },
    },
    data() {
        return {
            process: null,
        }
    },
    computed: {
        hasAuthority() {
            return !this.disabled && this.process.hasAuthority(this.authorities)
        },
        processInstance() {
            return this.process.getProcessInstance()
        },
        components() {
            return this.process.getComponents()
        },
    },
    created() {
        this.process = new AzBpmProcess(this.$store, this.processKey, this.businessKey)
        this.process.load()
    },
}
</script>

<style scoped></style>
