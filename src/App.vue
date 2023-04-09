<template>
    <Header v-if="currentRouteName !== 'Login' && currentRouteName !== 'Register'" />
    <router-view />
    <Footer v-if="currentRouteName !== 'Login' && currentRouteName !== 'Register'" />
    <!-- all messages show on App -->
    <Message />
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router';
import Header from './layouts/Header.vue';
import Footer from './layouts/Footer.vue';
import Message from './components/Message.vue';
import { useStore } from './store/store';


/* This is checking localstorage for login and authentication */
const store = useStore()
store.checkLocalStorage()


/* Login and register page don't have Header and Footer component. */
const route = useRoute()
const currentRouteName = computed(() => route.name)



</script>

<style lang="scss">
/* the reason of why i also imported variables with css is that scss variables are not reactive on mediaquery */
@import '../src/assets/style/variables.css';
@import './assets/style/index.scss';
</style>
