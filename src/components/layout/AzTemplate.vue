<template>
    <component :is="template"/>
</template>

<script>
    import AzTemplateDefault from './templates/AzTemplateDefault'
    import AzTemplateGmail from './templates/AzTemplateGmail'

    export default {
        components: {
            AzTemplateDefault,
            AzTemplateGmail
        },
        props: {
            layout: {
                default: 'default'
            }
        },
        computed: {
            template() {
                const chosenTemplate = this.layout.replace(/\b\w/g, l => l.toUpperCase())
                return `AzTemplate${chosenTemplate}`
            }
        }
    }
</script>