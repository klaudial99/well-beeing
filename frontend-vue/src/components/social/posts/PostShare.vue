<template>
    <div class="modal fade" id="postShareModal" tabindex="-1" aria-labelledby="postShareModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="postShareModalLabel">Udostępnianie</h4>
                    <button type="button" class="btn-close" id="share-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">

                        <div class="row">
                            <div class="col fw-bolder">
                                Treść posta:
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="grow-wrap">
                                    <textarea
                                        :id="sharedId"
                                        class="textarea js-autoresize w-100"
                                        v-model="sharingPost.postContent"
                                        placeholder="Jeśli chcesz, dodaj opis do posta..."
                                    >
                                    </textarea>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex flex-row">
                            <button class="btn-panel-social-outline ms-auto" @click="sharePost">
                                Udostępnij
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {setResizeListeners} from "@/helpers/auto-resize";
export default {
    name: "PostShare",
    data() {
        return {
            sharingPost: {
                postContent: ""
            }
        }
    },
    props: {
        sharedId: Number,
        sharingType: String
    },
    methods: {
        sharePost() {
            let url;
            if (this.sharingType === 'post')
                url = `${this.apiURL}post/${this.sharedId}/share`
            else if (this.sharingType === 'nutrition-plan')
                url = `${this.apiURL}nutrition-plan/${this.sharedId}/share`
            else if (this.sharingType === 'training-plan')
                url = `${this.apiURL}training-plan/${this.sharedId}/share`
            const token = this.$store.getters.getToken;
            this.axios.post(url, this.sharingPost, {headers: {Authorization: `Bearer ${token}`}}).then((response) => {
                console.log(response)
                document.getElementById('share-close').click();
                if (this.$route.name === 'FeedView')
                    this.$parent.$parent.getPostsFeedWithNewPost(0, false, response.data['postId'])
                else if (this.sharingType === 'post')
                    this.$parent.$parent.getPosts(0, false, 0)
            }).catch(error => {
                console.log(error.response)
            });
        }
    },
    mounted() {
        setResizeListeners(this.$el, ".js-autoresize")
        document.getElementById(String(this.sharedId)).style.height = '80px'
    },
    watch: {
        sharedId: function () {
            this.sharingPost.postContent = ""
        }
    }
}
</script>

<style scoped>
.modal-body {
    color: var(--GREY3);
    text-align: left;
}

.modal-header {
    color: var(--GREY3);
}

textarea {
    padding: 1rem 1rem;
    text-align: left;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.grow-wrap > textarea {
    resize: none;
    overflow: hidden;
}
</style>