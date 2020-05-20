<template>
    <v-progress-linear indeterminate :active="loading" v-show="loading" />
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
