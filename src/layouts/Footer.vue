<template>
    <footer class="padding">
        <div class="info">
            <div class="social">
                <h5 class="social-title">BlogApp</h5>
                <div class="social-icons">
                    <Instagram class="icon"></Instagram>
                    <Linkedin class="icon"></Linkedin>
                    <Twitter class="icon"></Twitter>
                    <Youtube class="icon"></Youtube>
                </div>
            </div>
            <div class="nav">
                <RouterLink class="nav-links" to="/">HOME</RouterLink>
                <RouterLink class="nav-links" to="/blogs">BLOGS</RouterLink>
                <RouterLink class="nav-links" to="/login" v-if="!currentToken">LOGIN/REGISTER</RouterLink>
                <RouterLink class="nav-links" to="/blog-create" v-if="currentToken">CREATE BLOG</RouterLink>
            </div>
        </div>
        <div class="copyright">
            <h6>Copyright 2023 All Rights Reserved</h6>
            <h6>Developed by Enis Gatfar</h6>
        </div>
    </footer>
</template>

<script setup>
import { useStore } from "../store/store.js"
import { storeToRefs } from "pinia"
import Instagram from "../assets/images/Icons/instagram-brands.svg"
import Linkedin from "../assets/images/Icons/linkedin-brands.svg"
import Twitter from "../assets/images/Icons/twitter-brands.svg"
import Youtube from "../assets/images/Icons/youtube-brands.svg"

const store = useStore()
const { currentToken } = storeToRefs(store)

</script>
<style scoped lang="scss">
footer {
    min-height: 300px;
    background-color: var(--clr-bg-grey);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width:768px) {
        flex-direction: column;
        text-align: center;

    }

    .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4rem;

        @media screen and (max-width:768px) {
            flex-direction: column;
            margin-bottom: 4rem;
        }

        .social {
            @media screen and (max-width:768px) {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            &-title {
                font-size: var(--fs-l);
                font-weight: 400;
                margin-bottom: 1rem;
                color: white;
            }

            &-icons {
                .icon {
                    width: 30px;
                    height: 30px;
                    margin-right: 1rem;
                    cursor: pointer;
                }
            }
        }

        .nav {
            display: flex;
            flex-direction: column;

            &-links {
                padding-bottom: 1rem;
                color: white;
            }
        }
    }

    .copyright {
        h6 {
            font-size: var(--fs-s);
            font-weight: 300;
        }
    }
}
</style>