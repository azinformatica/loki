<template>
    <div style="display: flex;">
        <div v-bind:style="dateTime ? 'width: 60%' : 'width: 100%'">
            <v-dialog
                ref="menu"
                :close-on-content-click="false"
                v-model="dialogDate"
                nudge-right="450"
                nudge-bottom="120"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
                v-if="!isDisabled"
            >
                <v-date-picker
                    v-model="date"
                    :value="value"
                    :locale="currentLanguage"
                    @input="
                        pickDateEvent()
                        updateModelDate($event)
                    "
                    :min="minDate"
                    :max="maxDate"
                    class="az-date"
                />
            </v-dialog>
            <v-text-field
                v-validate="{ required: isRequired }"
                :name="nameDate"
                :error-messages="errors.collect(`${nameDate}`)"
                v-model="dateFormatted"
                :label="label"
                mask="date"
                :placeholder="dateFormat"
                :disabled="isDisabled"
                :min-date="minDate"
                :max-date="maxDate"
                append-icon="event"
                @click:append="openMenuDate"
                @keyup="validateDate"
                @blur="
                    validateAndParseDate(dateFormatted)
                    updateModelDate(date)">
                <template v-slot:label if="this.$slots['label-date']">
                    <slot name="label-date" />
                </template>
            </v-text-field>
        </div>
        <div v-if="dateTime" style="margin-left: 10px; width: 40%">
            <v-dialog
                ref="menu"
                :close-on-content-click="false"
                v-model="dialogTime"
                nudge-right="540"
                nudge-bottom="120"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
                v-if="!isDisabled"
            >
                <v-time-picker
                    v-if="dialogTime"
                    v-model="time"
                    :locale="currentLanguage"
                    @change="
                        changeTimeEvent()
                        updateModelTime($event)
                    "
                    format="24hr"
                    class="az-date"
                />
            </v-dialog>
            <v-text-field
                v-validate="{ required: isRequired }"
                :name="nameHour"
                :error-messages="errors.collect(`${nameHour}`)"
                :disabled="isDisabled"
                v-model="timeFormatted"
                mask="time"
                placeholder="HH:mm"
                append-icon="access_time"
                @click:append="openMenuTime"
                @focus="selectContentInputHour"
                @blur="
                    validateTimeEvent()
                    updateModelTime(time)
                "
            ></v-text-field>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        dateFormat: {
            type: String,
            default: 'DD/MM/YYYY',
            validator: function(value) {
                return ['DD/MM/YYYY', 'MM/DD/YYYY'].indexOf(value) !== -1
            }
        },
        limparData:{
            type: Boolean,
            default: false
        },
        dateTime: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        isRequired: {
            type: Boolean,
            default: false
        },
        nameDate: {
            type: String,
            default: ''
        },
        nameHour: {
            type: String,
            default: ''
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        minDate:{
            type: String
        },
        maxDate:{
            type: String
        }
    },
    inject: ['$validator'],
    data() {
        return {
            date: null,
            dateFormatted: null,
            dateInvalid: false,
            time: null,
            timeFormatted: null,
            dialogDate: false,
            dialogTime: false,
            reverseDateFormatObj: {
                'DD/MM/YYYY': 'YYYY-MM-DD',
                'MM/DD/YYYY': 'YYYY-DD-MM'
            }
        }
    },
    computed: {
        reverseDateFormat() {
            return this.reverseDateFormatObj[this.dateFormat]
        },
        currentLanguage() {
            return this.$vuetify.lang.current
        }
    },
    watch: {
        value(val) {
            this.updateDateTimeByModel(val)
        },
        limparData(val){
            if(val) {
                 this.dateFormatted = null
            }
        }
    },
    methods: {
        getFormattedDate(day, month, year) {
            const getFnDateFormat = {
                'DD/MM/YYYY': function() {
                    return `${day}/${month}/${year}`
                },
                'MM/DD/YYYY': function() {
                    return `${month}/${day}/${year}`
                }
            }

            return getFnDateFormat[this.dateFormat]()
        },
        formatDate(date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return this.getFormattedDate(day, month, year)
        },
        pickDateEvent() {
            this.dialogDate = false
            this.dateFormatted = this.formatDate(this.date)
        },
        validateAndParseDate(date) {
            if (!date || !this.dateStringIsValid(date)  || this.dateMaxIsAllowed(date) || this.dateMinIsAllowed(date)) {
                this.date = null
                this.dateFormatted = ''
                return
            }

            const dateObj = this.getDayMonthYearFromDateString(date)

            this.date = `${dateObj.year}-${dateObj.month}-${dateObj.day}`
        },
        validateDate() {
            this.dateInvalid = false
            if (this.dateFormatted && !this.dateStringIsValid(this.dateFormatted)) {
                this.dateInvalid = true
            }
        },
        getDayMonthYearFromDateString(date) {
            const dateFormated = date.replace(new RegExp('/', 'g'), '');
            const getFnDateFormat = {
                'DD/MM/YYYY': function() {
                    return {
                        day: dateFormated.substring(0, 2),
                        month: dateFormated.substring(2, 4),
                        year: dateFormated.substring(4, 8)
                    }
                },
                'MM/DD/YYYY': function() {
                    return {
                        day: dateFormated.substring(2, 4),
                        month: dateFormated.substring(0, 2),
                        year: dateFormated.substring(4, 8)
                    }
                }
            }

            return getFnDateFormat[this.dateFormat]()
        },
        dayIsValidForMonthAndYear(day, month, year) {
            let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            const isLeapYear = (!(year % 4) && year % 100) || !(year % 400)

            if (isLeapYear) {
                daysInMonth[1] = 29
            }

            return day > 0 && day <= daysInMonth[--month]
        },
        dateStringIsValid(date) {
            if (date.length < 8) return false

            const dateObj = this.getDayMonthYearFromDateString(date)

            const monthIsValid = Number(dateObj.month) > 0 && Number(dateObj.month) < 13
            const yearIsValid = Number(dateObj.year) > 999

            if (!monthIsValid || !yearIsValid) return false

            return this.dayIsValidForMonthAndYear(Number(dateObj.day), Number(dateObj.month), Number(dateObj.year))
        },
        timeStringIsValid() {
            if (!this.timeFormatted || this.timeFormatted.length < 4) return false

            const firstTimeDigit = Number(this.timeFormatted.substring(0, 2))
            const secondTimeDigit = Number(this.timeFormatted.substring(2, 4))

            return firstTimeDigit < 24 && secondTimeDigit < 60
        },
        validateTimeEvent() {
            if (!this.timeStringIsValid()) {
                this.time = null
                this.timeFormatted = ''
                return
            }

            const hour = this.timeFormatted.substring(0, 2)
            const minute = this.timeFormatted.substring(2, 4)

            this.time = hour + ':' + minute
        },
        changeTimeEvent() {
            this.timeFormatted = this.time.replace(':', '')
            this.$refs.menu.save(this.time)
        },
        openMenuDate() {
            this.dialogDate = true
        },
        openMenuTime() {
            this.dialogTime = true
        },
        setEmptyTimeAndDate() {
            this.time = null
            this.timeFormatted = ''
            this.date = null
            this.dateFormatted = ''
        },
        updateModelDate(value) {
            this.dateInvalid = false
            if (this.time && value) {
                const dateTimeWithTimezone = this.buildDateTimeWithTimezone(value, this.time)
                const dateTimeTimezoneZero = this.getDateTimeZeroTimezone(dateTimeWithTimezone)
                this.$emit('input', dateTimeTimezoneZero)
                return
            }
            if (this.time && !value) {
                this.$emit('input', value)
                return
            }
            if (!this.time && !value) {
                this.$emit('input', null)
                return
            }
            if (!this.time) {
                const dateTimeWithTimezone = this.buildDateTimeWithTimezone(value, '00:00')
                const dateTimeTimezoneZero = this.getDateTimeZeroTimezone(dateTimeWithTimezone)
                this.$emit('input', dateTimeTimezoneZero)
                this.selectContentInputHour()
            }
        },
        updateModelTime(value) {
            if (this.date && value) {
                const dateTimeWithTimezone = this.buildDateTimeWithTimezone(this.date, value)
                const dateTimeTimezoneZero = this.getDateTimeZeroTimezone(dateTimeWithTimezone)
                this.$emit('input', dateTimeTimezoneZero)
                return
            }
            if (this.date && !value) this.$emit('input', this.date)
        },
        updateDateTimeByModel(modelVal) {
            const maxLengthOfModelDateWithTime = 28

            if (!modelVal || modelVal.length > maxLengthOfModelDateWithTime) {
                this.setEmptyTimeAndDate()
                return
            }

            if (this.dateTime) this.updateDateWithTimeByModel(modelVal)
            else this.updateDateWithoutTimeByModel(modelVal)
        },
        updateDateWithTimeByModel(modelVal) {
            const maxLengthOfModel = 28,
                dateModelLength = 10,
                dateModelWithSeparatorLength = 11

            if (modelVal.length > dateModelWithSeparatorLength && modelVal.length < maxLengthOfModel) {
                this.time = null
                this.timeFormatted = ''
                return
            } else if (modelVal && modelVal.length < dateModelLength) {
                this.date = null
                this.dateFormatted = ''
                return
            }

            if (modelVal.length === dateModelLength) {
                this.date = modelVal
                this.dateFormatted = this.formatDate(modelVal)
            } else if (modelVal.length === maxLengthOfModel) {
                const dateTime = this.getDateTimeWithSystemTimezone(modelVal)
                const splitDateTime = dateTime.split('T')
                this.date = splitDateTime[0]
                this.dateFormatted = this.formatDate(this.date)
                this.time = splitDateTime[1].substring(0, 5)
                this.changeTimeEvent()
            }
        },
        updateDateWithoutTimeByModel(modelVal) {
            const maxDateModelLength = 10

            if (modelVal.length < maxDateModelLength) {
                this.date = null
                this.dateFormatted = ''
                return
            }

            if (modelVal.length >= maxDateModelLength) {
                this.date = modelVal.substring(0, maxDateModelLength)
                this.dateFormatted = this.formatDate(this.date)
            }
        },
        getDateTimeWithSystemTimezone(dateTime) {
            const offset = this.getOffsetFromCurrentDateTime(dateTime)
            return this.moment(dateTime)
                .utcOffset(offset)
                .format(this.reverseDateFormat + 'THH:mm:ss.SSSZZ')
        },
        getDateTimeZeroTimezone(dateTime) {
            return this.moment(dateTime)
                .utcOffset('+0000')
                .format(this.reverseDateFormat + 'THH:mm:ss.SSSZZ')
        },
        buildDateTimeWithTimezone(date, time) {
            const seconds = '00'
            const dateTime = date + 'T' + time + ':' + seconds
            const offset = this.getOffsetFromCurrentDateTime(dateTime)
            return dateTime + offset
        },
        getOffsetFromCurrentDateTime(dateTime) {
            return this.moment(dateTime)
                .tz(this.$store.state.loki.timezone)
                .format('Z')
        },
        selectContentInputHour() {
            this.$nextTick(() => {
                const input = document.getElementsByName(this.nameHour)[0]
                if (input) {
                    input.setSelectionRange(0, 5)
                }
            })
        },
        dateMinIsAllowed(date){
            if(this.minDate){
                const dateObj = this.getDayMonthYearFromDateString(date)
                const minDateObj = this.getDayMonthYearFromDateString(this.moment(this.minDate).format('DD/MM/YYYY'))
                if (dateObj.year < minDateObj.year){
                    return true
                }else if(dateObj.month < minDateObj.month){
                    return true
                }else if (dateObj.day < minDateObj.day && dateObj.month === minDateObj.month){
                    return  true
                }
            }
            return false
        },
        dateMaxIsAllowed(date){
            if(this.maxDate){
                const dateObj = this.getDayMonthYearFromDateString(date)
                const maxDateObj = this.getDayMonthYearFromDateString(this.moment(this.maxDate).format('DD/MM/YYYY'))
                if (dateObj.year > maxDateObj.year){
                    return true
                }else if(dateObj.month > maxDateObj.month){
                    return true
                }else if (dateObj.day > maxDateObj.day && dateObj.month === maxDateObj.month){
                    return  true
                }
            }
            return false
        }
    }
}
</script>

<style lang="stylus">
.az-date
    .v-picker__title
        padding 10px 15px

    .v-date-picker-title__date
        font-size 20px

    .v-time-picker-title__time .v-picker__title__btn, .v-time-picker-title__time span
        font-size 40px
        height 50px

    .v-time-picker-title
        -webkit-box-pack center
        -ms-flex-pack center
        justify-content center
</style>
