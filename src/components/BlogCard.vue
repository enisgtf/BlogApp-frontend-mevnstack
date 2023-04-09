<template>
    <div class="card" v-if="blog && blog.author !== '641e4928414cb87f8069d371'">
        <div class="card_image">
            <RouterLink :to="`/blogs/${blog.authorData.username}/${blog._id}`"><img :src="blog.coverImgSrc"
                    alt="Blog cover photo">
            </RouterLink>
        </div>
        <div class="card_content">
            <div class="card_content-author" v-if="!blog.authorData.admin">@{{ blog.authorData.username }}</div>
            <div class="card_content-title">{{ blog.title }}</div>
            <div class="card_content-date">Posted on: {{ formattedDate }}</div>
            <div class="card_content-commercial">{{ blog.commercialSentence }}</div>
            <div class="card_content-link">
                <RouterLink :to="`/blogs/${blog.authorData.username}/${blog._id}`" class="card_content-link-title">VIEW THE
                    POST
                    <ArrowRight class="icon"></ArrowRight>
                </RouterLink>
            </div>
        </div>
        <div class="card_admin" v-if="blog.author == currentUserData._id || currentUserData.admin">
            <button type="button" class="card_admin_button">
                <Edit class="icon" @click="editButton"></Edit>
            </button>
            <button type="button" class="card_admin_button">
                <Delete class="icon" @click="showModal = true"></Delete>
            </button>
        </div>
    </div>
    <modal class="confirmModal" v-if="showModal" @close="showModal = false">
        <p class="confirmModal-title">Are you sure you want to delete this blog?</p>
        <div class="confirmModal-buttons">
            <button @click="confirmDelete" class="confirmModal-button">Yes</button>
            <button @click="showModal = false" class="confirmModal-button">No</button>
        </div>
    </modal>
</template>
<script setup>
import { defineProps, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
import ArrowRight from '../assets/images/Icons/arrow-right-light.svg'
import Edit from '../assets/images/Icons/edit-regular.svg'
import Delete from '../assets/images/Icons/trash.svg'
import axios from 'axios';


const store = useStore()
const { currentUserData } = storeToRefs(store)

const router = useRouter()

/* get props */
const props = defineProps(["blog"])
let blog = ref(props.blog)


/* Delete button */
const showModal = ref(false);
const confirmDelete = () => {
    axios.delete(`/blogs/${blog.value._id}`).then(response => {
        store.displayMessage(response.data.message, response.data.success);

        showModal.value = false
    }).catch(err => {
        store.displayMessage(err.response.data.message, err.response.data.success);
    })
}


/* Edit button */
const editButton = () => {
    router.push(`/blogs/${blog.value.authorData.username}/${blog.value._id}/blog-update`)
}


/* Date formating */
const date = new Date(blog.value.createdAt)
const options = { year: 'numeric', month: 'long', day: 'numeric' }
const formattedDate = date.toLocaleDateString('en-US', options)

</script>

<style scoped lang="scss">
.card {
    background-color: white;
    border-radius: 1rem;
    width: 100%;
    height: 100%;
    transition: all ease .4s;
    position: relative;

    &:hover {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
        transform: rotate(1deg)
    }

    &_admin {
        position: absolute;
        bottom: 10px;
        right: 10px;
        display: flex;
        gap: 1rem;

        &_button {
            width: 30px;
            height: 30px;
            background-color: transparent;
            border: none;

            .icon {
                width: 100%;
                height: 100%;
                cursor: pointer;

                &:hover {
                    transform: scale(1.1);
                }
            }
        }

    }

    &_image {
        overflow: hidden;
        height: 250px;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;



        img {
            width: 100%;
            height: 100%;
        }
    }

    &_content {
        position: relative;
        padding: 1rem;
        min-height: 200px;
        color: var(--clr-text);

        &-author {
            font-weight: 300;
            margin-bottom: .2rem;
        }

        &-title {
            font-size: var(--fs-s);
            font-weight: 400;
        }

        &-date {
            font-size: var(--fs-xs);
            font-weight: 300;
            margin-bottom: .8rem;
        }

        &-commercial {
            font-weight: 300;
            font-size: var(--fs-xs);
            color: var(--clr-text);
        }

        &-link {
            position: absolute;
            bottom: 1rem;
            margin-top: 1rem;

            &-title {
                font-size: var(--fs-xs);
                display: flex;
                align-items: center;
            }
        }
    }
}

.confirmModal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 2rem;
    max-width: 400px;
    width: 100%;
    min-height: 200px;
    background-color: white;
    color: var(--clr-text);
    border-radius: 2rem;
    box-shadow: -2px 3px 18px 6px rgba(0, 0, 0, 0.5);


    .confirmModal-title {
        font-size: 1.5em;
        margin-bottom: 15px;
        text-align: center;
    }

    .confirmModal-button {
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        cursor: pointer;

        &:first-of-type {
            background-color: #4CAF50;
            /* Green */
            color: white;
            margin-right: 10px;
        }

        &:last-of-type {
            background-color: #f44336;
            /* Red */
            color: white;
        }

        &:hover {
            opacity: 0.8;
        }
    }
}
</style>