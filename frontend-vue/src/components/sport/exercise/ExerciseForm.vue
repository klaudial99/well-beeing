<template>
    <div id="addExerciseModal" aria-hidden="true" aria-labelledby="addExerciseModalLabel" class="modal fade"
         tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="addExerciseModalLabel" class="modal-title ms-2">Dodawanie nowego ćwiczenia</h5>
                    <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"
                            @click="clearInputs(); clearStatusWithTimeout()"></button>
                </div>
                <div class="modal-body">
                    <div id="modal-container" class="container-fluid">
                        <div class="col-11 mx-auto form-group">
                            <div class="row">
                                <p class="form-label">Nazwa</p>
                                <input
                                    id="name-form"
                                    v-model="name"
                                    :class="{ 'has-error': submittingCreateExercise && invalidName || nameTaken}"
                                    class="register-input p-2"
                                    placeholder="Nazwa ćwiczenia"
                                    type="text"
                                    @focus="clearStatus"
                                    @keypress="clearStatus"
                                />
                            </div>
                            <div class="row text-end">
                                <p v-if="nameTaken" class="has-error m-0">
                                    Istnieje już ćwiczenie o takiej nazwie!
                                </p>
                            </div>
                            <div class="row ">
                                <div class="col-6 ps-0 mt-3">
                                    <p class="form-label mx-auto">Typ</p>
                                    <select
                                        v-model="type"
                                        :class="{ 'has-error': submittingCreateExercise && invalidType}"
                                        class="float-start register-input p-2"
                                        @focus="clearStatus"
                                        @keypress="clearStatus"
                                    >
                                        <option disabled value="">Wybierz typ</option>
                                        <option v-for="type in typeOptions" :key="type" :value="type">
                                            {{ this.$func_global.mapExerciseType(type) }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-6 ps-0 mt-3">
                                    <p class="form-label">MET</p>
                                    <input
                                        v-model="met"
                                        :class="{ 'has-error': submittingCreateExercise && invalidMet}"
                                        class="float-start register-input p-2"
                                        max=30.0
                                        min=0.0
                                        placeholder="MET"
                                        type="number"
                                        @focus="clearStatus"
                                        @keypress="clearStatus"
                                    />
                                </div>

                            </div>
                            <div class="row mt-3">
                                <p class="form-label">Etykiety</p>
                                <v-select
                                    v-model="values"
                                    :options=labelsSource :reduce="name => name.sportLabelId"
                                    class=" register-form style-chooser px-0 py-2 sport"
                                    label="name"
                                    multiple
                                    @focus="clearStatus"
                                    @keypress="clearStatus"/>
                            </div>
                            <div class="row mt-3">
                                <p class="form-label">Opis</p>
                                <textarea
                                    v-model="description"
                                    :class="{ 'has-error': submittingCreateExercise && invalidDescription}"
                                    class="register-input p-2"
                                    placeholder=" Opis"
                                    @focus="clearStatus"
                                    @keypress="clearStatus"
                                />
                            </div>
                            <div class="row mt-3">
                                <p class="form-label">Instrukcja</p>
                                <textarea
                                    v-model="instruction"
                                    :class="{ 'has-error': submittingCreateExercise && invalidInstruction}"
                                    class="register-input p-2"
                                    placeholder=" Instrukcja"
                                    @focus="clearStatus"
                                    @keypress="clearStatus"
                                />
                            </div>
                            <div class="row mt-3 ">
                                <div class="text-start px-0">
                                    <label class="text-start form-label" for="exercise-video">Załącz instrukcję wideo
                                        [mp4]</label>
                                    <input
                                        id="exercise-video"
                                        ref="exerciseVideo"
                                        accept="video/mp4"
                                        class=" register-input form-control"
                                        type="file"
                                        @change="handleFileUpload( $event )"
                                    >
                                </div>
                            </div>
                            <div v-if="videoFile !== '' && videoFile != null" class="row mt-3">
                                <button class="btn-white" @click="deleteFile">
                                    Usuń plik
                                </button>
                            </div>
                            <div class="row mt-3">
                                <video v-show="videoFile !== ''" id="video-preview" class="px-0" controls/>
                            </div>
                            <div v-if="errorCreateExercise" class="row text-end">
                                <p class="has-error m-0">
                                    Proszę uzupełnić wszystkie dane poprawnie!
                                </p>
                            </div>
                            <div class="row justify-content-end mt-3">
                                <div class="col-4">
                                    <button class="register-btn grey-btn p-2" data-bs-dismiss="modal"
                                            @click="clearInputs()">Anuluj
                                    </button>
                                </div>
                                <div class="col-4">
                                    <button class="register-btn btn-panel-sport p-2" @click="handleSubmit">Dodaj
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-if="successCreateExercise" class="col-11 mx-auto submit-correct">
                            <p>
                                Dodano nowe ćwiczenie!
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import 'vue-select/dist/vue-select.css';

export default {
    name: "ExerciseForm",
    data() {
        return {
            typeOptions: ['OTHER', 'STRENGTH', 'CARDIO'],
            values: [],
            name: "",
            type: "",
            met: 0.0,
            description: "",
            instruction: "",
            errorCreateExercise: false,
            successCreateExercise: false,
            nameTaken: false,
            submittingCreateExercise: false,
            videoFile: ''
        }
    },
    props: {
        labelsSource: Object,
    },
    methods: {
        clearStatusWithTimeout() {
            setTimeout(() => {
                this.clearStatus()
            }, 500)
        },
        clearInputs() {
            this.name = ""
            this.type = ""
            this.met = 0.0
            this.description = ""
            this.instruction = ""
            this.values = []
        },
        clearStatus() {
            this.errorCreateExercise = false
            this.successCreateExercise = false
            this.nameTaken = false
        },
        handleSubmit() {
            this.submittingCreateExercise = true
            this.clearStatus()
            if (this.invalidName || this.invalidType || this.invalidMet || this.invalidDescription || this.invalidInstruction) {
                this.errorCreateExercise = true
                return
            }
            const data = {
                "exercise": {
                    "name": this.name,
                    "exerciseType": this.type,
                    "met": this.met,
                    "description": this.description,
                    "instruction": this.instruction
                },
                "labelsIds": this.values
            }


            const url = `${this.apiURL}sport/exercise`
            const token = this.$store.getters.getToken;
            this.axios.post(url, data, {headers: {Authorization: `Bearer ${token}`}}).then((response) => {
                console.log(response.data)
                let exerciseId = response.data['exerciseId']
                this.$func_global.importData(this.$refs.exerciseVideo, this.$store.getters.getToken, 'exerciseVideo', exerciseId)
                this.successCreateExercise = true
                this.clearInputs()
                this.$emit('get:exercises')
            }).catch(error => {
                if (error.response.status === 409) {
                    this.nameTaken = true
                }
            });
            this.submittingCreateExercise = false
            document.getElementsByClassName('')
        },
        handleFileUpload(event) {
            try {
                this.videoFile = event.target.files[0];
            } catch (e) {
                console.log(e)
            }

            this.previewVideo();
        },
        previewVideo() {
            let video = document.getElementById('video-preview');
            let reader = new FileReader();
            if (this.videoFile == null) {
                this.videoFile = ''
                video.src = ''
                return
            }

            reader.readAsDataURL(this.videoFile);
            reader.addEventListener('load', function () {
                video.src = reader.result;
            });
        },
        deleteFile() {
            this.$refs.exerciseVideo.value = null
            this.videoFile = ''
        }
    },
    computed: {
        invalidName() {
            return this.name === ''
        },
        invalidType() {
            return this.type === ''
        },
        invalidMet() {
            return this.met <= 0.0 || this.met >= 30.0;
        },
        invalidDescription() {
            return this.description === ''
        },
        invalidInstruction() {
            return this.instruction === ''
        }
    },
}
</script>

<style scoped>
.pink-btn {
    background: var(--INTENSE-PINK);
}

.grey-btn {
    background: var(--GREY2);
}

input.has-error {
    border: 1px solid var(--INTENSE-PINK);
}

textarea.has-error {
    border: 1px solid var(--INTENSE-PINK);
}

p.has-error {
    color: var(--INTENSE-PINK);
    /*font-weight: bold;*/
}

.submit-correct {
    color: var(--TELEMEDIC);
    /*font-weight: bold;*/
}

.modal-title {
    color: var(--SPORT);
}

.form-label {
    color: var(--GREY3);
    font-weight: bold;
    text-align: left;
    padding-left: 0;
}

.register-btn {
    color: white;
    font-weight: bold;
}
</style>
