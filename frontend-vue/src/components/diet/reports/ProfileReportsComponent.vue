<template>
    <div class="container-fluid">
        <div class="row">
            <div style="align-items: flex-start; display: flex;" class="col-lg-5">
                <input v-model="this.actualMonth" @change="this.getReportsToShow" class= "form-control" id="month-picker" type="month" name="start" min="2021-01">
            </div>
            <div class="col-lg-7" style="justify-content: flex-end; display: flex; flex-direction: row;">
                <button data-bs-toggle="modal" data-bs-target="#newReportFormModal" class="add-button"> <font-awesome-icon :icon="['fa', 'plus-circle']"/> </button>
            </div>
        </div>
        <div v-if="this.reportsToShow.length != 0">
            <table style="color: white; text-align: start;" class="table">
                <thead>
                    <tr>
                        <th class="col-sm-3" scope="col">Data</th>
                        <th class="col-sm-3" scope="col">Kalorie</th>
                        <th class="col-sm-1" scope="col">B</th>
                        <th class="col-sm-1" scope="col">W</th>
                        <th class="col-sm-1" scope="col">T</th>
                        <th class="col-sm-3" scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="report in reportsToShow" :key="report.id">
                        <td>{{report.reportDate}}</td>
                        <td>{{Math.round(report.derivedNutritionalValues.derivedCalories)}}kcal</td>
                        <td>{{Math.round(report.derivedNutritionalValues.derivedProteins)}}g</td>
                        <td>{{Math.round(report.derivedNutritionalValues.derivedCarbohydrates)}}g</td>
                        <td>{{Math.round(report.derivedNutritionalValues.derivedFats)}}g</td>
                        <td style="text-align: end;">
                            <button @click="this.setActualReport(report)" class="btn-icon-panel-diet" data-bs-toggle="modal" data-bs-target="#reportModal"><font-awesome-icon :icon="['fa', 'info']"/></button>
                            <button @click="this.setActualReport(report)" class="btn-icon-panel-diet" data-bs-toggle="modal" data-bs-target="#reportFormModal"><font-awesome-icon :icon="['fa', 'edit']"/></button>
                            <button @click="this.setActualReport(report)" class="btn-icon-panel-diet" data-bs-toggle="modal" data-bs-target="#reportDeleteModal"><font-awesome-icon :icon="['fa', 'trash']"/></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="this.reportsToShow.length == 0 && this.dataLoaded" class="alert alert-danger mt-4" role="alert">
            Brak raportów na ten rok i miesiąc. 
        </div>
        <div id="reportModal" data-bs-backdrop="static" data-bs-keyboard="false" class="modal fade" tabindex="-1" aria-labelledby="reportModalLabel" aria-hidden="false">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color: black;" class="modal-title" id="reportModalLabel">Raport {{this.actualModalReport.reportDate}}</h5>
                        <button @click="this.closeInfoModal = !this.closeInfoModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <report-component :userId="null" :close="this.closeInfoModal" :report="this.actualModalReport"></report-component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="reportDeleteModal" data-bs-backdrop="static" data-bs-keyboard="false" class="modal fade"  tabindex="-1" aria-labelledby="reportDeleteModalLabel" aria-hidden="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p style="color: black;">Czy na pewno chcesz usunąć?</p>
                        <div>
                            <button @click="this.deleteReport" style="margin: 2px;" type="button" class="btn btn-success" data-bs-dismiss="modal">TAK</button>
                            <button style="margin: 2px;" type="button" class="btn btn-danger" data-bs-dismiss="modal">NIE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="reportFormModal" data-bs-backdrop="static" data-bs-keyboard="false" class="modal fade" tabindex="-1" aria-labelledby="reportFormModalLabel" aria-hidden="false">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color: black;" class="modal-title" id="reportFormModalLabel">Edytuj raport</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <report-form-component @updated:report="this.updateReportsAfterUpdate" :report="this.actualModalReport"></report-form-component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="newReportFormModal" data-bs-backdrop="static" data-bs-keyboard="false" class="modal fade" tabindex="-1" aria-labelledby="newReportFormModalLabel" aria-hidden="false">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color: black;" class="modal-title" id="newReportFormModalLabel">Dodaj raport</h5>
                        <button @click="clearStatusAndInput" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div style="text-align: start;">
                            <p style="color: black;">Wybierz datę raportu: </p>
                            <input @focus="clearStatus" v-model="this.actualDate" class="form-control" id="date-picker" type="date" format="yyyy-mm-dd" name="start" min="2021-01-01" :max="this.actualDate">
                            <div style="width: 100%; justify-content: flex-end; display: flex;">
                                <button @click="addNewReportForDay" style="margin: 2px; align-self: end;" :value="this.getActualLocalDate()" type="button" class="btn-card-panel-diet my-4">Dodaj raport</button>
                            </div>
                            <div v-if="this.showConflictError" class="alert alert-danger alert-dismissible fade show my-1" role="alert">
                                Raport na ten dzień już istnieje!
                            </div>
                            <div v-if="this.addReportSuccess" class="alert alert-success alert-dismissible fade show my-1" role="alert">
                                Dodano raport.
                            </div>
                            <div v-if="this.addReportError" class="alert alert-danger alert-dismissible fade show my-1" role="alert">
                                Wystąpił błąd dodawania raportu. 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import ReportComponent from './ReportComponent.vue'
import ReportFormComponent from './ReportFormComponent.vue'
export default {
    name: "ProfileReportsComponent",
    components: {
        ReportComponent,
        ReportFormComponent
    },
    data(){
        return {
            reportsToShow: [],
            showConflictError: false,
            actualMonth: '',
            actualDate: '',
            actualModalReport: {
                derivedNutritionalValues: {
                    derivedProteins: 0,
                    derivedFats: 0,
                    derivedCarbohydrates: 0,
                    derivedCalories: 0
                }
            },
            closeInfoModal: false,
            addReportSuccess: false,
            addReportError: false,
            dataLoaded: false,
        }
    },
    mounted(){
        this.actualMonth = this.getActualMonth()
        this.actualDate = this.getActualLocalDate()
        this.getReportsToShow()
    },
    methods: {
        clearStatus(){
             this.addReportSuccess = false;
             this.showConflictError = false;
             this.addReportError = false;
        },
        clearStatusAndInput(){
            setTimeout(() => {
                this.clearInput()
                this.clearStatus()
            }, 500)
        },
        clearInput(){
            this.actualDate = this.getActualLocalDate()
        },
        addNewReportForDay(){
            axios({
                method: 'post',
                headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}, 
                url: "http://localhost:8090/report",
                data: {
                    reportDate: this.actualDate
                }
            })
            .then((response) => {this.getReportsToShow(); console.log(response); this.addReportSuccess = true;})
            .catch(error => 
                {
                    this.addReportError = true;
                    if (error.response.status === 409) {
                        this.addReportError = false;
                        this.showConflictError = true;
                    }
                }
            )},
        getReportsToShow(){
            var yearMonth = this.actualMonth.split("-")
            var year = parseInt(yearMonth[0],10)
            var month = parseInt(yearMonth[1],10)
            let params = {
                month: month,
                year: year,
            }
            axios.get('http://localhost:8090/report', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                params: params 
            })
            .then(data => {
                    this.reportsToShow = data.data;
                    console.log("TU")
                    console.log(data)
                    console.log(this.reportsToShow)
                    this.dataLoaded = true
            }).catch(e => alert(e))
        },
        clearError(){
            this.showConflictError = false;
        },
        getActualMonth(){
            const date= new Date()
            const month=("0" + (date.getMonth() + 1)).slice(-2)
            const year=date.getFullYear()
            return `${year}-${month}`;
        },
        getActualLocalDate(){
            const date= new Date()
            return this.$func_global.formatDateDatePicker(date)
        },
        setActualReport(report){
            this.actualModalReport = report
        },
        deleteReport(){
            axios({
                method: 'delete',
                headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}, 
                url: "http://localhost:8090/report/"+ this.actualModalReport.id,
            })
            .then((response) => {this.getReportsToShow(); console.log(response)})
            .catch(error => {console.log(error)})
        },
        updateReportsAfterUpdate(response){
            console.log(response)
            this.getReportsToShow()
        }
    }
}
</script>

<style scoped>

.add-button{
    color: var(--DIET);
    background-color: transparent;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    padding: 0px;
    margin: 0;
    border: none;
    font-size: 2rem;
    font-weight: bold;
}

</style>