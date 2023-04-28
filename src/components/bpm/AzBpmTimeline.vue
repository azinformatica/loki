<template>
    <v-timeline dense>
        <v-timeline-item v-for="log in history" :key="log.taskName" :icon="log.icon">
            <v-row class="mt-2">
                <v-col>
                    {{ log.date }}
                </v-col>
                <v-col>
                    {{ log.taskName }}
                </v-col>
                <v-col>
                    {{ log.status }}
                </v-col>
                <v-col>
                    {{ log.assignee }}
                </v-col>
                <v-col>
                    {{ log.nextTaskName }}
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
        async fetchHistory() {
            this.history = await this.azBpmHistory.getHistory(this.processKey, this.businessKey)
        },
    },
    async created() {
        this.initializeAzBpmHistory()
        await this.fetchHistory()
    },
}
</script>

<style scoped></style>
