<template>
    <div class="modal fade" id="roleRequestEditModal2" tabindex="-1" aria-labelledby="roleRequestEditModal2Label" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="roleRequestEditModal2Label">Edycja prośby</h4>
                    <button type="button" class="btn-close" id="modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">

                        <div class="row">
                            <div class="col fw-bolder">
                                Data:
                            </div>
                            <div class="col fw-bolder">
                                Rola:
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                {{ this.$func_global.formatDate(this.roleRequestSource.addedDate )}}
                            </div>
                            <div class="col">
                                <select
                                    class="form-select"
                                    aria-label="Default select example"
                                    v-model="editedRoleRequest.role"
                                    @focus="clearStatus"
                                >
                                    <option v-for="role in this.possibleRoles" :value="role" :key="role">
                                        {{ this.$func_global.mapRole(role) }}
                                    </option>

                                </select>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col fw-bolder">
                                Dokument:
                            </div>
                            <div class="col fw-bolder">
                                Status:
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div v-if="!editFile">
                                    <button class="no-bg" @click="handleDownloadFile(this.roleRequestSource.roleReqId)">
                                        <font-awesome-icon id="document-icon" :icon="['far', 'file-pdf']" size="2x" class="navbar-icon" />
                                    </button>
                                    <button class="btn-white" @click="deleteFile">
                                        Usuń plik
                                    </button>
                                </div>

                                <input v-else
                                    class="form-control"
                                    type="file"
                                    ref="editfile"
                                    id="formFile"
                                    accept="application/pdf"
                                    @focus="clearStatus"
                                >
                            </div>
                            <div class="col">
                                {{ this.$func_global.mapRoleRequestStatus(this.roleRequestSource.status) }}
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col fw-bolder">
                                Komentarz:
                            </div>
                            <div class="col fw-bolder" v-if="editedRoleRequest.role === 'ROLE_DOCTOR'">
                                Specjalizacja:
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                {{ this.roleRequestSource.comment === "" ? "-" : this.roleRequestSource.comment }}
                            </div>
                            <div class="col" v-if="editedRoleRequest.role === 'ROLE_DOCTOR'">
                                <select
                                    class="form-select"
                                    aria-label="Default select example"
                                    v-model="editedRoleRequest.specialization.id"
                                    @focus="clearStatus"
                                >
                                    <option v-for="spec in possibleSpecializations" :key="spec.name" :value="spec.id">{{ spec.name }}</option>
                                </select>

                            </div>

                        </div>
                        <div v-if="errorRequest" class="row text-start">
                            <p class="has-error m-0">
                                Proszę uzupełnić wszystkie dane!
                            </p>
                        </div>
                        <div class="row mt-3">
                            <div class="col text-end">
                                <button class="btn-panel-social" @click="updateRoleRequest">Uaktualnij prośbę</button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "RoleRequestEdit",
    data () {
        return {
            possibleRoles: [],
            possibleSpecializations: [],
            editedRoleRequest: {
                role: "",
                documentImgPath: "",
                specialization: {
                    id: ""
                }
            },
            editFile: false,

            updatingRequest: false,
            errorRequest: false
        }
    },
    props: {
        roleRequestSource: Object,
        refresh: Number
    },
    methods: {
        handleDownloadFile(id) {
            this.$emit('download:file', id)
        },
        checkPossibleRoles() {
            const roles = ["ROLE_DIETICIAN", "ROLE_TRAINER", "ROLE_DOCTOR"]

            this.$store.getters.getRoles.forEach((elem) => {
                if (roles.includes(elem)) {
                    const indexToDelete = roles.indexOf(elem)
                    roles.splice(indexToDelete, 1)
                }
            })
            this.possibleRoles = roles

            this.editedRoleRequest.role = this.roleRequestSource.role
            this.editedRoleRequest.documentImgPath = this.roleRequestSource.documentImgPath
            if(this.roleRequestSource.specialization != null)
                this.editedRoleRequest.specialization.id = this.roleRequestSource.specialization.id
            this.clearStatus()
            this.editFile = false
        },
        checkPossibleDoctorSpecializations() {
            const url = `${this.apiURL}doctor-specializations`
            const token = this.$store.getters.getToken;
            this.axios.get(url, {headers: {Authorization: `Bearer ${token}`}}).then((response) => {
                console.log(response.data)

                const doctorSpec = response.data
                console.log('doc', doctorSpec)
                this.$store.getters.getSpecializations.forEach((elem) => {
                    if (doctorSpec.map(spec => spec.name).includes(elem)) {
                        const indexToDelete = doctorSpec.map(spec => spec.name).indexOf(elem)
                        doctorSpec.splice(indexToDelete, 1)
                    }
                })
                this.possibleSpecializations = doctorSpec
                if (this.possibleSpecializations !== [] && !this.possibleRoles.includes('ROLE_DOCTOR'))
                    this.possibleRoles.push('ROLE_DOCTOR')
                console.log('poss', this.possibleSpecializations)
            }).catch(error => {
                console.log(error.response.status)
            });
        },
        deleteFile() {
            this.editFile = true
            this.editedRoleRequest.documentImgPath = ""
        },
        updateRoleRequest() {
            this.updatingRequest = true
            this.clearStatus()
            if (this.editFile) {
                console.log('file0', this.$refs.editfile.files[0])
                if (this.$refs.editfile.files.length > 0) {
                    this.editedRoleRequest.documentImgPath = this.$refs.editfile.files[0].name
                }
                else {
                    if (this.invalidFile) {
                        this.errorRequest = true
                        return
                    }
                }
            }

            if (this.invalidRole || this.invalidSpecialization) {
                this.errorRequest = true
                return
            }
            //clearinputs
            if(this.editedRoleRequest.role !== 'ROLE_DOCTOR')
                this.editedRoleRequest.specialization = null
            const url = `${this.apiURL}role-request/${this.roleRequestSource.roleReqId}`
            const token = this.$store.getters.getToken;
            this.axios.put(url, this.editedRoleRequest, {headers: {Authorization: `Bearer ${token}`}}).then((response) => {
                console.log(response)
                if (this.editFile) {
                    this.$func_global.importData(this.$refs.editfile, this.$store.getters.getToken, 'roleRequest', this.roleRequestSource.roleReqId)

                }
                // this.clearInputs()
                this.$parent.$parent.getMyRoleRequests()
                document.getElementById('modal-close').click();
            }).catch(error => {
                console.log(error.response)
            });

            this.submittingRequest = false
        },
        clearStatus() {
            this.updatingRequest = false
            this.errorRequest = false
        },

    },
    watch: {
        roleRequestSource: function() {
            this.checkPossibleRoles()
            this.checkPossibleDoctorSpecializations()
        },
        refresh: function () {
            this.checkPossibleRoles()
            this.checkPossibleDoctorSpecializations()
        }
    },
    computed: {
        invalidRole() {
            return !(this.editedRoleRequest.role === 'ROLE_DOCTOR' || this.editedRoleRequest.role === 'ROLE_DIETICIAN' || this.editedRoleRequest.role === 'ROLE_TRAINER')
        },
        invalidFile() {
            return this.editedRoleRequest.documentImgPath === ""
        },
        invalidSpecialization() {
            return this.editedRoleRequest.role === 'ROLE_DOCTOR' && this.editedRoleRequest.specialization.id === ""
        }
    },
    created() {
        this.checkPossibleRoles()
        this.checkPossibleDoctorSpecializations()
    },
    mounted() {
        this.editFile = false
    }
}
</script>

<style scoped>
#document-icon {
    color: var(--GREY3)
}
.modal-body {
    color: var(--GREY3);
    text-align: left;
}

.modal-header {
    color: var(--GREY3);
}
</style>