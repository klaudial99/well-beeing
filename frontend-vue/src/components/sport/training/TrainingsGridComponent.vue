<template>
    <div class="container my-3">
        <div class="row justify-content-center">
            <div class="col-12">
                <div class="row justify-content-center mw-100 mt-3">
                    <div class="col-lg-12 col-md-9 col-sm-7 col-10">
                        <div class="row align-content-center">
                            <div v-for="tr in trainingsSource"
                                 :key="tr.trainingId"
                                 class="col-xl-3 col-lg-4 col-md-12 col-12 px-2 py-2 mx-0 section-bg training"
                                 v-bind:class="{'selected-training' : (mode === 'toPlan' && this.$store.getters.getPlanTrainingId === tr.trainingId) }"
                                 v-on:click="mode === 'toPlan' ? this.$store.commit('setPlanTrainingId', tr.trainingId) : null">
                                <training-node :in-modal="inModal" :mode="mode" :training-source="tr"
                                               @set:training="setTraining"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <TrainingDetails :training="training" @get:trainings="getTrainings"/>
    </div>
</template>

<script>
import TrainingNode from "@/components/sport/training/TrainingNode";
import TrainingDetails from "@/components/sport/training/TrainingDetails";

export default {
    name: "TrainingsGridComponent",
    components: {TrainingDetails, TrainingNode},
    data() {
        return {
            exercises: [this.exercise],
            training: Object
        }

    },
    props: {
        trainingsSource: Array,
        mode: String,
        inModal: Boolean
    },
    methods: {
        setTraining(training) {
            this.training = training
        },
        getTrainings() {
            this.$emit('get:trainings')
        }
    }
}
</script>

<style scoped>

.training {
    font-weight: bold;
    text-align: left;
    border-radius: 2px;
    background-color: var(--GREY3);
    min-height: 0;
}

.selected-training {
    background-color: var(--SPORT);
}
</style>
