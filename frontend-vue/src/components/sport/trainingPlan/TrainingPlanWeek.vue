<template>
    <div v-if="plan.trainingPlanId != null" class="container align-items-start" style="overflow: auto">
        <div class="row-fluid d-flex align-items-start ">
            <div class="items justify-content-start d-flex">
                <div v-for="day in days" :key="day.num"
                     class="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-6 day mx-1   mb-3 p-3 item">
                    <TrainingPlanDay :create="planType === 'create'" :date="weekDates.find(d => d.day.num === day.num)"
                                     :day=day.name :details="planType === 'details'" :in-modal="planType === 'modal'"
                                     :positions="plan.trainingPositions.filter( pos => matchesDayOfTheWeek(pos, day.num))"
                                     @update:active="updateActive"
                                     @set:training="setTraining">

                    </TrainingPlanDay>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import TrainingPlanDay from "@/components/sport/trainingPlan/TrainingPlanDayComponent";

export default {
    name: "TrainingPlanWeek",
    components: {TrainingPlanDay},
    props: {
        plan: {
            trainingPositions: []
        },
        planType: String, // active, create, details, editable, modal
        days: Array,
        weekDates: Array
    },
    methods: {
        updateActive() {
            this.$emit('update:active')
        },
        matchesDayOfTheWeek(position, day) {
            return new Date(position.trainingDate).getDay() === day;
        },
        setTraining(training) {
            this.$emit('set:training', training)
        },

    },
    watch: {
        plan: function () {
            this.$emit('update:items')
        },
        planType: function () {
            this.$emit('update:items')
        }
    }
}

</script>

<style scoped>
.row-fluid {
    white-space: nowrap;
}

.row-fluid .col-3 {
    display: inline-block;
}

.col-3 {
    white-space: normal;
}

.day {
    background-color: var(--GREY3);
    border-radius: 5px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: var(--SPORT);
    -webkit-box-shadow: inset 0 0 6px rgba(90, 90, 90, 0.7);
}

.item {
    /*display: inline-block;*/
}

.items:active {
    background: rgba(255, 255, 255, 0.1);
    cursor: grabbing;
    /*cursor: -webkit-grabbing;*/
    transform: scale(1);
}

.items {
    /*position: relative;*/
    /*width: 100%;*/
    overflow-x: scroll;
    /*overflow-y: hidden;*/
    /*white-space: nowrap;*/
    transition: all 0.2s;
    /*transform: scale(0.98);*/
    will-change: transform;
    user-select: none;
    cursor: pointer;
}
</style>
