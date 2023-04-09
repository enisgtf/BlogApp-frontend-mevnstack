import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: "Home",
        component: () => import('../views/Home.vue'),
        meta: {
            title: 'Home'
        }
    },
    {
        path: '/blogs',
        name: "Blogs",
        component: () => import('../views/AllBlogs.vue'),
        meta: {
            title: 'Blogs'
        }
    },
    {
        path: '/blogs/:username',
        name: "User Blogs",
        component: () => import('../views/UserBlogs.vue'),
        meta: {
            title: 'User Blogs'
        }
    },
    {
        path: '/blogs/:username/:blogId',
        name: "Blog",
        component: () => import('../views/BlogPage.vue'),
        meta: {
            title: 'Blog'
        }
    },
    {
        path: '/blogs/:username/:blogId/blog-update',
        name: "Update Blog",
        component: () => import('../views/UpdateBlog.vue'),
        meta: {
            title: 'Update Blog'
        }
    },
    {
        path: '/blog-create',
        name: "Create Blog",
        component: () => import('../views/CreateBlog.vue'),
        meta: {
            title: 'Create Blog'
        }
    },
    {
        path: '/login',
        name: "Login",
        component: () => import('../views/Login.vue'),
        meta: {
            title: 'Login'
        },
        beforeEnter: (to, from, next) => {
            const store = useStore()
            store.signOut()
            return next()
        }
    },
    {
        path: '/register',
        name: "Register",
        component: () => import('../views/Register.vue'),
        meta: {
            title: 'Register'
        },
        beforeEnter: (to, from, next) => {
            const store = useStore()
            store.signOut()
            return next()
        }
    },
    {
        path: '/profile',
        name: "Profile",
        component: () => import('../views/Profile.vue'),
        meta: {
            title: 'Your Profile'
        },
        beforeEnter: (to, from, next) => {
            const store = useStore()
            const { isLoggedIn } = storeToRefs(store)
            if (isLoggedIn.value != true) return next('/')
            return next()
        }
    },
    {
        path: '/page-not-found',
        name: "404 Page",
        component: () => import('../views/404.vue'),
        meta: {
            title: 'Page not found'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/page-not-found'
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title + " | BlogApp";
    next();
});

export default router;

