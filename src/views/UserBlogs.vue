<template>
    <div class="blogs padding">
        <h1 class="blogs_title">{{ username }} Blogs</h1>
        <div class="blogs_wrapper">
            <BlogCard v-for="blog in userBlogs" :blog="blog" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '../store/store';
import { useRoute } from 'vue-router'
import BlogCard from '../components/BlogCard.vue'
import axios from 'axios'

const store = useStore()
const route = useRoute()

/* user info */
const username = route.params.username
const userId = route.query.userId

/* getting user blogs */
const userBlogs = ref([])
axios.get(`/blogs/user/${userId}`).then(response => {
    userBlogs.value = response.data.data
}).catch(err => {
    store.displayMessage(err.response.data.message, err.response.data.success);
})
</script>

<style scoped lang="scss">
.blogs {
    background-color: var(--clr-bg-lightgrey);


    &_title {
        font-size: var(--fs-l);
        font-weight: 400;
        margin-bottom: 3rem;
    }

    &_wrapper {
        display: grid;
        justify-items: center;
        gap: 2rem;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto;

        @media (max-width: 1200px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 600px) {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>