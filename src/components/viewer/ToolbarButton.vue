<template>
    <v-btn icon v-bind="$attrs" v-on="$listeners">
        <v-tooltip bottom open-delay="800">
            <span>{{ tooltip }}</span>
            <template v-slot:activator="{ on }">
                <v-icon v-on="on">{{ icon }}</v-icon>
            </template>
        </v-tooltip>
    </v-btn>
</template>

<script>
export default {
    name: 'ToolbarButton',
    props: {
        icon: {
            type: String,
            required: true,
        },
        tooltip: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped></style>
