<template>
    <div class="page-wrap">
        <div class="register-wrap">
            <h3 class="login-title">You have already an account?
                <RouterLink class="login-subtitle" to="/login">Login</RouterLink>
            </h3>
            <h1 class="register-title">Register to BlogApp</h1>
            <form class="form" @submit.prevent="registerUser">
                <input type="text" name="name" placeholder="Name" v-model="userData.name" required>
                <input type="text" name="surname" placeholder="Lastname" v-model="userData.lastname" required>
                <input type="text" name="username" placeholder="Username" minlength="6" maxlength="16"
                    v-model="userData.username" required>
                <input type="email" name="email" placeholder="Email" v-model="userData.email" required>
                <input type="password" name="password" placeholder="Password" minlength="6" v-model="userData.password"
                    required>
                <input type="submit" value="SIGN UP">
            </form>
        </div>
        <div class="bg">
            <img src="../assets/images/background.png" alt="background">
        </div>
    </div>
</template>

<script setup>
import { reactive } from "vue"
import { useStore } from "../store/store";
import { useRouter, RouterLink } from "vue-router";
import axios from "axios"

const store = useStore()
const router = useRouter()

/* Register process */
const userData = reactive({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
})

const registerUser = () => {
    axios.post('/users/register', userData).then(response => {
        store.displayMessage(response.data.message, response.data.success)
        router.push({ name: "Login" })
    }).catch(err => {
        store.displayMessage(err.response.data.message, err.response.data.success);
    })
}
</script>

<style scoped lang="scss">
.page-wrap {
    display: flex;
    justify-content: space-between;

    .register-wrap {
        padding: 1rem;
        flex: 1;
        text-align: center;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .login-title {
            font-size: var(--fs-s);
            display: inline-block;
            font-weight: 400;

            .login-subtitle {
                font-weight: 500;
                text-decoration: underline;
                margin-bottom: 1rem;
            }
        }

        .register-title {
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