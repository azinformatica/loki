<template>
    <v-navigation-drawer app :mini-variant.sync="asideClosed"
        mini-variant-width="60" width="200" class="az-aside" floating>
        <div class="az-aside__logo">
            <slot name="logo"></slot>
        </div>
        <div class="az-aside__menu">
            <slot name="menu"></slot>
        </div>
        <div :class="{'arrow-opened' : !asideClosed, 'arrow-closed' : asideClosed}">
            <v-btn icon @click="toogle()">
                <v-icon color="white">{{ asideClosed ? 'keyboard_arrow_right' : 'keyboard_arrow_left' }}</v-icon>
            </v-btn>
        </div>
    </v-navigation-drawer>
</template>
<script>
    import actionsTypes from '../store/actions-types'

    export default {
      methods: {
          toogle () {
            this.$store.commit(actionsTypes.TOOGLE_ASIDE)
          },
          change (closed) {
            this.$store.commit(actionsTypes.SET_ASIDE, closed)
          }
      },
      computed: {
        asideClosed: {
            get() {
                return this.$store.state.wids.asideClosed
            },
            set(closed) {
                this.change (closed)
            }
         }
    },
    }
</script>
<style scoped lang="less">
.az-aside {
    background-color: #3a6861;
    padding: 0;

    &__menu{
        height: 100%;
        padding-bottom: 40px;
        padding-top: 120px;
    }

    .arrow-closed {
        position: absolute;
        bottom: 0;
        width: 60px;
        background-color: #3a6861;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;

        .btn {
            height: 28px;
            color: rgba(255, 255, 255, 0.8) !important;
        }

        .btn--icon{
            border-radius: unset;
        }
    }

    .arrow-opened {
        position: absolute;
        bottom: 0;
        width: 200px;
        background-color: #3a6861;
        border-top: 1px solid rgba(255, 255, 255, 0.1);


        .btn {
            height: 28px;
            color: rgba(255, 255, 255, 0.8) !important;
        }
    }
}
</style>
