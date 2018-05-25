<template>
    <div class="az-search">
        <div class="input_search">
            <v-text-field
                label="Buscar por Código"
                single-line
                auto-grow
                v-model="teste"
            ></v-text-field>
        </div>

        <a class="btn-search">
            <v-icon small>search</v-icon>
        </a>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                teste:null
            }
        }
    }
</script>

<style lang="less">
.az-search{
    display: flex;
    .input_search {
        width: 300px;
        background-color: #eee;
        border-radius: 20px 0 0 20px;
    }

    .btn-search {
        margin-right: 10px;
        padding: 5px 10px;
        background-color: #3a6861;
        border-radius: 0 20px 20px 0;
        .icon {
            color: rgba(255, 255, 255, 0.8);
            font-size: 13px;
            font-weight: bold;
        }
    }
}

.az-search .input_search {
    .input-group {
        margin: 0;
        padding: 0 15px;

        label {
            font-size: 13px;
            padding-left: 15px;
            top: 0;
        }

        &__input input {
            font-size: 13px;
        }

        &__details {
            display: none;
        }
    }

}
</style>
