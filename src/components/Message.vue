<template>
    <transition name="animation" v-if="showMessage">
        <div class="message"
            :class="messageSuccess === true ? 'successTrue' : '', messageSuccess === false ? 'successFalse' : ''">
            <p>{{ message }}</p>
        </div>
    </transition>
</template>

<script setup>
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';

const store = useStore()
const { showMessage, message, messageSuccess } = storeToRefs(store)

</script>

<style scoped lang="scss">
.message {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
    position: fixed;
    bottom: 4rem;
    right: 4rem;
    border-radius: 2rem;
    max-width: 500px;
    min-width: 300px;
    min-height: 60px;
    font-size: var(--fs-m);
    text-align: center;
    background-color: #e4e4e4;
    color: #383D41;
    padding: 2rem;

    @media (max-width:768px) {
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        font-size: var(--fs-s);
    }


    &.successTrue {
        background-color: #D4EDDA;
        color: #266534;
    }

    &.successFalse {
        background-color: #F8D7DA;
        color: #8d1723;
    }
}

.animation-enter-active,
.animation-leave-active {
    transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.animation-enter-from,
.animation-leave-to {
    opacity: 0;

    @media (min-width:779px) {
        transform: translateX(-100px);
    }

    @media (max-width:769px) {
        transform: translateY(-50px);
    }
}
</style>