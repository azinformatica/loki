<template>
    <v-timeline dense>
        <v-timeline-item
            v-for="n in history"
            :key="n"
        >
            <v-row class="pt-1">
                <v-col cols="3">
                    <strong> {{ history.date }} </strong>
                </v-col>
                <v-col>
                    <strong> {{ history.date }} </strong>
                </v-col>
            </v-row>
        </v-timeline-item>
    </v-timeline>
</template>

<script>
import AzBpmHistory from '../../utils/AzBpmHistory'

export default {
    name: 'AzBpmHistory',
    props: {
        businessKey: {
            type: String,
            required: true,
        },
        processKey: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            azBpmHistory: null,
            history: [],
        }
    },
    methods: {
        initializeAzBpmHistory() {
            this.azBpmHistory = new AzBpmHistory(this.$store)
        },
        fetchHistory() {
            this.history = this.azBpmHistory.getHistory(this.processKey, this.businessKey)
        },
    },
    async created() {
        this.initializeAzBpmHistory()
        await this.fetchHistory()
    },
}
</script>

<style scoped></style>
