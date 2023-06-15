<template>
    <div class="page">
        <HomeBlogSection v-for="blog in HomeBlogs" :blog="blog" />
        <div class="most-section padding">
            <h2 class="most-section_title">View Most Clicked Blogs</h2>
            <div class="most-section_container">
                <BlogCard v-for="blog in MostViewed" :blog="blog" />
            </div>
        </div>
        <div class="action-section padding">
            <p class="action-section_title">{{ currentToken === "" ?
                "SIGN UP NOW AND SHARE YOUR BLOGS WİTH PEOPLE" :
                "START A NEW BLOG NOW AND SHARE IT WITH PEOPLE" }}
            </p>
            <RouterLink v-if="currentToken === ''" to="/register" class="action-section_button">SIGN UP NOW<ArrowRight
                    class="icon"></ArrowRight>
            </RouterLink>
            <RouterLink v-if="currentToken !== ''" to="/blogs/create" class="action-section_button">CREATE NEW POST
                <ArrowRight class="icon"></ArrowRight>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useStore } from '../store/store.js'
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import HomeBlogSection from '../components/HomeBlogSection.vue'
import BlogCard from '../components/BlogCard.vue'
import ArrowRight from '../assets/images/Icons/arrow-right-light.svg'
import axios from "axios"

const store = useStore()
const { currentToken } = storeToRefs(store)


store.displayMessage("If the images are not loading due to the FREE backend server :/ , wait 1 minute and refresh the page!", false)

/* blogs from API */
const HomeBlogs = ref([])
const MostViewed = ref([])

/* getting datas from API */
axios.get("/blogs/homeblogs").then(response => {
    const homeBlogs = response.data.blogs
    HomeBlogs.value.push(...homeBlogs)
    HomeBlogs.value.forEach((blog, index) => {
        if (index % 2 === 1) {
            blog.directionForDesktop = true
        }
    })
}).catch(err => {
    store.displayMessage(err.response.data.message, err.response.data.success)
})

axios.get("/blogs/most-viewed").then(response => {
    const mostViewed = response.data.blogs
    MostViewed.value.push(...mostViewed)
}).catch(err => {
    store.displayMessage(err.response.data.message, err.response.data.success)
})
</script>

<style scoped lang="scss">
.most-section {
    background-color: var(--clr-bg-lightgrey);


    &_title {
        font-size: var(--fs-l);
        font-weight: 400;
        margin-bottom: 3rem;
    }

    &_container {
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

.action-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3rem;
    height: 400px;

    @media screen and (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        height: 350px;
    }

    &_title {
        font-size: var(--fs-l);
        font-weight: 300;
        max-width: 400px;
    }

    &_button {
        background-color: var(--clr-bg-grey);
        color: white;
        padding: 1rem 2rem;
        display: flex;
        align-items: center;
        border-radius: 2rem;
    }
}
</style>