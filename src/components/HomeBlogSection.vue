<template>
    <div class="blog" v-if="blog" :class="blog?.directionForDesktop === true ? 'changeDirection' : ''">
        <div class="blog_content">
            <div class="blog_content_container">
                <h2>{{ blog.title }}</h2>
                <P>{{ blog.commercialSentence }}</P>
                <RouterLink
                    :to="blog._id === welcomeSectionID ? currentToken === '' ? '/login' : '/blog-create' : `/blogs/home-blogs/${blog._id}`">
                    {{ blog._id ===
                        welcomeSectionID ? currentToken === '' ? "LOGIN/REGISTER" : "CREATE A BLOG" : "VIEW THE POST" }}
                    <ArrowRight class="icon" />
                </RouterLink>
            </div>
        </div>
        <div class="blog_photo">
            <img :src="blog.coverImgSrc">
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
import ArrowRight from '../assets/images/Icons/arrow-right-light.svg'

const store = useStore()
const { currentToken } = storeToRefs(store)

const props = defineProps(["blog"])
const blog = props.blog

const welcomeSectionID = "642ef1a81227c28bce462f8c"

</script>

<style lang="scss" scoped>
.changeDirection {
    flex-direction: row-reverse;
}

.blog {
    height: 650px;
    display: flex;

    @media (max-width: 768px) {
        flex-direction: column;
        height: auto;
    }

    &_content {
        flex: 3;
        padding: 3rem;
        background-color: var(--clr-bg-grey);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;


        @media (max-width: 768px) {
            order: 2;
            padding: 3rem;
        }

        &_container {
            max-width: 440px;

            h2 {
                font-size: var(--fs-xl);
                font-weight: 300;
                margin-bottom: 2rem;
                color: white;



                @media (max-width: 768px) {
                    font-size: var(--fs-l);
                }
            }

            p {
                font-weight: 300;
                margin-bottom: 2rem;
                color: white;

            }

            a {
                color: white;
                display: inline-flex;
                align-items: center;
                gap: .5rem;


            }
        }
    }

    &_photo {
        flex: 4;
        overflow: hidden;

        @media (max-width: 768px) {
            order: 1;
            max-height: 300px;
        }

        img {
            object-fit: cover;
        }
    }
}
</style>