<template>
    <div class="page-wrap">
        <div class="login-wrap">
            <h3 class="register-title">Don't you have an account?
                <RouterLink class="register-subtitle" to="/register">Register</RouterLink>
            </h3>
            <h1 class="login-title">Login to BlogApp</h1>
            <form class="form" @submit.prevent="loginUser">
                <input type="email" name="email" placeholder="Email" v-model="userData.email" required>
                <input type="password" name="password" placeholder="Password" v-model="userData.password" required>
                <input type="submit" value="SIGN IN">
            </form>
        </div>
        <div class="bg">
            <img src="../assets/images/background.png" alt="background">
        </div>
    </div>
</template>
<script setup>
import { reactive } from "vue"
import { useStore } from "../store/store.js"
import { RouterLink, useRouter } from "vue-router";
import axios from "axios"

const store = useStore()
const router = useRouter()

/* Login process */
const userData = reactive({
    email: "",
    password: ""
})

const loginUser = () => {
    axios.post("/users/login", userData).then(response => {
        if (response.data.success) {
            const token = response.data.token
            const userData = response.data.userData
            // store save
            store.signIn(token, userData)
            // localstorage save
            localStorage.setItem('currentToken', token)
            localStorage.setItem('currentUserData', JSON.stringify(userData))
        }
        store.displayMessage(response.data.message, response.data.success)
        router.push({ name: "Home" })
    }).catch(err => {
        store.displayMessage(err.response.data.message, err.response.data.success)
    })
}

</script>

<style scoped lang="scss">
.page-wrap {
    display: flex;
    justify-content: space-between;

    .login-wrap {
        padding: 1rem;
        flex: 1;
        text-align: center;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .register-title {
            font-size: var(--fs-s);
            display: inline-block;
            font-weight: 400;

            .register-subtitle {
                font-weight: 500;
                text-decoration: underline;
                margin-bottom: 1rem;
            }
        }

        .login-title {
            margin: 2rem 0;
            color: var(--clr-text-light);
            font-size: 40px;

        }

    }

    .bg {
        height: 100vh;
        flex: 2;

        @media (max-width:900px) {
            display: none;
        }

        img {
            object-fit: cover;
        }

    }
}
</style>

