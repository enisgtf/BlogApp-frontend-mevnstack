<template>
    <div class="container padding">
        <div v-if="blog" class="blog">
            <h1 class="blog_title"> {{ blog.title }}</h1>
            <div class="blog_details">
                <div class="blog_details_viewed"> Viewed: {{ blog.viewed }}</div>
                <div class="blog_details_createdAt">Created at: {{ blog.createdAt }}</div>
            </div>
            <img class="blog_img" :src="blog.coverImgSrc" alt="cover">
            <div class="blog_paragraph" v-html="blog.blogContent"></div>
            <div class="blog_actions">
                <div class="blog_actions_approval">
                    <button type="button" class="blog_actions_approval_button" id="like" @click="likeBlog"
                        :class="likedBlog ? 'liked' : ''" >({{ blog.likes.length }})
                        <LikeIcon class="icon"></LikeIcon> Like the Blog
                    </button>
                    <button type="button" class="blog_actions_approval_button" id="dislike" @click="dislikeBlog"
                        :class="dislikedBlog ? 'disliked' : ''" >({{ blog.dislikes.length }})
                        <DislikeIcon class="icon"></DislikeIcon>Dislike the Blog
                    </button>
                </div>
                <div class="blog_actions_comment">
                    <h2 class="blog_actions_comment-title">Write a comment</h2>
                    <div class="blog_actions_comment_form">
                        <textarea type="text" class="blog_actions_comment_form-message" placeholder="Comment"
                            v-model="commentMessage"></textarea>
                        <button type="submit" class="blog_actions_comment_form-submit"
                            :disabled="commentMessage == ''" @click="createComment">
                            Submit</button>
                    </div>
                    <h2 class="blog_actions_comment-title">All Comments</h2>
                    <Comment v-for="comment in blog.comments" :comment="comment" />
                    <h3 v-show="blog.comments.length == 0" class="blog_actions_comment-nocomment">
                        Write the first comment on this blog!
                    </h3>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '../store/store.js'
import { storeToRefs } from 'pinia';
import LikeIcon from '../assets/images/Icons/like.svg'
import DislikeIcon from '../assets/images/Icons/dislike.svg'
import Comment from '../components/Comment.vue'
import axios from 'axios';

const store = useStore()
const { currentUserData, currentToken } = storeToRefs(store)

const route = useRoute()

const blogId = route.params.blogId
const blog = ref(null)
const userId = ref(currentUserData.value._id)


/* getting blog data */
axios.get(`blogs/${blogId}`).then(response => {
    blog.value = response.data.data
    // Date editing
    const date = new Date(blog.value.createdAt)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    blog.value.createdAt = date.toLocaleDateString('en-US', options)

    // currentUser liked-disliked check for UI/UX
    blog.value.likes.forEach((like) => {
        if (like.byID === currentUserData.value._id) {
            likedBlog.value = true
            dislikedBlog.value = false
        }
    })
    blog.value.dislikes.forEach((dislike) => {
        if (dislike.byID === currentUserData.value._id) {
            dislikedBlog.value = true
            likedBlog.value = false
        }
    })
}).catch(err => {
    store.displayMessage(err.response.data.message, err.response.data.success)
})


/* comment process */
const commentMessage = ref("")
const createComment = () => {
    axios.post(`blogs/${blogId}/commentCreate`, { commentMessage: commentMessage.value }).then(response => {
        store.displayMessage(response.data.message, response.data.success)
        const newComment = response.data.data
        blog.value.comments.push(newComment)
        commentMessage.value = ''

    }).catch(err => {
        store.displayMessage(err.response.data.message, err.response.data.success)
    })
}


/* like process */
const likedBlog = ref(false)  // for UI/UX
const likeBlog = () => {
    axios.post(`blogs/${blogId}/like`).then(response => {
        if (response.data.message === 'You liked the blog.') {
            store.displayMessage(response.data.message, response.data.success)
            likedBlog.value = true
            dislikedBlog.value = false
            // check dislike
            if (blog.value.dislikes.some(function (dislike) {
                return dislike.byID == userId.value
            })) {
                blog.value.dislikes = blog.value.dislikes.filter(function (dislike) {
                    return dislike.byID != userId.value;
                });
            }
            blog.value.likes.push({ byID: userId.value });
        }
        if (response.data.message === 'Like is removed from the blog.') {
            store.displayMessage(response.data.message, null)

            likedBlog.value = false
            dislikedBlog.value = false
            blog.value.likes = blog.value.likes.filter((like) => {
                return like.byID != userId.value
            });
        }

    }).catch(err => {
        store.displayMessage(err.response.data.message, err.response.data.success)
    })
}


/* dislike process */
const dislikedBlog = ref(false)  // for UI/UX
const dislikeBlog = () => {
    axios.post(`blogs/${blogId}/dislike`).then(response => {
        if (response.data.message === 'You disliked the blog.') {
            store.displayMessage(response.data.message, false)
            likedBlog.value = false
            dislikedBlog.value = true
            // check likes
            if (blog.value.likes.some(function (like) {
                return like.byID == userId.value
            })) {
                blog.value.likes = blog.value.likes.filter(function (like) {
                    return like.byID != userId.value;
                });
            }
            blog.value.dislikes.push({ byID: userId.value });
        }
        if (response.data.message === 'Dislike is removed from the blog.') {
            store.displayMessage(response.data.message, null)

            likedBlog.value = false
            dislikedBlog.value = false
            blog.value.dislikes = blog.value.dislikes.filter(function (dislike) {
                return dislike.byID != userId.value;
            });
        }

    }).catch(err => {
        store.displayMessage(err.response.data.message, err.response.data.success)
    })
}
</script>


<style scoped lang="scss">
.padding {
    @media (min-width:1440px) {
        padding: 0;
    }
}

.blog {
    margin: 0 auto;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &_title {
        font-size: var(--fs-xl);
        margin: 2rem 0;
        font-weight: 500;

    }

    &_img {
        max-width: 1440px;
        max-height: 800px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
        margin-bottom: 2rem;
    }

    &_paragraph {
        margin-bottom: 2rem;
        font-size: var(--fs-m);
        max-width: 100%;
        

    }

    &_details {
        font-size: var(--fs-m);
        display: flex;
        justify-content: space-between;
        margin-bottom: .5rem;

        @media (max-width: 600px) {
            font-size: var(--fs-s);
        }

        @media (max-width: 400px) {
            font-size: var(--fs-xs);
        }
    }

    &_actions {
        border-top: 1px solid black;
        padding-top: 2rem;

        &_approval {
            display: flex;
            gap: 30px;
            margin-bottom: 2rem;

            &_button {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                max-width: 280px;
                width: 100%;
                height: 50px;
                border: none;
                cursor: pointer;
                font-size: var(--fs-m);
                font-weight: 500;


                @media (max-width:900px) {
                    font-size: var(--fs-s);
                    max-width: 180px;
                    gap: 2px;
                }

                &#like.liked {
                    background-color: #019a258f;
                }

                &#dislike.disliked {
                    background-color: #ee30228f;
                }

            }
        }

        &_comment {

            &-title {
                font-size: var(--fs-l);
                font-weight: 500;
                margin-bottom: 2rem;
            }

            &_form {
                border-bottom: 1px solid black;
                margin-bottom: 2rem;

                &-message {
                    font-size: var(--fs-s);
                    padding: 1rem;
                    width: 100%;
                    margin-bottom: 1rem;
                    max-height: 300px;
                    min-height: 120px;
                    resize: vertical;
                }

                &-submit {
                    font-size: var(--fs-m);
                    font-weight: 500;
                    max-width: 150px;
                    height: 40px;
                    width: 100%;
                    margin-bottom: 2rem;
                    border: none;
                    cursor: pointer;

                    &:disabled {
                        pointer-events: none;
                        background-color: #ececec;
                    }

                }
            }

            &-nocomment {
                font-weight: 400;
                font-size: var(--fs-m);
                margin-bottom: 2rem;
            }
        }
    }
}
</style>