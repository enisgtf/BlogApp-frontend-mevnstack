<template>
    <div class="comment container" v-if="comment">
        <h3 class="comment_username" @click="goUserBlogs">@{{ comment.commentOwnerUsername }}</h3>
        <h4 class="comment_date">{{ formattedDate }}</h4>
        <p class="comment_message" v-if="!showUpdate"> {{ comment.commentMessage }}</p>
        <div class="comment_update" v-if="showUpdate">
            <textarea placeholder="Update your comment" v-model="newCommentMessage"></textarea>
            <button type="submit" :disabled="isUpdateBtnDisabled" @click="updateComment">Update</button>
        </div>
        <div class="comment_admin" v-if="comment.commentOwnerID == currentUserData._id || currentUserData.admin">
            <button type="button" class="comment_admin_button" @click="showUpdate = !showUpdate"
                :class="showUpdate ? 'active' : ''">
                <Edit class="icon"></Edit>
            </button>
            <button type="button" class="comment_admin_button" @click="deleteComment">
                <Delete class="icon"></Delete>
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { computed } from '@vue/reactivity';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '../store/store.js'
import { storeToRefs } from 'pinia';
import Edit from '../assets/images/Icons/edit-regular.svg'
import Delete from '../assets/images/Icons/trash.svg'
import axios from 'axios';

const store = useStore()
const { currentUserData } = storeToRefs(store)

const router = useRouter()
const route = useRoute()


const blogId = route.params.blogId

const props = defineProps(["comment"])
let comment = ref(props.comment)


const newCommentMessage = ref(comment.value.commentMessage)


/* Update comment */
const showUpdate = ref(false)
const isUpdateBtnDisabled = computed(() => {
    if (comment.value.commentMessage == newCommentMessage.value) return true
    return false
})
const updateComment = () => {
    axios.put(`/blogs/${blogId}/${comment.value.commentID}/commentUpdate`, { commentMessage: newCommentMessage.value }).then(response => {
        store.displayMessage(response.data.message, response.data.success);
        comment.value.commentMessage = newCommentMessage.value
        showUpdate.value = false
    }).catch(err => {
        store.displayMessage(err.response.data.message, err.response.data.success);
    })
}

/* Delete comment */
const deleteComment = () => {
    axios.delete(`/blogs/${blogId}/${comment.value.commentID}/commentDelete`).then(response => {
        store.displayMessage(response.data.message, false)
        comment.value = null
    }).catch(err => {
        store.displayMessage(err.response.data.message, err.response.data.success);
    })
}

/* Route user blog page */
const goUserBlogs = () => {
    router.push({
        path: `/blogs/${comment.value.commentOwnerUsername}`,
        query: {
            userId: comment.value.commentOwnerID
        },
    })
}

/* Date formating */
const date = new Date(comment.value.commentTime)
const options = {
    year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit"
}
const formattedDate = date.toLocaleDateString('en-US', options)

</script>

<style scoped lang="scss">
.comment {
    margin-bottom: 2rem;
    box-shadow: 0 2px 3px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
    padding: 1rem;
    position: relative;

    &_username {
        font-size: var(--fs-m);
        font-weight: 600;
        display: inline-block;

        &:hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }

    &_date {
        font-size: var(--fs-s);
        font-weight: 400;
        margin-bottom: .5rem;
    }

    &_message {
        font-size: var(--fs-m);
        font-weight: 400;

        @media (max-width:768px) {
            font-size: var(--fs-s);

        }
    }

    &_update {
        textarea {
            width: 100%;
            min-height: 60px;
            margin-bottom: .5rem;
            font-size: var(--fs-s);
            padding: .2rem;
        }

        button {
            max-width: 100px;
            width: 100%;
            height: 30px;
            border: none;
            cursor: pointer;
            font-size: var(--fs-xs);
            font-weight: 500;

            &:disabled {
                pointer-events: none;
                background-color: #FAFAFA;
            }
        }
    }

    &_admin {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 1rem;

        &_button {
            width: 30px;
            height: 30px;
            background-color: transparent;
            border: none;

            &.active {
                .icon {
                    transform: scale(1.3);

                    &:hover {
                        transform: scale(1)
                    }
                }
            }

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

}
</style>