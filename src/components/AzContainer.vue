<template>
    <div class="az-container">
        <slot/>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="less">
    .az-container {
        margin: 20px;
        padding: 20px;
        background-color: white;
        min-height: 400px;

        .az-table-list {
            thead {
                border: none;
                tr:first-child {
                    height: 35px !important;
                    border-bottom: 2px solid #e9e9e9 !important;
                }

                tr th {
                    color: #3a6861 !important;
                    font-weight: bold;
                    padding: 0 20px !important;
                }
            }

            tbody tr:nth-child(even) {
                background-color: #f9f9f9;
            }

            tbody tr {
                border-bottom: 1px solid #e9e9e9 !important;
                td {
                    height: 40px;
                    color: #888;
                    font-size: 13px;
                    font-weight: normal;
                    padding: 0 20px !important;
                }
                .table-actions a i {
                    font-size: 18px;
                    color: #888;
                }
                .table-actions a {
                    margin-left: 10px;
                }
            }
        }
    }
</style>
