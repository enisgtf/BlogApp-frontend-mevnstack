<template>
    <div class="container padding">
        <h1>Create New Blog</h1>
        <input type="text" name="title" v-model="newBlog.title" placeholder="Title" minlength="6" maxlength="60" required>
        <input type="text" name="blog" v-model="newBlog.commercialSentence" placeholder="Commercial Sentence" minlength="30"
            maxlength="120">
        <form @submit.prevent="uploadPhoto" enctype="multipart/form-data">
            <label for="coverImg">Upload Blog Cover</label>
            <input type="file" id="coverImg" name="coverImg" accept="image/*" multiple=false @change="selectedFile">
            <button type="submit" :disabled="!image">Submit Cover</button>
            <h6 v-if="newBlog.coverImg != null">Success!</h6>
        </form>
        <QuillEditor ref="quillEditor" theme="snow" toolbar="full" :modules="modules" />
        <div class="homepage-check" v-if="currentUserData.admin">
            <input type="checkbox" id="homepage" v-model="newBlog.HomepageBlog">
            <label for="homepage">For Home Page?</label>
        </div>
        <button type="button" class="createBlogBtn" @click="createBlog" :disabled="!newBlog.coverImg">CREATE NEW
            BLOG</button>
    </div>
</template>


<script setup>
import { reactive, ref } from 'vue';
import { useStore } from '../store/store';
import { storeToRefs } from 'pinia';
import { QuillEditor } from '@vueup/vue-quill'
import ImageUploader from 'quill-image-uploader';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import axios from 'axios';

const store = useStore()
const { currentUserData } = storeToRefs(store)

/* new blog data */
const newBlog = reactive({
    title: "",
    blogContent: "",
    commercialSentence: "",
    coverImg: null,
    HomepageBlog: null
})


/* upload coverImg photo */
const image = ref(null)
const selectedFile = (e) => {
    image.value = e.target.files[0]
}
const uploadPhoto = (e) => {
    const fd = new FormData()
    fd.append('coverImg', image.value)

    axios.post("/blogs/uploadCover", fd).
        then(response => {
            store.displayMessage(response.data.message, response.data.success)
            newBlog.coverImg = response.data.filename
            console.log(newBlog);
        }).catch(err => {
            store.displayMessage(err.response.data.message, err.response.data.success)
        })
}


const createBlog = () => {
    getEditorHTML()
    axios.post('/blogs/create', newBlog).then(response => {
        store.displayMessage(response.data.message, response.data.success)
    }).catch(err => {
        store.displayMessage(err.response.data.message, err.response.data.success)
    })
}

/* quill editor  */
const quillEditor = ref(null);
// quill editor HTML data to String for saving in MongoDB  
const getEditorHTML = () => {
    const html = quillEditor.value.getHTML();
    newBlog.blogContent = html
}
const modules = {
    name: 'imageUploader',
    module: ImageUploader,
    options: {
        upload: file => {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append("blogImg", file);

                axios.post('/blogs/uploadImage', formData)
                    .then(res => {
                        resolve(res.data.url);
                    })
                    .catch(err => {
                        reject("Upload failed");
                        console.error("Error:", err)
                    })
            })
        }
    }
}
</script>

<style scoped lang="scss">
h1 {
    margin-bottom: 2rem;
}

input[type="text"] {
    padding: 1rem;
    width: 100%;
    border-radius: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.3);
    margin-bottom: 2rem;
}

form {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;


    label {
        margin-bottom: .5rem;
        font-weight: 500;
    }

    input {
        max-width: 300px;
        margin-bottom: .5rem;
    }

    button {
        background-color: var(--clr-bg-grey);
        color: white;
        padding: .3rem;
        border-radius: 2rem;
        font-size: var(--fs-xs);
        font-weight: 500;
        max-width: 120px;
        border: none;

        &:disabled {
            pointer-events: none;
            background-color: #FAFAFA;
            color: #B4B4B4;
        }
    }

    h6 {
        margin-left: 1rem;
        margin-top: .3rem;

    }
}

.createBlogBtn {
    padding: 1rem;
    margin-top: 2rem;
    background-color: var(--clr-bg-grey);
    color: white;
    border: none;
    cursor: pointer;

    &:disabled {
        pointer-events: none;
        background-color: #FAFAFA;
        color: #B4B4B4;
    }
}

.homepage-check {
    margin-top: 2rem;

    label {
        margin-left: 1rem;
    }
}
</style>