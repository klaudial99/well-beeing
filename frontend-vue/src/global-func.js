import moment from "moment";
import axios from "axios";

const apiURL = 'http://localhost:8090/'

export const func_global = {

    async importData(myfile, token, type, id) {
        // let myfile = this.$refs.myfile;
        let files = myfile.files;
        let file = files[0];
        var formData = new FormData();
        formData.append("file", file);
        return this.uploadFile(formData, type, token, id).then((resp) => {
            console.log(resp)
        })
    },

    async importDataFunc(myfile, token, type, id) {
        // let myfile = this.$refs.myfile;
        let files = myfile.files;
        let file = files[0];
        var formData = new FormData();
        formData.append("file", file);
        return this.uploadFileFunc(formData, type, token, id)
    },

    async importSportDataFunc(myfile, token, type, id) {
        // let myfile = this.$refs.myfile;
        let files = myfile.files;
        let file = files[0];
        var formData = new FormData();
        formData.append("file", file);
        return this.uploadFileFunc(formData, type, token, id)
    },

    async uploadFileFunc(data, type, token, id) {
        let url;
        if (type === 'roleRequest')
            url = `${apiURL}role-request/import/${id}/`
        else if (type === 'profilePicture')
            url = `${apiURL}profile/import`
        else if (type === 'postPicture')
            url = `${apiURL}post/import/${id}`
        else if (type === 'dishPicture')
            url = `${apiURL}dish/${id}/photo`
        else if (type === 'importProducts')
            url = `${apiURL}import/products`
        else if (type === 'importDiets')
            url = `${apiURL}import/diets`
        else if (type === 'importAilments')
            url = `${apiURL}import/ailments`
        else if (type === 'importExercises')
            url = `${apiURL}sport/import/exercises`
        else if (type === 'importTrainings')
            url = `${apiURL}sport/import/trainings`
        return axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    async uploadFile(data, type, token, id) {
        let url;
        if (type === 'roleRequest')
            url = `${apiURL}role-request/import/${id}/`
        else if (type === 'profilePicture')
            url = `${apiURL}profile/import`
        else if (type === 'postPicture')
            url = `${apiURL}post/import/${id}`
        else if (type === 'exerciseVideo')
            url = `${apiURL}sport/exercise/import/${id}`
        else if (type === 'dishPicture')
            url = `${apiURL}dish/${id}/photo`
        return axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            console.log(response.data)
        }).catch(error => {
            console.log(error.response)
        });
    },
    downloadPdfFile(url, token) {
        axios.get(url, {
            headers: {Authorization: `Bearer ${token}`, 'Accept': 'application/pdf'},
            responseType: 'arraybuffer'
        }).then((response) => {
            const blob = new Blob([response.data], {type: 'application/pdf'})
            const objectUrl = window.URL.createObjectURL(blob)
            window.open(objectUrl)
        }).catch(error => {
            console.log(error.response.status)
        });
    },
    async downloadPhoto(url, token) {
        let data
        const urlCreator = window.URL || window.webkitURL;
        return axios.get(url, {
            headers: {Authorization: `Bearer ${token}`, 'Accept': 'image/png'},
            responseType: 'arraybuffer'
        }).then((response) => {
            if (response.status !== 204) {
                data = new Blob([response.data], {type: 'image/png'})
                return urlCreator.createObjectURL(data);
            }
            else return  ''
        }).catch(() => {
            return ''
        });
    },
    async downloadMp4Video(url, token) {
        let data
        const urlCreator = window.URL || window.webkitURL;
        return axios.get(url, {
            headers: {Authorization: `Bearer ${token}`, 'Accept': 'image/png'},
            responseType: 'arraybuffer'
        }).then((response) => {
            data = new Blob([response.data], {type: 'video/mp4'})
            return urlCreator.createObjectURL(data);
        }).catch(error => {
            console.log(error.response.status)
            return data
        });
    },
    truncate(text, length, suffix) {
        if (text.length > length) {
            return text.substring(0, length) + suffix;
        } else {
            return text;
        }
    },
    formatDate(date) {
        if (date) {
            return moment(String(date)).format('DD/MM/YYYY')
        }
    },
    formatTime(date) {
        if (date) {
            return moment(String(date)).format('HH:mm')
        }
    },
    formatDateTime(date) {
        if (date) {
            return moment(String(date)).format('DD/MM/YYYY HH:mm')
        }
    },
    formatDateTimeFeed(date) {
        if (date) {
            return moment(String(date)).format('YYYY/MM/DD HH:mm')
        }
    },
    formatDateDatePicker(date) {
        if (date) {
            return moment(String(date)).format('YYYY-MM-DD')
        }
    },
    formatDateDateFromNow(date) {
        if (date) {
            return moment(String(date)).locale('pl').fromNow()
        }
    },
    getIsActive5minutes(userLastRequestTime) {
        let duration = moment.duration(moment(new Date()).diff(userLastRequestTime));
        let minutes = duration.asMinutes()
        return minutes < 5
    },
    convertNewLines(text) {
        if (text)
            return text.replaceAll('\n', '<br />')
        else
            return null
    },
    mapCommentForm(counter) {
        if (counter === 1)
            return 'komentarz'
        else if (counter === 12 || counter === 13 || counter === 14)
            return 'komentarzy'
        else if (counter % 10 === 2 || counter % 10 === 3 || counter % 10 === 4)
            return 'komentarze'
        else
            return 'komentarzy'
    },
    mapShareForm(counter) {
        if (counter === 1)
            return 'udostępnienie'
        else if (counter === 12 || counter === 13 || counter === 14)
            return 'udostępnień'
        else if (counter % 10 === 2 || counter % 10 === 3 || counter % 10 === 4)
            return 'udostępnienia'
        else
            return 'udostępnień'
    },
    mapRole(role) {
        if (role === 'ROLE_DIETICIAN')
            return 'Dietetyk'
        else if (role === 'ROLE_DOCTOR')
            return 'Lekarz'
        else if (role === 'ROLE_TRAINER')
            return 'Trener'
        else if (role === 'ROLE_ADMIN')
            return 'Admin'
        else if (role === 'ROLE_BASIC_USER')
            return 'Podstawowy użytkownik'
        else
            return 'Brak informacji'
    },
    mapRoleRequestStatus(status) {
        if (status === 'ACCEPTED')
            return 'Zaakceptowano'
        else if (status === 'REJECTED')
            return 'Odrzucono'
        else if (status === 'PENDING')
            return 'Oczekujące'
        else if (status === 'CANCELLED')
            return 'Anulowano'
        else
            return 'Brak informacji'
    },
    mapSportTag(tag) {
        if (tag === 'WEIGHT_TRAINING')
            return 'Trening siłowy'
        else if (tag === 'CARDIO')
            return 'Trening kardio'
        else if (tag === 'PILATES')
            return 'Pilates'
        else if (tag === 'YOGA')
            return 'Joga'
        else
            return 'Brak informacji'
    },
    mapNutritionTag(tag) {
        if (tag === 'VEGETARIAN')
            return 'Dieta wegetariańska'
        else if (tag === 'VEGAN')
            return 'Dieta wegańska'
        else if (tag === 'GLUTEN_FREE')
            return 'Dieta bezglutenowa'
        else
            return 'Brak informacji'
    },
    mapExerciseType(type) {
        if (type === 'STRENGTH')
            return 'Siłowe'
        else if (type === 'CARDIO')
            return 'Kardio'
        else if (type === 'OTHER')
            return 'Inne'
        else
            return 'Brak informacji'
    },
    mapTrainingDifficulty(difficulty) {
        if (difficulty === 'EASY')
            return 'Łatwy'
        else if (difficulty === 'MEDIUM')
            return 'Średni'
        else if (difficulty === 'HARD')
            return 'Trudny'
        else
            return 'Brak informacji'
    },
    mapTimeOfDay(timeOfDay) {
        if (timeOfDay === 'MORNING')
            return 'Poranek'
        else if (timeOfDay === 'NOON')
            return 'Południe'
        else if (timeOfDay === 'AFTERNOON')
            return 'Popołudnie'
        else if (timeOfDay === 'EVENING')
            return 'Wieczór'
        else if (timeOfDay === 'NIGHT')
            return 'Noc'
        else
            return 'Brak informacji'
    },
    mapTrainingPlanStatus(status) {
        if (status === 'STARTED')
            return 'Rozpoczęty'
        else if (status === 'PLANNED')
            return 'Zaplanowany'
        else if (status === 'COMPLETED')
            return 'Wykonany'
        else if (status === 'TEMPLATE')
            return 'Wzorzec'
        else if (status === 'OWN_MEASURES')
            return 'Własne pomiary'
        else if (status === 'SCRATCH')
            return 'Roboczy'
        else
            return 'Brak informacji'
    },
    dateDayMonth(date) {
        date = new Date(date)
        return date.getDate().toString().padStart(2, '0') + '.' + eval(date.getMonth() + 1).toString().padStart(2, '0');
    },
    getTimePrettyFromSeconds(seconds) {
        if (seconds < 60) {
            return seconds + ' s'
        } else if (seconds < 3600) {
            return Math.floor(seconds / 60) + ' min'
        } else if (seconds >= 3600) {
            let hours = Math.floor(seconds / 3600)
            let minutes = Math.floor((seconds - hours * 3600) / 60)
            return hours + ' h ' + (minutes !== 0 ? minutes + ' min' : '')
        }
    },
    getWeekRangeFromMonday(mondayDate) {
        let from = mondayDate.getDate().toString().padStart(2, '0') + '.' + eval(mondayDate.getMonth() + 1).toString().padStart(2, '0');
        mondayDate.setDate(mondayDate.getDate() + 6);
        let to = mondayDate.getDate().toString().padStart(2, '0') + '.' + eval(mondayDate.getMonth() + 1).toString().padStart(2, '0');
        return from + " - " + to
    },
    getDatesArrayFromMonday(d1) {
        let weekDays = []
        for (let i = 0; i < 7; i++) {
            weekDays.push({
                day: this.days[i],
                date: d1.addDays(i)
            })
        }
        return weekDays;
    },
    generateNWeeks(n) {
        let week = new Date().getWeek()
        let currentMondayDate = moment().clone().isoWeekday(1).startOf('day').toDate()
        let weekArray = []
        for (let i = 0; i < n; i++) {
            weekArray.push({
                weekNo: week + i,
                beginningDate: currentMondayDate.addDays(i * 7),
                range: this.getWeekRangeFromMonday(currentMondayDate.addDays(i * 7))
            })
        }
        return weekArray;
    },
    mapSex(sex) {
        if (sex == 'WOMAN')
            return "Kobieta"
        else if (sex == 'MAN')
            return "Mężczyzna"
        else
            return 'Brak informacji'
    },
    mapBoolean(state) {
        if (state)
            return "Tak"
        else
            return "Nie"
    },
    mapActivity(activity) {
        if (activity == 'VERY_LOW')
            return "Bardzo niska"
        else if (activity == "LOW")
            return "Niska"
        else if (activity == "MEDIUM")
            return "Średnia"
        else if (activity == "HIGH")
            return "Wysoka"
        else if (activity == "VERY_HIGH")
            return "Bardzo wysoka"
        else
            return "Brak informacji"
    },
    mapDietGoal(goal) {
        if (goal == 'FAST_LOSE_WEIGHT')
            return "Szybka utrata wagi"
        else if (goal == "LOSE_WEIGHT")
            return "Utrata wagi"
        else if (goal == "KEEP_WEIGHT")
            return "Utrzymanie wagi"
        else if (goal == "GAIN_WEIGHT")
            return "Przybranie na wadze"
        else if (goal == "FAST_GAIN_WEIGHT")
            return "Szybkie przybranie na wadze"
        else if (goal == "GAIN_MUSCLES")
            return "Budowa masy mięśniowej"
        else
            return "Brak informacji"
    },
    mapAilmentType(ailmentType) {
        if (ailmentType == 'ALLERGY')
            return "Alergia"
        else if (ailmentType == "ILLNESS")
            return "Choroba"
        else if (ailmentType == "INJURY")
            return "Kontuzja"
        else if (ailmentType == "PHYSICAL_CONDITION")
            return "Stan fizyczny"
        else
            return "Brak informacji"
    },
    mapBMIResult(result) {
        if (result == 'SEVERELY_UNDERWEIGHT')
            return "Wychudzenie"
        else if (result == 'UNDERWEIGHT')
            return "Niedowaga"
        else if (result == "HEALTHY")
            return "Waga w normie"
        else if (result == "OVERWEIGHT")
            return "Nadwaga"
        else if (result == "OBESE")
            return "Otyłość"
        else
            return "Nieznany"
    },
    mapMeal(meal) {
        if (meal == 'BREAKFAST')
            return "ŚNIADANIE"
        else if (meal == 'LUNCH')
            return "LUNCH"
        else if (meal == "DINNER")
            return "OBIAD"
        else if (meal == "SNACK")
            return "PRZEKĄSKA"
        else if (meal == "SUPPER")
            return "KOLACJA"
        else
            return "Nieznany"
    },
    mapGlycemicIndex(index) {
        if (index == 'VERY_LOW')
            return "Bardzo niski (0, 10)"
        if (index == 'LOW')
            return "Niski (11, 30)"
        else if (index == 'MEDIUM')
            return "Średni (31, 50)"
        else if (index == "HIGH")
            return "Wysoki (51, 70)"
        else if (index == "VERY_HIGH")
            return "Bardzo wysoki (71, 100)"
        else if (index == "ANY_RECOMMENDED")
            return "Niski/średni (0, 50)"
        else if (index == "ANY")
            return "Dowolny"
        else
            return " "
    },
    mapGlycemicIndexShort(index) {
        if (index == 'VERY_LOW')
            return "(0, 10)"
        if (index == 'LOW')
            return "(11, 30)"
        else if (index == 'MEDIUM')
            return "(31, 50)"
        else if (index == "HIGH")
            return "(51, 70)"
        else if (index == "VERY_HIGH")
            return "(71, 100)"
        else if (index == "ANY_RECOMMENDED")
            return "(0, 50)"
        else if (index == "ANY")
            return "(0, 100)"
        else
            return " "
    },
    mapMeasure(measure) {
        if (measure == 'GRAM')
            return "g"
        else if (measure == 'MILLI_GRAM')
            return "mg"
        else if (measure == "MICRO_GRAM")
            return "mcg"
        else if (measure == "KILO_GRAM")
            return "kg"
        else
            return "Nieznana"
    },
    mapPlanRequestStatus(status) {
        if (status === 'SUBMITTED')
            return 'Złożone'
        else if (status === 'SEEN')
            return 'Wyświetlone'
        else if (status === 'ACCEPTED')
            return 'Zaakceptowane'
        else if (status === 'DENIED')
            return 'Odrzucone'
        else if (status === 'CANCELLED')
            return 'Anulowane'
        else if (status === 'COMPLETED')
            return 'Zrealizowane'
        else
            return 'Brak informacji'
    },
    mapVitamin(vit) {
        if (vit == 'FOLIC_ACID')
            return 'Kwas foliowy [mcg]'
        else if (vit == 'BIOTIN')
            return 'Biotyna [mcg]'
        else if (vit == 'A')
            return 'A [mcg]'
        else if (vit == 'B1')
            return 'B1 [mg]'
        else if (vit == 'B2')
            return 'B2 [mg]'
        else if (vit == 'B5')
            return 'B5 [mg]'
        else if (vit == 'B6')
            return 'B6 [mg]'
        else if (vit == 'B12')
            return 'B12 [mcg]'
        else if (vit == 'C')
            return 'C [mg]'
        else if (vit == 'D')
            return 'D [mcg]'
        else if (vit == 'E')
            return 'E [mg]'
        else if (vit == 'PP')
            return 'PP [mg]'
        else if (vit == 'K')
            return 'K [mg]'
        else
            return vit
    },
    mapMacro(macro) {
        if (macro == 'VEGETABLE_PROTEINS')
            return 'Białka roślinne [g]'
        else if (macro == 'ANIMAL_PROTEINS')
            return 'Białka zwierzęce [g]'
        else if (macro == 'POLYUNSATURATED_FATS')
            return 'Tłuszcze wielonienasycone [g]'
        else if (macro == 'MONOUNSATURATED_FATS')
            return 'Tłuszcze jednonienasycone [g]'
        else
            return macro
    },
    mapMineral(mineral) {
        if (mineral == 'ZINC')
            return 'Cynk [mg]'
        else if (mineral == 'PHOSPHORUS')
            return 'Fosfor [mg]'
        else if (mineral == 'IODINE')
            return 'Jod [mcg]'
        else if (mineral == 'MAGNESIUM')
            return 'Magnez [mg]'
        else if (mineral == 'COPPER')
            return 'Miedź [mg]'
        else if (mineral == 'POTASSIUM')
            return 'Potas [mg]'
        else if (mineral == 'SELENIUM')
            return 'Selen [mcg]'
        else if (mineral == 'SODIUM')
            return 'Sód [mg]'
        else if (mineral == 'CALCIUM')
            return 'Wapń [mg]'
        else if (mineral == 'Iron')
            return 'Żelazo [mg]'
        else
            return mineral
    },
    mapPublished(draft) {
        if (draft)
            return "Szkic"
        else
            return "Opublikowane"
    },
    mapDay(day) {
        if (day == 'MONDAY')
            return 'Poniedziałek'
        else if (day == 'TUESDAY')
            return 'Wtorek'
        else if (day == 'WEDNESDAY')
            return 'Środa'
        else if (day == 'THURSDAY')
            return 'Czwartek'
        else if (day == 'FRIDAY')
            return 'Piątek'
        else if (day == 'SATURDAY')
            return 'Sobota'
        else if (day == 'SUNDAY')
            return 'Niedziela'
    },
    mealsList() {
        return ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'SUPPER']
    },
    proteinCalories() {
        return 4
    },
    fatCalories() {
        return 9
    },
    carbCalories() {
        return 4
    },
    mapActivityGoal(goal) {
        if (goal === 'LOSE_WEIGHT')
            return 'Chudnięcie'
        if (goal === 'GAIN_WEIGHT')
            return 'Przybranie na wadze'
        if (goal === 'MAINTAIN_WEIGHT')
            return 'Utrzymanie wagi'
        if (goal === 'EXTEND_LUNGS_CAPACITY')
            return 'Zwiększenie kondycji'
        if (goal === 'BUILD_MUSCLE')
            return 'Budowanie mięśni'
        else
            return goal
    },
    mapWorkoutStrategy(strategy) {
        if (strategy === 'ONLY_WORKOUT')
            return 'Tylko trening - 90:10'
        if (strategy === 'MOSTLY_WORKOUT')
            return 'Głównie trening - 75:25'
        if (strategy === 'EVEN')
            return 'Po równo - 50:50'
        if (strategy === 'MOSTLY_DIET')
            return 'Głównie dieta - 25:75'
        if (strategy === 'ONLY_DIET')
            return 'Tylko dieta - 10:90'
        else
            return strategy
    },
    days: [
        {
            num: 1,
            name: 'Poniedziałek',
            short: 'PON'
        },
        {
            num: 2,
            name: 'Wtorek',
            short: 'WT'
        },
        {
            num: 3,
            name: 'Środa',
            short: 'ŚR'
        },
        {
            num: 4,
            name: 'Czwartek',
            short: 'CZW'
        },
        {
            num: 5,
            name: 'Piątek',
            short: 'PT'
        },
        {
            num: 6,
            name: 'Sobota',
            short: 'SOB'
        },
        {
            num: 0,
            name: 'Niedziela',
            short: 'ND'
        }
    ]
}
