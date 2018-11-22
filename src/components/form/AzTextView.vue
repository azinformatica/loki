<template>
    <div class="az-text">
        <label>{{ label }}</label>
        <p>{{ text }}</p>
    </div>
</template>

<script>
    export default {
        name: 'AzTextView',
        props: {
            label: {
                type: String,
                default: ''
            },
            text: {
                required: true
            }
        }
    }
</script>