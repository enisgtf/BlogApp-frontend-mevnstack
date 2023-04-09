<template>
    <header>
        <div class="container">
            <RouterLink to="/" class="logo">BlogApp</RouterLink>
            <nav :class="showMobileMenu ? 'active' : ''">
                <RouterLink class="nav-link" to="/">HOME</RouterLink>
                <RouterLink class="nav-link" to="/blogs">BLOGS</RouterLink>
                <RouterLink v-if="isLoggedIn" class="nav-link" to="/blog-create">CREATE BLOG</RouterLink>
                <RouterLink v-if="!isLoggedIn" class="nav-link" to="/login">LOGIN/REGISTER</RouterLink>
                <RouterLink v-if="isLoggedIn" class="nav-link profile-link" to="/profile">ACCOUNT</RouterLink>
                <RouterLink v-if="isLoggedIn" class="nav-link profile-link" to="/" @click="signOut">SIGN OUT</RouterLink>
                <div class="profile" v-if="isLoggedIn">
                    <h6 class="profile_icon" @click="profileToggle" v-if="currentUserData">{{ profileImg() }}</h6>
                    <div class="profile_menu" :class="showProfileMenu ? 'active' : ''">
                        <div class="profile_menu_top">
                            <div class="profile_menu_top-icon">{{ profileImg() }}</div>
                            <div class="profile_menu_top-info">
                                <h6>{{ currentUserData.name + " " + currentUserData.lastname }}</h6>
                                <h6>@{{ currentUserData.username }}</h6>
                                <h6>{{ currentUserData.email }}</h6>
                            </div>
                        </div>
                        <div class="profile_menu_bottom">
                            <RouterLink class="profile_menu_bottom-link" to="/profile" @click="closeProfileMenu">
                                <profileIcon class="profile_menu_bottom-link-icon icon" /> Profile
                            </RouterLink>
                            <RouterLink class="profile_menu_bottom-link" to="/" @click="signOut">
                                <signoutIcon class="profile_menu_bottom-link-icon icon" /> Sign out
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </nav>
            <menuIcon @click="menuToggle" class="mobile-icon icon" />
        </div>
    </header>
    <!-- for fixed header -->
    <div class="header-filled"></div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import menuIcon from '../assets/images/Icons/bars-regular.svg';
import profileIcon from '../assets/images/Icons/user-crown-light.svg';
import signoutIcon from '../assets/images/Icons/sign-out-alt-regular.svg';
import { useStore } from "../store/store";
import { storeToRefs } from "pinia";

const store = useStore()
const { isLoggedIn, currentUserData, currentToken } = storeToRefs(store)

const showMobileMenu = ref(false)
const menuToggle = () => {
    showMobileMenu.value = !showMobileMenu.value
}



/* Profile */
const showProfileMenu = ref(false)
const profileToggle = () => {
    showProfileMenu.value = !showProfileMenu.value
}
const closeProfileMenu = () => {
    showProfileMenu.value = false
}

const profileImg = () => {
    if (currentUserData.value) {
        const defaultImg = currentUserData.value.name.charAt(0).toUpperCase() + currentUserData.value.lastname.charAt(0).toUpperCase()
        return defaultImg
    } else {
        return ""
    }
}

/* Sign out */
const signOut = () => {
    store.signOut()
    showProfileMenu.value = false
    store.displayMessage('You logged out.', null)
}

</script>

<style lang="scss" scoped>
header {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
    height: 80px;
    display: flex;
    position: fixed;
    top: 0;
    z-index: 100;
    background-color: white;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    @media (max-width:1450px) {
        padding: 0 1rem;
    }

    .container {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
    }

    .logo {
        font-size: var(--fs-l);
        font-weight: 500;

    }

    nav {
        display: flex;
        align-items: center;
        gap: 2rem;
        transition: all ease 0.4s;

        @media (max-width: 768px) {
            align-items: start;
            position: fixed;
            top: 0;
            left: 0;
            transform: translateX(-100%);
            flex-direction: column;
            background-color: var(--clr-bg-grey);
            padding: 2rem 1rem;
            width: 250px;
            height: 150vh;

            .nav-link {
                color: white;
            }

            &.active {
                transform: translateX(0);
            }

        }

        .nav-link {
            transition: all .3s ease;

            font-size: var(--fs-s);
            font-weight: 500;

            &:hover {
                color: var(--clr-hover);
            }
        }



        .profile {
            position: relative;

            @media (max-width: 768px) {
                display: none;
            }


            &_icon {
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                background-color: var(--clr-bg-grey);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                user-select: none;
            }

            &_menu {
                position: absolute;
                top: 4rem;
                right: 0rem;
                z-index: 10;
                width: 250px;
                display: none;

                &.active {
                    display: block;

                }

                color: white;
                background-color: var(--clr-bg-grey);
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%),
                0 2px 4px -1px rgb(0 0 0 / 6%);

                &::before {
                    content: '';
                    background-color: var(--clr-bg-grey);
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    top: -8px;
                    right: 8px;
                    transform: rotate(45deg);
                }

                &_top {
                    display: flex;
                    align-items: center;
                    height: 80px;
                    border-bottom: 1px solid white;

                    &-icon {
                        margin-left: 1rem;
                        width: 40px;
                        height: 40px;
                        background-color: white;
                        color: var(--clr-bg-grey);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 50%;
                    }

                    &-info {
                        margin-left: 1rem;

                        h6 {
                            font-size: var(--fs-xxs);
                            font-weight: 300;
                            color: white;

                        }
                    }
                }

                &_bottom {
                    &-link {
                        color: white;
                        display: flex;
                        align-items: center;
                        height: 40px;
                        padding-left: 1rem;


                        &-icon {
                            margin-right: 1rem;
                        }
                    }
                }

            }
        }
    }

    .mobile-icon {
        display: none;

        @media (max-width: 768px) {
            display: block;
            cursor: pointer;
        }
    }
}

.header-filled {
    height: 80px;
}
</style>