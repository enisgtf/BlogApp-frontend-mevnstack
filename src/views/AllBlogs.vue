<template>
    <div class="blogs padding" v-if="AllBlogs">
        <h1 class="blogs_title">All Blogs</h1>
        <div class="blogs_wrapper">
            <BlogCard v-for="blog in AllBlogs" :blog="blog" />
        </div>
    </div>
</template>

<script setup>
import BlogCard from '../components/BlogCard.vue'
import { ref } from 'vue'
import { useStore } from '../store/store';
import axios from "axios"

const store = useStore()

const AllBlogs = ref([])

/* getting blogs data */
axios.get("/blogs").then(response => {
    AllBlogs.value = response.data.blogs
}).catch(err => {
    store.displayMessage(err.response.data.message, err.response.data.success)
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