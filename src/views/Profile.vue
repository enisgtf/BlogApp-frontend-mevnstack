<template>
    <div class="profile padding">
        <h2 class="profile_title">Your Profile</h2>
        <div class="profile_info">
            <h4 v-if="currentUserData.admin" class="profile_info_admin">ADMIN PROFILE</h4>
            <h4 class="profile_info_created-at">Register Date: {{ formattedDate }}</h4>
            <form class="form" @submit.prevent="updateUser">
                <label for="name">Name</label>
                <input type="text" id="name" placeholder="Name" v-model="newUserData.name">
                <label for="lastname">Lastname</label>
                <input type="text" id="lastname" placeholder="Lastname" v-model="newUserData.lastname">
                <label for="username">Username</label>
                <input type="text" id="username" placeholder="Username" minlength="6" maxlength="16"
                    v-model="newUserData.username">
                <label for="email">Email</label>
                <input type="text" id="email" placeholder="Email" disabled :value="currentUserData.email">
                <input type="submit" value="Update" :disabled="!isUpdated">
            </form>
        </div>
    </div>
    <h1 class="blogs_title" v-if="MyBlogs.length"> My Blogs</h1>
    <div class="blogs padding" v-if="MyBlogs.length">
        <div class="blogs_wrapper">
            <BlogCard v-for="blog in MyBlogs" :blog="blog" />
        </div>
    </div>
    <button class="deleteProfile" @click="showModal = true">Delete All Profile</button>
    <modal class="confirmModal" v-if="showModal" @close="showModal = false">
        <p class="confirmModal-title">All blogs and all comments will be deleted along with the user. <br>
            Are you sure you want to delete the user?</p>
        <div class="confirmModal-buttons">
            <button @click="confirmDelete" class="confirmModal-button">Yes</button>
            <button @click="showModal = false" class="confirmModal-button">No</button>
        </div>
    </modal>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useStore } from '../store/store.js'
import { storeToRefs } from 'pinia';
import BlogCard from '../components/BlogCard.vue'
import axios from 'axios';

const store = useStore()
const { currentUserData } = storeToRefs(store)


/* Update profile process */
const userID = currentUserData.value._id
const newUserData = reactive({
    name: currentUserData.value.name,
    lastname: currentUserData.value.lastname,
    username: currentUserData.value.username,
})

const isUpdated = computed(() => {
    if (
        newUserData.name !== currentUserData.value.name ||
        newUserData.lastname !== currentUserData.value.lastname ||
        newUserData.username !== currentUserData.value.username
    ) {
        return true
    }
    return false
})

const updateUser = () => {
    axios.put(`/users/${userID}`, newUserData).then(response => {
        if (response.data.success) {
            store.updateUser(newUserData)
            console.log(currentUserData)
        }
    }).catch(err => {
        const errData = err.response?.data
        console.log(errData);
    })
}


/* Profile page includes blogs of user */
const MyBlogs = ref([])
axios.get(`/blogs/user/${currentUserData.value._id}`).then(response => {
    MyBlogs.value = response.data.data
}).catch(err => {
    store.displayMessage(err.response.data.message, err.response.data.success);
})

/* Date formatting */
const date = new Date(currentUserData.value.createdAt)
const options = { year: 'numeric', month: 'long', day: 'numeric' }
const formattedDate = date.toLocaleDateString('tr-TR', options)


/* Profile Deleting */
const showModal = ref(false)
const confirmDelete = () => {
    axios.delete(`/users/${userID}`).then(response => {
        store.displayMessage(response.data.message, response.data.success)
        if (response.data.success) {
            store.signOut()
        }
    }).catch(err => {
        store.displayMessage(err.response.data.message, err.response.data.success);
    })
}
</script>

<style scoped lang="scss">
.profile {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &_title {
        font-weight: 400;
        font-size: var(--fs-xl);
        margin-bottom: 2rem;
    }

    &_info {
        max-width: 600px;
        width: 100%;
        padding: 2rem;
        border-radius: 2rem;
        background-color: var(--clr-bg-lightgrey);

        &_admin {
            font-weight: 400;
            margin-bottom: 1rem;
            text-align: center;
            font-size: var(--fs-m);
        }

        &_created-at {
            font-weight: 300;
            margin: 1rem 0;
            text-align: center;
        }

        .form {
            align-items: start;

            label {
                padding-left: 1rem;
            }

            input {
                margin-bottom: 3rem;

                &[type="submit"] {
                    align-self: center;
                    margin-bottom: 0;

                    &[disabled] {
                        background-color: rgb(195, 195, 195);
                        pointer-events: none;
                    }
                }
            }

        }
    }
}

.blogs {
    background-color: var(--clr-bg-lightgrey);


    &_title {
        font-weight: 400;
        font-size: var(--fs-xl);
        margin: 3rem 0;

        text-align: center;
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

.deleteProfile {
    background-color: #F8D7DA;
    color: #8d1723;
    border: none;
    padding: 1rem;
    font-size: var(--fs-m);
    display: block;
    margin: 3rem auto;

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