<template>
    <v-progress-linear indeterminate :active="loading" />
</template>

<script>
export default {
    name: 'LoadingPlaceHolder',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    }
}
</script>
